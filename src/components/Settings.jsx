// import { useState } from "react";
// import {
//   Settings as SettingsIcon, Shield, Sliders, Search as SearchIcon,
//   Save, Eye, EyeOff, Check,
// } from "lucide-react";
// import { useAds } from "../context/AdsContext";
// import AdminSidebar from "./AdminSidebar";
// import AdminTopbar from "./AdminTopbar";
// import "../styles/Settings.css";

// const TABS = [
//   { id: "general",  label: "General",  icon: SettingsIcon },
//   { id: "security", label: "Security", icon: Shield },
//   { id: "features", label: "Features", icon: Sliders },
//   { id: "seo",      label: "SEO",      icon: SearchIcon },
// ];

// const LANGUAGES = [
//   { code: "en", name: "English" },
//   { code: "es", name: "Español" },
//   { code: "pt", name: "Português" },
//   { code: "hi", name: "हिन्दी" },
//   { code: "id", name: "Indonesia" },
//   { code: "ar", name: "العربية" },
//   { code: "fr", name: "Français" },
//   { code: "de", name: "Deutsch" },
//   { code: "ru", name: "Русский" },
//   { code: "vi", name: "Tiếng Việt" },
// ];

// export default function Settings() {
//   const { adsEnabled, setAdsEnabled } = useAds();

//   const [activeTab, setActiveTab] = useState("general");
//   const [savedTab, setSavedTab] = useState(null);

//   /* ---- General ---- */
//   const [general, setGeneral] = useState({
//     siteName: "SaveFlux",
//     tagline: "Download videos and audio from any platform.",
//     contactEmail: "admin@saveflux.com",
//     defaultLanguage: "en",
//     logoUrl: "",
//   });

//   /* ---- Security ---- */
//   const [security, setSecurity] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//     twoFactor: false,
//   });
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew]         = useState(false);
//   const [securityError, setSecurityError] = useState("");

//   /* ---- Features ---- */
//   const [features, setFeatures] = useState({
//     maintenanceMode: false,
//     enableBlog: true,
//     enableMp3: true,
//     enableAds: adsEnabled,
//     publicSignup: false,
//   });

//   /* ---- SEO ---- */
//   const [seo, setSeo] = useState({
//     metaTitle: "SaveFlux — Free Video & Audio Downloader",
//     metaDescription:
//       "Download TikTok, YouTube, Instagram, Facebook, Pinterest and Twitter videos in HD. Free MP3 converter included.",
//     ogImage: "",
//     gaId: "",
//   });

//   const flashSaved = (tab) => {
//     setSavedTab(tab);
//     setTimeout(() => setSavedTab(null), 2200);
//   };

//   const handleSaveGeneral = (e) => { e.preventDefault(); flashSaved("general"); };
//   const handleSaveSeo     = (e) => { e.preventDefault(); flashSaved("seo"); };

//   const handleSaveFeatures = (e) => {
//     e.preventDefault();
//     setAdsEnabled(features.enableAds);
//     flashSaved("features");
//   };

//   const handleSaveSecurity = (e) => {
//     e.preventDefault();
//     setSecurityError("");
//     if (!security.currentPassword) { setSecurityError("Current password is required."); return; }
//     if (security.newPassword.length < 8) { setSecurityError("New password must be at least 8 characters."); return; }
//     if (security.newPassword !== security.confirmPassword) { setSecurityError("New passwords do not match."); return; }
//     setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "", twoFactor: security.twoFactor });
//     flashSaved("security");
//   };

//   return (
//     <div className="set-shell">
//       <AdminSidebar />

//       <main className="set-main">
//         <AdminTopbar email="admin@saveflux.com" />

//         <div className="set-main-inner">
//           {/* Header */}
//           <div className="set-header">
//             <h1 className="set-title">Settings</h1>
//             <p className="set-subtitle">
//               Manage your site configuration, account security and feature toggles.
//             </p>
//           </div>

//           {/* Tabs */}
//           <div className="set-tabs">
//             {TABS.map((t) => {
//               const Icon = t.icon;
//               return (
//                 <button
//                   key={t.id}
//                   className={`set-tab ${activeTab === t.id ? "active" : ""}`}
//                   onClick={() => setActiveTab(t.id)}
//                 >
//                   <Icon size={16} /> {t.label}
//                 </button>
//               );
//             })}
//           </div>

//           {/* ========= GENERAL ========= */}
//           {activeTab === "general" && (
//             <form className="set-card" onSubmit={handleSaveGeneral}>
//               <div className="set-card-head">
//                 <h2>General Information</h2>
//                 <p>Public-facing details about your site.</p>
//               </div>

//               <div className="set-grid">
//                 <label>
//                   Site Name
//                   <input
//                     type="text"
//                     value={general.siteName}
//                     onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
//                     required
//                   />
//                 </label>
//                 <label>
//                   Contact Email
//                   <input
//                     type="email"
//                     value={general.contactEmail}
//                     onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
//                     required
//                   />
//                 </label>
//               </div>

//               <label>
//                 Tagline
//                 <input
//                   type="text"
//                   value={general.tagline}
//                   onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
//                 />
//               </label>

//               <div className="set-grid">
//                 <label>
//                   Default Language
//                   <select
//                     value={general.defaultLanguage}
//                     onChange={(e) => setGeneral({ ...general, defaultLanguage: e.target.value })}
//                   >
//                     {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
//                   </select>
//                 </label>
//                 <label>
//                   Logo URL
//                   <input
//                     type="url"
//                     placeholder="https://..."
//                     value={general.logoUrl}
//                     onChange={(e) => setGeneral({ ...general, logoUrl: e.target.value })}
//                   />
//                 </label>
//               </div>

//               <SaveBar saved={savedTab === "general"} />
//             </form>
//           )}

