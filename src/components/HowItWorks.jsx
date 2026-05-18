import { Link2, SlidersHorizontal, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/HowItWorks.css";
import GlideIn from "./GlideIn";

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Link2 size={26} />,
      step: `${t("step")} 1`,
      title: t("step1_title"),
      description: t("step1_desc"),
    },
    {
      icon: <SlidersHorizontal size={26} />,
      step: `${t("step")} 2`,
      title: t("step2_title"),
      description: t("step2_desc"),
    },
    {
      icon: <Download size={26} />,
      step: `${t("step")} 3`,
      title: t("step3_title"),
      description: t("step3_desc"),
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-container">

        {/* Header glides in */}
        <GlideIn>
          <div className="how-header">
            <h2 className="how-title">{t("how_title")}</h2>
            <p className="how-subtitle">{t("how_subtitle")}</p>
          </div>
        </GlideIn>

        {/* Each step glides in with staggered delay */}
        <div className="how-steps">
          {steps.map((s, idx) => (
            <GlideIn key={idx} delay={idx * 150}>
              <div className="how-step">
                <div className="how-step-icon">{s.icon}</div>
                <span className="how-step-badge">{s.step}</span>
                <h3 className="how-step-title">{s.title}</h3>
                <p className="how-step-description">{s.description}</p>
              </div>
            </GlideIn>
          ))}
        </div>

      </div>
    </section>
  );
}