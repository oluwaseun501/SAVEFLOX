import express from "express";
import cors from "cors";
import axios from "axios";
import { Downloader } from "@tobyg74/tiktok-api-dl";

const app = express();
const PORT = process.env.PORT || process.env.SLIDESHOW_PORT || 3001;

app.use(cors());
app.use(express.json());

function getVideoUrl(data) {
  return (
    data?.video?.noWatermark ||
    data?.video?.no_watermark ||
    data?.video?.play ||
    data?.play ||
    data?.videoUrl ||
    data?.url ||
    null
  );
}

function getCoverUrl(data) {
  return (
    data?.cover ||
    data?.video?.cover ||
    data?.dynamicCover ||
    data?.video?.dynamicCover ||
    ""
  );
}

async function getTikTokData(url) {
  const result = await Downloader(url, { version: "v3" });

  if (!result || result.status !== "success") {
    throw new Error("Failed to fetch TikTok data");
  }

  return result.result;
}

async function proxyFile(res, fileUrl, contentType, filename) {
  const response = await axios.get(fileUrl, {
    responseType: "stream",
    headers: {
      Referer: "https://www.tiktok.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    },
  });

  res.setHeader("Content-Type", contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  response.data.pipe(res);
}

app.post("/tiktok/preview", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Missing url in request body",
    });
  }

  try {
    const data = await getTikTokData(url);

    // TikTok slideshow/photo post
    if (data.type === "image" && Array.isArray(data.images)) {
      const slides = data.images.map((imageUrl, index) => ({
        index,
        url: imageUrl,
        thumbnail: imageUrl,
      }));

      return res.json({
        success: true,
        type: "slideshow",
        title: data.desc || "TikTok Slideshow",
        thumbnail: data.images[0] || "",
        uploader:
          data.author?.nickname ||
          data.author?.username ||
          "TikTok User",
        item_count: slides.length,
        slides,
      });
    }

    // TikTok regular video
    const videoUrl = getVideoUrl(data);

    if (videoUrl) {
      return res.json({
        success: true,
        type: "video",
        platform: "tiktok",
        title: data.desc || "TikTok Video",
        thumbnail: getCoverUrl(data),
        uploader:
          data.author?.nickname ||
          data.author?.username ||
          "TikTok User",
        duration: data.duration || "Unknown",
        formats: [
          {
            format_id: "best",
            ext: "mp4",
            height: null,
          },
        ],
      });
    }

    return res.status(422).json({
      success: false,
      error: "No playable TikTok media was found",
    });
  } catch (error) {
    console.error("TikTok preview error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message || "TikTok preview failed",
    });
  }
});

app.post("/tiktok/download", async (req, res) => {
  const { url, index } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Missing url in request body",
    });
  }

  try {
    const data = await getTikTokData(url);

    // Download one slideshow image
    if (data.type === "image" && Array.isArray(data.images)) {
      const slideIndex = Number.isInteger(index) ? index : 0;
      const imageUrl = data.images[slideIndex];

      if (!imageUrl) {
        return res.status(404).json({
          success: false,
          error: "Slide not found",
        });
      }

      return await proxyFile(
        res,
        imageUrl,
        "image/jpeg",
        `tiktok_slide_${slideIndex + 1}.jpg`
      );
    }

    // Download regular TikTok video
    const videoUrl = getVideoUrl(data);

    if (!videoUrl) {
      return res.status(404).json({
        success: false,
        error: "TikTok video URL was not found",
      });
    }

    return await proxyFile(
      res,
      videoUrl,
      "video/mp4",
      "tiktok_video.mp4"
    );
  } catch (error) {
    console.error("TikTok download error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message || "TikTok download failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`TikTok server running on port ${PORT}`);
});