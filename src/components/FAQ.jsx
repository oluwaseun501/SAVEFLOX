import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "../styles/FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(4); // Last item open by default (matches screenshot)

  const faqs = [
    {
      question: "Is SaveFlux completely free to use?",
      answer:
        "Yes! SaveFlux is 100% free to use. There are no hidden fees, subscriptions, or limits on how many videos you can download.",
    },
    {
      question: "Do I need to install any software?",
      answer:
        "No installation is required. SaveFlux is a web-based tool that works directly in your browser on any device (PC, Mac, Android, iOS).",
    },
    {
      question: "Can I download videos without watermarks?",
      answer:
        "Yes, our TikTok and Instagram downloaders automatically remove watermarks from the videos, giving you clean, original quality files.",
    },
    {
      question: "Where are the videos saved after downloading?",
      answer:
        "Files are typically saved to your device's default \"Downloads\" folder. On mobile devices, you can usually find them in your Files app or Gallery.",
    },
    {
      question: "Is it legal to download videos?",
      answer:
        "Downloading videos for personal, offline use is generally acceptable. However, you should not re-upload or use copyrighted content for commercial purposes without the creator's permission.",
    },
  ];

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="faq">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Everything you need to know about SaveFlux.</p>
        </div>

        {/* List */}
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openIndex === idx ? "open" : ""}`}
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}