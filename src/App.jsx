import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tiktok from "./components/Tiktok";
import Twitter from "./components/Twitter";
import Instagram from "./components/Instagram";
import Facebook from "./components/Facebook";
import Pinterest from "./components/Pinterest";
import Mp3Converter from "./components/Mp3Converter";
import WhyChoose from "./components/WhyChoose";
import HowItWorks from "./components/HowItWorks";
import Blog from "./components/Blog";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Analytics from "./components/Analytics";
import DownloadLogs from "./components/DownloadLogs";
import MyBlog from "./components/MyBlog";
import AdSlot from "./components/AdSlot";
import NotFound from "./components/NotFound";
import BlogPost from "./components/BlogPost";
import PageLoader from "./components/PageLoader";
import TopProgressBar from "./components/TopProgressBar";
import Seo from "./components/Seo";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Copyright from "./pages/Copyright";
import Contact from "./pages/Contact";

import { isAuthenticated } from "./utils/auth";
import { useEffect, useState } from "react";
import GlideIn from "./components/GlideIn";

import { useVisitorTracking } from "./hooks/useVisitorTracking";

import adsBanner from "./ads/ads1.jpg";
import adsBanner2 from "./ads/ads2.jpg";
import adsBanner3 from "./ads/ads3.jpg";


function ProtectedAdmin({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function Home() {
  return (
    <>
      <GlideIn><Hero /></GlideIn>
      <AdSlot slot="home-top" format="leaderboard" image={adsBanner3} link="https://www.saveflox.com" />
      <GlideIn><WhyChoose /></GlideIn>
      <AdSlot slot="home-middle" format="leaderboard" image={adsBanner} link="https://www.saveflox.com" />
      <GlideIn><HowItWorks /></GlideIn>
      <AdSlot slot="home-bottom" format="leaderboard" image={adsBanner2} link="https://www.ghostnum.com" />
      <GlideIn><FAQ /></GlideIn>
    </>
  );
}


function App() {
  useVisitorTracking();
  const location = useLocation();
  const { pathname } = location;
  const isAdmin = pathname.startsWith("/admin");
const isAdminDomain = window.location.hostname === "admin.saveflox.com";
  const [loading, setLoading] = useState(false);

  const SITE_URL = "https://www.saveflox.com";
  const sharedKeywords =
    "video downloader, youtube downloader, tiktok downloader, snapchat downloader, instagram downloader, facebook downloader, pinterest downloader, online video downloader, save video, mp3 converter";

  const seo = {
    home: {
      title: "SaveFlox — Free Online Video Downloader",
      description:
        "SaveFlox is the fastest online video downloader for YouTube, TikTok, Snapchat, Instagram, Facebook, Pinterest and more.",
      keywords: sharedKeywords,
      canonical: `${SITE_URL}/`,
    },
    tiktok: {
      title: "TikTok Downloader — SaveFlox",
      description: "Download TikTok videos instantly with no watermark and save them as MP4 or MP3.",
      keywords: "tiktok downloader, tiktok video downloader, download tiktok video, save tiktok, tiktok mp3",
      canonical: `${SITE_URL}/tiktok-downloader`,
    },
    twitter: {
      title: "Twitter Downloader — SaveFlox",
      description: "Save Twitter videos and GIFs quickly online with SaveFlox, no app required.",
      keywords: "twitter downloader, twitter video downloader, download twitter video, save tweet video",
      canonical: `${SITE_URL}/twitter-downloader`,
    },
    instagram: {
      title: "Instagram Downloader — SaveFlox",
      description: "Download Instagram Reels, photos and videos in high quality with SaveFlox.",
      keywords: "instagram downloader, instagram video downloader, download instagram reel, save instagram video",
      canonical: `${SITE_URL}/instagram-downloader`,
    },
    facebook: {
      title: "Facebook Downloader — SaveFlox",
      description: "Download Facebook videos and stories online fast, without signing in.",
      keywords: "facebook downloader, facebook video downloader, download facebook video, save facebook video",
      canonical: `${SITE_URL}/facebook-downloader`,
    },
    pinterest: {
      title: "Pinterest Downloader — SaveFlox",
      description: "Save Pinterest pins, videos, and story media instantly with our free downloader.",
      keywords: "pinterest downloader, pinterest video downloader, download pinterest video, save pinterest pin",
      canonical: `${SITE_URL}/pinterest-downloader`,
    },
    mp3: {
      title: "MP3 Converter — SaveFlox",
      description: "Convert videos from YouTube and social media into MP3 audio files in seconds.",
      keywords: "mp3 converter, youtube to mp3, video to mp3, audio downloader",
      canonical: `${SITE_URL}/mp3-converter`,
    },
    blog: {
      title: "SaveFlox Blog — Video Downloader Tips",
      description: "Read the SaveFlox blog for tips, news, and how-to guides about downloading online videos.",
      keywords: "saveflox blog, video downloader tips, online video guides, youtube downloader blog",
      canonical: `${SITE_URL}/blog`,
    },
    login: {
      title: "Admin Login — SaveFlox",
      description: "Admin login for SaveFlox backend access.",
      keywords: "saveflox admin login, admin dashboard",
      canonical: `${SITE_URL}/login`,
      noIndex: true,
    },
    admin: {
      title: "Admin Dashboard — SaveFlox",
      description: "SaveFlox admin analytics and download management dashboard.",
      keywords: "saveflox admin, admin dashboard, download analytics",
      canonical: `${SITE_URL}/admin`,
      noIndex: true,
    },
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    setLoading(true);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <TopProgressBar />
      <TopProgressBar />
     {!isAdmin && !isAdminDomain && <Navbar />}

      {loading && !isAdmin ? (
        <PageLoader />
        ) : isAdminDomain ? (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<><Seo {...seo.login} /><AdminLogin /></>} />
    <Route path="/admin" element={<ProtectedAdmin><Seo {...seo.admin} /><AdminDashboard /></ProtectedAdmin>} />
    <Route path="/admin/analytics" element={<ProtectedAdmin><Analytics /></ProtectedAdmin>} />
    <Route path="/admin/downloads" element={<ProtectedAdmin><DownloadLogs /></ProtectedAdmin>} />
    <Route path="/admin/blog" element={<ProtectedAdmin><MyBlog /></ProtectedAdmin>} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Seo {...seo.home} />
                <Home />
              </>
            }
          />
          <Route
            path="/tiktok-downloader"
            element={
              <>
                <Seo {...seo.tiktok} />
                <Tiktok />
              </>
            }
          />
          <Route
            path="/twitter-downloader"
            element={
              <>
                <Seo {...seo.twitter} />
                <Twitter />
              </>
            }
          />
          <Route
            path="/instagram-downloader"
            element={
              <>
                <Seo {...seo.instagram} />
                <Instagram />
              </>
            }
          />
          <Route
            path="/facebook-downloader"
            element={
              <>
                <Seo {...seo.facebook} />
                <Facebook />
              </>
            }
          />
          <Route
            path="/pinterest-downloader"
            element={
              <>
                <Seo {...seo.pinterest} />
                <Pinterest />
              </>
            }
          />
          <Route
            path="/mp3-converter"
            element={
              <>
                <Seo {...seo.mp3} />
                <Mp3Converter />
              </>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <>
                <Seo {...seo.blog} />
                <BlogPost />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Seo {...seo.blog} />
                <Blog />
              </>
            }
          />
          <Route
            path="/terms"
            element={
              <>
                <Seo title="Terms of Service — SaveFlox" description="Read the SaveFlox terms of service and usage policy for our video downloader." canonical={`${SITE_URL}/terms`} />
                <Terms />
              </>
            }
          />
          <Route
            path="/privacy"
            element={
              <>
                <Seo title="Privacy Policy — SaveFlox" description="Review the SaveFlox privacy policy for data usage, cookies, and user privacy." canonical={`${SITE_URL}/privacy`} />
                <Privacy />
              </>
            }
          />
          <Route
            path="/copyright"
            element={
              <>
                <Seo title="Copyright Policy — SaveFlox" description="View the SaveFlox copyright and takedown policy for downloaded content." canonical={`${SITE_URL}/copyright`} />
                <Copyright />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Seo title="Contact — SaveFlox" description="Contact SaveFlox for support, feedback, or partnership inquiries." canonical={`${SITE_URL}/contact`} />
                <Contact />
              </>
            }
          />
          
          <Route
  path="/login"
  element={<Navigate to="/" replace />}
/>
          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <Seo {...seo.admin} />
                <AdminDashboard />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedAdmin>
                <Seo title="Analytics — SaveFlox Admin" description="SaveFlox admin analytics dashboard with real-time usage and download data." canonical={`${SITE_URL}/admin/analytics`} noIndex />
                <Analytics />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/downloads"
            element={
              <ProtectedAdmin>
                <Seo title="Download Logs — SaveFlox Admin" description="View download logs and recent activity in the SaveFlox admin dashboard." canonical={`${SITE_URL}/admin/downloads`} noIndex />
                <DownloadLogs />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedAdmin>
                <Seo title="Blog Management — SaveFlox Admin" description="Manage blog posts and content in the SaveFlox admin panel." canonical={`${SITE_URL}/admin/blog`} noIndex />
                <MyBlog />
              </ProtectedAdmin>
            }
          />
          <Route
            path="*"
            element={
              <>
                <Seo title="Page Not Found — SaveFlox" description="The page you are looking for was not found. Return to SaveFlox home to download videos and audio." canonical={`${SITE_URL}/404`} noIndex />
                <NotFound />
              </>
            }
          />
        </Routes>
      )}
      {!isAdmin && !isAdminDomain && <Footer />}
    </>
  );
}

export default App;