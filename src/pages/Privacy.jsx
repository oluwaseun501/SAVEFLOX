import { useTranslation } from "react-i18next";
import "../styles/LegalPage.css";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>{t("privacy_title")}</h1>
        <p className="legal-updated">{t("legal_last_updated")}: April 2026</p>

        <h2>{t("privacy_h_collect")}</h2>
        <p>{t("privacy_p_collect")}</p>

        <h2>{t("privacy_h_use")}</h2>
        <p>{t("privacy_p_use")}</p>

        <h2>{t("privacy_h_cookies")}</h2>
        <p>{t("privacy_p_cookies")}</p>

        <h2>{t("privacy_h_thirdparty")}</h2>
        <p>{t("privacy_p_thirdparty")}</p>

        <h2>{t("privacy_h_rights")}</h2>
        <p>{t("privacy_p_rights")}</p>
      </div>
    </main>
  );
}