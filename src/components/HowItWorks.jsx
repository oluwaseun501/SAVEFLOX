import { Link2, SlidersHorizontal, Download } from "lucide-react";
import "../styles/HowItWorks.css";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Link2 size={26} />,
      step: "Step 1",
      title: "Paste URL",
      description:
        "Copy the video link from TikTok, YouTube, Instagram, or Facebook and paste it into the search box.",
    },
    {
      icon: <SlidersHorizontal size={26} />,
      step: "Step 2",
      title: "Select Format",
      description:
        "Choose your desired format (MP4 or MP3) and quality (up to 4K) for the download.",
    },
    {
      icon: <Download size={26} />,
      step: "Step 3",
      title: "Download",
      description:
        "Click the download button and your file will be saved to your device instantly.",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-container">
        {/* Header */}
        <div className="how-header">
          <h2 className="how-title">How It Works</h2>
          <p className="how-subtitle">
            Download your favorite videos in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="how-steps">
          {steps.map((s, idx) => (
            <div className="how-step" key={idx}>
              <div className="how-step-icon">{s.icon}</div>
              <span className="how-step-badge">{s.step}</span>
              <h3 className="how-step-title">{s.title}</h3>
              <p className="how-step-description">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}