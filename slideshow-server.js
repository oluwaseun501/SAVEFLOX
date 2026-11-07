import express from "express";
import cors from "cors";
import axios from "axios";
import puppeteer from "puppeteer";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.SLIDESHOW_PORT || 3001;

app.use(cors());
app.use(express.json());

// ============ MONGODB CONNECTION ============
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://holuwaconquer488:mongodb@cluster0.ikmidho.mongodb.net/saveflux?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.MONGO_DB || 'saveflux';

let db;
let downloadLogsCollection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    downloadLogsCollection = db.collection('download_logs');
    console.log("✅ Connected to MongoDB for logging");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}
connectDB();

// Helper to save logs to MongoDB
async function recordDownloadEvent(platform, url, format, quality, sizeBytes, status, req, error = null) {
  if (!downloadLogsCollection) return;
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    let device = 'Desktop';
    if (/mobile|iphone|android/i.test(userAgent)) device = 'Mobile';
    if (/ipad|tablet/i.test(userAgent)) device = 'Tablet';

    const event = {
      timestamp: new Date(),
      platform: platform.toLowerCase(),
      url: url,
      format: format.toUpperCase(),
      quality: quality,
      file_size: sizeBytes,
      status: status,
      ip: ip,
      user_agent: userAgent,
      device: device,
      country: 'Unknown', 
      city: '',
      isp: '',
      error: error,
    };
    await downloadLogsCollection.insertOne(event);
    console.log(`✅ Logged ${platform} download to MongoDB`);
  } catch (err) {
    console.error("Failed to log download event:", err.message);
  }
}
// ===========================================

function getVideoUrl(data, quality = "normal") {
  if (quality === "hd") return data?.videoHD || data?.videoSD || data?.videoWatermark || null;
  return data?.videoSD || data?.videoHD || data?.videoWatermark || null;
}

function getCoverUrl(data) {
  return data?.cover || data?.video?.cover || data?.dynamicCover || data?.author?.avatar || null;
}

async function getTikTokData(url) {
  const result = await Downloader(url, { version: "v3" });
  if (!result || result.status !== "success") throw new Error(result?.message || "Failed to fetch TikTok data");
  return result.result?.result || result.result;
}

async function proxyFile(res, fileUrl, contentType, filename) {
  const response = await axios.get(fileUrl, {
    responseType: "stream",
    headers: {
      Referer: "https://www.tiktok.com/",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    },
  });
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  response.data.pipe(res);
}

// ============ TIKTOK ROUTES ============
app.post("/tiktok/preview", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "Missing url" });
  try {
    const data = await getTikTokData(url);
    if (data.type === "image" && Array.isArray(data.images)) {
      const slides = data.images.map((imageUrl, index) => ({ index, url: imageUrl, thumbnail: imageUrl }));
      return res.json({ success: true, type: "slideshow", title: data.desc || "TikTok Slideshow", thumbnail: data.images[0] || "", uploader: data.author?.nickname || "TikTok User", item_count: slides.length, slides });
    }
    const videoUrl = getVideoUrl(data);
    if (videoUrl) return res.json({ success: true, type: "video", platform: "tiktok", title: data.desc || "TikTok Video", thumbnail: getCoverUrl(data), uploader: data.author?.nickname || "TikTok User", formats: [{ format_id: "best", ext: "mp4" }] });
    return res.status(422).json({ success: false, error: "No playable TikTok media found" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/tiktok/download", async (req, res) => {
  const { url, index, quality = "normal" } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "Missing url" });
  try {
    const data = await getTikTokData(url);
    if (data.type === "image" && Array.isArray(data.images)) {
      const slideIndex = Number.isInteger(index) ? index : 0;
      const imageUrl = data.images[slideIndex];
      if (!imageUrl) return res.status(404).json({ success: false, error: "Slide not found" });
      await recordDownloadEvent('tiktok', url, 'JPG', 'Image', 0, 'success', req);
      return await proxyFile(res, imageUrl, "image/jpeg", `tiktok_slide_${slideIndex + 1}.jpg`);
    }
    const videoUrl = getVideoUrl(data, quality);
    if (!videoUrl) return res.status(404).json({ success: false, error: "TikTok video URL not found" });
    await recordDownloadEvent('tiktok', url, 'MP4', quality === 'hd' ? 'HD' : 'SD', 0, 'success', req);
    return await proxyFile(res, videoUrl, "video/mp4", "tiktok_video.mp4");
  } catch (error) {
    await recordDownloadEvent('tiktok', url, 'MP4', 'Unknown', 0, 'failed', req, error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ============ SNAPCHAT SPOTLIGHT ROUTES (PUPPETEER) ============

async function getSnapchatMediaWithPuppeteer(url) {
  let browser;
  try {
    // Launch headless browser (Required for Snapchat)
    browser = await puppeteer.launch({
  headless: "new",
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage', // Fixes crashes in low-memory environments
    '--single-process',        // Saves RAM on free tiers
    '--no-zygote'
  ]
});
    const page = await browser.newPage();
    
    // Make it look like a real user
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Go to the URL and wait for the page to load
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract the JSON data directly from the browser window
    const result = await page.evaluate(() => {
      try {
        const scriptTag = document.getElementById('__NEXT_DATA__');
        if (!scriptTag) return { error: 'Could not find data script' };
        
        const jsonData = JSON.parse(scriptTag.innerHTML);
        const stories = jsonData?.props?.pageProps?.spotlightFeed?.spotlightStories;
        
        if (!stories || stories.length === 0) return { error: 'No stories found in page data' };
        
        const story = stories[0].story;
        const mediaUrl = story?.snapList?.[0]?.snapUrls?.mediaUrl;
        const previewUrl = story?.snapList?.[0]?.snapUrls?.mediaPreviewUrl?.value;
        const title = stories[0]?.metadata?.videoMetadata?.name || 'Snapchat Spotlight Video';

        if (!mediaUrl) return { error: 'Could not extract video URL' };

        return { success: true, title, thumbnail: previewUrl, videoUrl: mediaUrl };
      } catch (e) {
        return { error: e.message };
      }
    });

    if (result.error) throw new Error(result.error);
    return result;

  } catch (error) {
    console.error("Snapchat extraction error:", error.message);
    throw new Error(error.message || "Failed to extract Snapchat video");
  } finally {
    if (browser) await browser.close();
  }
}

app.post("/snapchat/preview", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "Missing url" });
  try {
    const data = await getSnapchatMediaWithPuppeteer(url);
    return res.json({
      success: true,
      type: "video",
      platform: "snapchat",
      title: data.title,
      thumbnail: data.thumbnail,
      formats: [{ format_id: "best", ext: "mp4" }],
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/snapchat/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "Missing url" });
  try {
    const data = await getSnapchatMediaWithPuppeteer(url);
    await recordDownloadEvent('snapchat', url, 'MP4', 'Best', 0, 'success', req);
    
    // Download file from Snapchat's servers and pipe to user
    const response = await axios.get(data.videoUrl, { responseType: "stream" });
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="snapchat_video.mp4"`);
    response.data.pipe(res);

  } catch (error) {
    await recordDownloadEvent('snapchat', url, 'MP4', 'Unknown', 0, 'failed', req, error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});