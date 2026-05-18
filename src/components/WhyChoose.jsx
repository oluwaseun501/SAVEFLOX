import { Zap, Shield, Video, Music, Scissors, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/WhyChoose.css";
import GlideIn from "./GlideIn";

export default function WhyChoose() {
  const { t } = useTranslation();

  const features = [
    { icon: <Zap size={22} />,        title: t("fast_title"),    description: t("fast_desc") },
    { icon: <Shield size={22} />,     title: t("safe_title"),    description: t("safe_desc") },
    { icon: <Video size={22} />,      title: t("quality_title"), description: t("quality_desc") },
    { icon: <Music size={22} />,      title: t("mp3_title"),     description: t("mp3_desc") },
    { icon: <Scissors size={22} />,   title: t("editor_title"),  description: t("editor_desc") },
    { icon: <Smartphone size={22} />, title: t("devices_title"), description: t("devices_desc") },
  ];

  const titleParts = t("why_title").split("SaveFlox");

  return (
    <section className="why-choose">
      <div className="why-choose-container">

        {/* Header glides in */}
        <GlideIn>
          <div className="why-choose-header">
            <h2 className="why-choose-title">
              {titleParts[0]}
              <span>SaveFlox</span>
              {titleParts[1] || ""}
            </h2>
            <p className="why-choose-subtitle">{t("why_subtitle")}</p>
          </div>
        </GlideIn>

        {/* Each card glides in with staggered delay */}
        <div className="why-choose-grid">
          {features.map((feature, idx) => (
            <GlideIn key={idx} delay={idx * 100}>
              <div className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </GlideIn>
          ))}
        </div>

      </div>
    </section>
  );
}