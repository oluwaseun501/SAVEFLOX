import { useTranslation } from "react-i18next";
import "../styles/LegalPage.css";

export default function Terms() {
  const { t } = useTranslation();
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>{t("terms_title")}</h1>
        <p className="legal-updated">{t("legal_last_updated")}: April 2026</p>

        <h2>{t("terms_h_acceptance")}</h2>
        <p>{t("terms_p_acceptance")}</p>

        <h2>{t("terms_h_use")}</h2>
        <p>{t("terms_p_use")}</p>

        <h2>{t("terms_h_content")}</h2>
        <p>{t("terms_p_content")}</p>

        <h2>{t("terms_h_liability")}</h2>
        <p>{t("terms_p_liability")}</p>

        <h2>{t("terms_h_changes")}</h2>
        <p>{t("terms_p_changes")}</p>
      </div>
    </main>
  );
}