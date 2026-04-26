import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/LegalPage.css";

const WHATSAPP_NUMBER = "1234567890"; // <-- same number as Footer

export default function Contact() {
  const { t } = useTranslation();
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}`;

  useEffect(() => {
    window.location.href = waLink;
  }, [waLink]);

  return (
    <main className="legal-page">
      <div className="legal-container contact-page">
        <h1>{t("contact_title")}</h1>
        <p>{t("contact_redirect")}</p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-whatsapp-btn"
        >
          <FaWhatsapp size={20} />
          {t("contact_open_whatsapp")}
        </a>
      </div>
    </main>
  );
}