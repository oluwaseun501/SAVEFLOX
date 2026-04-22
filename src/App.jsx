import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tiktok from "./components/Tiktok";
import Twitter from "./components/Twitter";
import Instagram from "./components/Instagram";
import Facebook from "./components/Facebook";
import Mp3Converter from "./components/Mp3Converter";
import WhyChoose from "./components/WhyChoose";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Analytics from "./components/Analytics";
import { Navigate } from "react-router-dom";
import Pinterest from "./components/Pinterest";



function ProtectedAdmin({ children }) {
  const isLogged = localStorage.getItem("sf_admin") === "true";
  return isLogged ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/tiktok-downloader" element={<Tiktok />} />
        <Route path="/twitter-downloader" element={<Twitter />} />
        <Route path="/instagram-downloader" element={<Instagram />} />
        <Route path="/facebook-downloader" element={<Facebook />} />
        <Route path="/pinterest-downloader" element={<Pinterest />} />

        <Route path="/mp3-converter" element={<Mp3Converter />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
        <Route
  path="/admin/analytics"
  element={
    <ProtectedAdmin>
      <Analytics />
    </ProtectedAdmin>
  }
/>
      </Routes>
      {!isAdmin && (
        <>
          <WhyChoose />
          <HowItWorks />
          <FAQ />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;