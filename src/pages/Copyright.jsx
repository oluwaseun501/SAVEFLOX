import { useTranslation } from "react-i18next";
import "../styles/LegalPage.css";

export default function Copyright() {
  const { t } = useTranslation();
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>{t("copyright_title")}</h1>
        <p className="legal-updated">{t("legal_last_updated")}: April 2026</p>

        <h2>{t("copyright_h_ownership")}</h2>
        <p>{t("copyright_p_ownership")}</p>

        <h2>{t("copyright_h_dmca")}</h2>
        <p>{t("copyright_p_dmca")}</p>

        <h2>{t("copyright_h_userresp")}</h2>
        <p>{t("copyright_p_userresp")}</p>

        <h2>{t("copyright_h_takedown")}</h2>
        <p>{t("copyright_p_takedown")}</p>
      </div>
    </main>
  );
}