//           {/* ========= SECURITY ========= */}
//           {activeTab === "security" && (
//             <form className="set-card" onSubmit={handleSaveSecurity}>
//               <div className="set-card-head">
//                 <h2>Account Security</h2>
//                 <p>Change your admin password and enable extra protection.</p>
//               </div>

//               <label>
//                 Current Password
//                 <div className="set-password">
//                   <input
//                     type={showCurrent ? "text" : "password"}
//                     value={security.currentPassword}
//                     onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
//                     autoComplete="current-password"
//                   />
//                   <button type="button" onClick={() => setShowCurrent((s) => !s)} aria-label="Toggle visibility">
//                     {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </label>

//               <div className="set-grid">
//                 <label>
//                   New Password
//                   <div className="set-password">
//                     <input
//                       type={showNew ? "text" : "password"}
//                       value={security.newPassword}
//                       onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
//                       autoComplete="new-password"
//                     />
//                     <button type="button" onClick={() => setShowNew((s) => !s)} aria-label="Toggle visibility">
//                       {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </button>
//                   </div>
//                 </label>
//                 <label>
//                   Confirm New Password
//                   <input
//                     type={showNew ? "text" : "password"}
//                     value={security.confirmPassword}
//                     onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
//                     autoComplete="new-password"
//                   />
//                 </label>
//               </div>

//               {securityError && <div className="set-error">{securityError}</div>}

//               <div className="set-divider" />

//               <Toggle
//                 label="Two-factor authentication"
//                 description="Require a verification code in addition to your password."
//                 checked={security.twoFactor}
//                 onChange={(v) => setSecurity({ ...security, twoFactor: v })}
//               />

//               <SaveBar saved={savedTab === "security"} label="Update password" />
//             </form>
//           )}

//           {/* ========= FEATURES ========= */}
//           {activeTab === "features" && (
//             <form className="set-card" onSubmit={handleSaveFeatures}>
//               <div className="set-card-head">
//                 <h2>Feature Toggles</h2>
//                 <p>Turn site features on or off without redeploying.</p>
//               </div>

//               <Toggle
//                 label="Maintenance mode"
//                 description="Show a maintenance page to all visitors. Admins can still log in."
//                 checked={features.maintenanceMode}
//                 onChange={(v) => setFeatures({ ...features, maintenanceMode: v })}
//               />
//               <Toggle
//                 label="Enable blog section"
//                 description="Show the blog page and link in the navigation."
//                 checked={features.enableBlog}
//                 onChange={(v) => setFeatures({ ...features, enableBlog: v })}
//               />
//               <Toggle
//                 label="Enable MP3 converter"
//                 description="Allow users to convert videos to audio."
//                 checked={features.enableMp3}
//                 onChange={(v) => setFeatures({ ...features, enableMp3: v })}
//               />
//               <Toggle
//                 label="Show advertisements"
//                 description="Display ad slots on public pages."
//                 checked={features.enableAds}
//                 onChange={(v) => setFeatures({ ...features, enableAds: v })}
//               />
//               <Toggle
//                 label="Allow public admin signup"
//                 description="Let anyone create an admin account (not recommended)."
//                 checked={features.publicSignup}
//                 onChange={(v) => setFeatures({ ...features, publicSignup: v })}
//               />

//               <SaveBar saved={savedTab === "features"} />
//             </form>
//           )}

//           {/* ========= SEO ========= */}
//           {activeTab === "seo" && (
//             <form className="set-card" onSubmit={handleSaveSeo}>
//               <div className="set-card-head">
//                 <h2>SEO &amp; Analytics</h2>
//                 <p>Optimize how your site appears in search engines and social shares.</p>
//               </div>

//               <label>
//                 Meta Title
//                 <input
//                   type="text"
//                   value={seo.metaTitle}
//                   onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
//                   maxLength="70"
//                 />
//                 <small className="set-hint">{seo.metaTitle.length}/70 characters</small>
//               </label>

//               <label>
//                 Meta Description
//                 <textarea
//                   rows="3"
//                   value={seo.metaDescription}
//                   onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
//                   maxLength="160"
//                 />
//                 <small className="set-hint">{seo.metaDescription.length}/160 characters</small>
//               </label>

//               <div className="set-grid">
//                 <label>
//                   Open Graph Image URL
//                   <input
//                     type="url"
//                     placeholder="https://..."
//                     value={seo.ogImage}
//                     onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
//                   />
//                 </label>
//                 <label>
//                   Google Analytics ID
//                   <input
//                     type="text"
//                     placeholder="G-XXXXXXXXXX"
//                     value={seo.gaId}
//                     onChange={(e) => setSeo({ ...seo, gaId: e.target.value })}
//                   />
//                 </label>
//               </div>

//               <SaveBar saved={savedTab === "seo"} />
//             </form>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ---------- Helper components ---------- */

// function Toggle({ label, description, checked, onChange }) {
//   return (
//     <label className="set-toggle">
//       <div className="set-toggle-text">
//         <span className="set-toggle-label">{label}</span>
//         {description && <span className="set-toggle-desc">{description}</span>}
//       </div>
//       <input
//         type="checkbox"
//         className="set-toggle-input"
//         checked={checked}
//         onChange={(e) => onChange(e.target.checked)}
//       />
//       <span className="set-toggle-track">
//         <span className="set-toggle-thumb" />
//       </span>
//     </label>
//   );
// }

// function SaveBar({ saved, label = "Save Changes" }) {
//   return (
//     <div className="set-save-bar">
//       {saved && (
//         <span className="set-saved-msg">
//           <Check size={16} /> Saved
//         </span>
//       )}
//       <button type="submit" className="set-save-btn">
//         <Save size={16} /> {label}
//       </button>
//     </div>
//   );
// }