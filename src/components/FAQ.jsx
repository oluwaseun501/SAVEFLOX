import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/FAQ.css";
import GlideIn from "./GlideIn";

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(4);

  const faqs = [
    { question: t("faq_q1"), answer: t("faq_a1") },
    { question: t("faq_q2"), answer: t("faq_a2") },
    { question: t("faq_q3"), answer: t("faq_a3") },
    { question: t("faq_q4"), answer: t("faq_a4") },
    { question: t("faq_q5"), answer: t("faq_a5") },
  ];

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="faq">
      <div className="faq-container">

        {/* Header glides in */}
        <GlideIn>
          <div className="faq-header">
            <h2 className="faq-title">{t("faq_title")}</h2>
            <p className="faq-subtitle">{t("faq_subtitle")}</p>
          </div>
        </GlideIn>

        {/* Each FAQ item glides in with staggered delay */}
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <GlideIn key={idx} delay={idx * 100}>
              <div className={`faq-item ${openIndex === idx ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={openIndex === idx}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={20} className="faq-chevron" />
                </button>
                <div className="faq-answer-wrapper">
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            </GlideIn>
          ))}
        </div>

      </div>
    </section>
  );
}