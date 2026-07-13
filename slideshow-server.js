import express from "express";
import cors from "cors";
import axios from "axios";
import { Downloader } from "@tobyg74/tiktok-api-dl";

const app = express();
const PORT = process.env.SLIDESHOW_PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * POST /tiktok/preview
 * Body: { url: "https://www.tiktok.com/@user/photo/1234567890" }
 * Returns the same shape your Flask /api/preview used to return for slideshows.
 */
app.post("/tiktok/preview", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: "Missing url in request body" });
  }

  try {
    const result = await Downloader(url, { version: "v3" });

    if (!result || result.status !== "success") {
      return res.status(500).json({ success: false, error: "Failed to fetch TikTok data" });
    }

    const data = result.result;

    // Slideshow / photo post
    if (data.type === "image" && Array.isArray(data.images)) {
      const slides = data.images.map((imgUrl, i) => ({
        index: i,
        thumbnail: imgUrl,
        url: imgUrl,
      }));

      return res.json({
        success: true,
        type: "slideshow",
        title: data.desc || "TikTok Slideshow",
        thumbnail: data.images[0],
        uploader: data.author?.nickname || data.author?.username || "TikTok User",
        item_count: slides.length,
        slides,
      });
    }

    // Shouldn't happen for /photo/ URLs, but handle gracefully
    return res.status(422).json({ success: false, error: "This URL does not appear to be a TikTok slideshow" });

  } catch (err) {
    console.error("Preview error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /tiktok/download
 * Body: { url: "https://...", index: 0 }
 * Streams the slide image back to the client as a file download.
 */
app.post("/tiktok/download", async (req, res) => {
  const { url, index } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing url in request body" });
  }

  try {
    const result = await Downloader(url, { version: "v3" });

    if (!result || result.status !== "success") {
      return res.status(500).json({ error: "Failed to fetch TikTok data" });
    }

    const data = result.result;
    let imageUrl = null;

    if (data.type === "image" && Array.isArray(data.images)) {
      const slideIndex = typeof index === "number" ? index : 0;
      imageUrl = data.images[slideIndex];
    } else if (data.cover) {
      imageUrl = data.cover;
    }

    if (!imageUrl) {
      return res.status(404).json({ error: "Slide not found" });
    }

    // Proxy the image to the client
    const imageResponse = await axios.get(imageUrl, {
      responseType: "stream",
      headers: {
        Referer: "https://www.tiktok.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const slideNum = (typeof index === "number" ? index : 0) + 1;
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tiktok_slide_${slideNum}.jpg"`
    );

    imageResponse.data.pipe(res);
  } catch (err) {
    console.error("Download error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Slideshow server running on http://localhost:${PORT}`);
});
