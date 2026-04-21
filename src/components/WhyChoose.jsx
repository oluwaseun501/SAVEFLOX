import { Zap, Shield, Video, Music, Scissors, Smartphone } from "lucide-react";
import "../styles/WhyChoose.css";

export default function WhyChoose() {
  const features = [
    {
      icon: <Zap size={22} />,
      title: "Lightning Fast",
      description: "Download your favorite videos in seconds with our optimized servers.",
    },
    {
      icon: <Shield size={22} />,
      title: "Safe & Secure",
      description: "No malware, no tracking. Your downloads are completely private and secure.",
    },
    {
      icon: <Video size={22} />,
      title: "High Quality",
      description: "Get videos in their original quality, up to 4K resolution when available.",
    },
    {
      icon: <Music size={22} />,
      title: "MP3 Extraction",
      description: "Easily convert any video to high-quality MP3 audio format.",
    },
    {
      icon: <Scissors size={22} />,
      title: "Built-in Editor",
      description: "Trim, crop, and edit your downloaded videos directly in your browser.",
    },
    {
      icon: <Smartphone size={22} />,
      title: "All Devices",
      description: "Works perfectly on PC, Mac, Android, iOS, and tablets without any app installation.",
    },
  ];

  return (
    <section className="why-choose">
      <div className="why-choose-container">
        {/* Header */}
        <div className="why-choose-header">
          <h2 className="why-choose-title">
            Why Choose <span>SaveFlux?</span>
          </h2>
          <p className="why-choose-subtitle">
            The most complete toolkit for downloading and editing social media content.
          </p>
        </div>

        {/* Grid */}
        <div className="why-choose-grid">
          {features.map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}