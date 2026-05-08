import { useState, useEffect } from "react";
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
import PageLoader from "./components/PageLoader";       // ← NEW
import TopProgressBar from "./components/TopProgressBar"; // ← NEW


import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Copyright from "./pages/Copyright";
import Contact from "./pages/Contact";

import { isAuthenticated } from "./utils/auth";

function ProtectedAdmin({ children }) {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
}


function Home() {
  return (
    <>
      <Hero />
      <AdSlot slot="home-top" format="leaderboard" />
      <WhyChoose />
      <AdSlot slot="home-bottom" format="leaderboard" />
      <HowItWorks />
      <AdSlot slot="home-bottom" format="leaderboard" />
      <FAQ />
    </>
  );
}

function App() {
  const location = useLocation();
  const { pathname } = location;
  const isAdmin = pathname.startsWith("/admin");
  const [loading, setLoading] = useState(false); // ← NEW

  // Scroll to top + skeleton loader on every route change
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
  }, [pathname]); // ← NEW

  return (
    <>
      <TopProgressBar />                  {/* ← NEW — shows on all pages */}
      {!isAdmin && <Navbar />}

      {loading && !isAdmin ? (
        <PageLoader />                    /* ← NEW — skeleton on public pages */
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tiktok-downloader" element={<Tiktok />} />
          <Route path="/twitter-downloader" element={<Twitter />} />
          <Route path="/instagram-downloader" element={<Instagram />} />
          <Route path="/facebook-downloader" element={<Facebook />} />
          <Route path="/pinterest-downloader" element={<Pinterest />} />
          <Route path="/mp3-converter" element={<Mp3Converter />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/copyright" element={<Copyright />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="/admin/analytics" element={<ProtectedAdmin><Analytics /></ProtectedAdmin>} />
          <Route path="/admin/downloads" element={<ProtectedAdmin><DownloadLogs /></ProtectedAdmin>} />
          <Route path="/admin/blog" element={<ProtectedAdmin><MyBlog /></ProtectedAdmin>} />
        </Routes>
      )}

      {!isAdmin && <Footer />}
    </>
  );
}

export default App;