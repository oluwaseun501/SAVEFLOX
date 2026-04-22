import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: { translation: {
    home: "Home", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Mp3 Converter", blog: "Blog",
    installApp: "Install App", language: "Language",
    hero_title: "Download Any Video,",
    hero_highlight: "Anywhere",
    hero_subtitle: "The ultimate all-in-one downloader for TikTok, YouTube, Instagram, Facebook, Pinterest and more. Fast, free, and no watermark.",
    paste_placeholder: "Paste any video URL here (TikTok, YouTube, Instagram...)",
    download: "Download", video_mp4: "Video (MP4)", audio_mp3: "Audio (MP3)", options: "Options",
    why_title: "Why Choose SaveFlux?", why_subtitle: "The most complete toolkit for downloading and editing social media content.",
    fast_title: "Lightning Fast", fast_desc: "Download your favorite videos in seconds with our optimized servers.",
    safe_title: "Safe & Secure", safe_desc: "No malware, no tracking. Your downloads are completely private.",
    quality_title: "High Quality", quality_desc: "Get videos in their original quality, up to 4K resolution.",

    // ENGLISH
download_videos: "Download {{platform}} Videos",
paste_link: "Paste {{platform}} video link here...",
tiktok_subtext: "Download TikTok videos without watermark in HD quality. Fast, free, and secure.",
twitter_subtext: "Download Twitter/X videos and GIFs in HD quality. Fast, free, and secure.",
instagram_subtext: "Download Instagram reels, stories, and videos in HD. Fast, free, and no watermark.",
facebook_subtext: "Download Facebook videos and reels in HD quality. Fast, free, and secure.",
pinterest_subtext: "Download Pinterest videos and images in HD quality. Fast, free, and no watermark.",
    
  }},
  es: { translation: {
    home: "Inicio", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Convertidor Mp3", blog: "Blog",
    installApp: "Instalar App", language: "Idioma",
    hero_title: "Descarga Cualquier Video,",
    hero_highlight: "En Cualquier Lugar",
    hero_subtitle: "El descargador todo-en-uno definitivo para TikTok, YouTube, Instagram, Facebook, Pinterest y más. Rápido, gratis y sin marca de agua.",
    paste_placeholder: "Pega cualquier URL de video aquí (TikTok, YouTube, Instagram...)",
    download: "Descargar", video_mp4: "Video (MP4)", audio_mp3: "Audio (MP3)", options: "Opciones",
    why_title: "¿Por qué elegir SaveFlux?", why_subtitle: "El kit más completo para descargar y editar contenido de redes sociales.",
    fast_title: "Ultra Rápido", fast_desc: "Descarga tus videos favoritos en segundos con nuestros servidores optimizados.",
    safe_title: "Seguro y Privado", safe_desc: "Sin malware, sin rastreo. Tus descargas son completamente privadas.",
    quality_title: "Alta Calidad", quality_desc: "Obtén videos en su calidad original, hasta resolución 4K.",
    // es (Spanish)
download_videos: "Descargar Videos de {{platform}}",
paste_link: "Pega aquí el enlace del video de {{platform}}...",
tiktok_subtext: "Descarga videos de TikTok sin marca de agua en calidad HD. Rápido, gratis y seguro.",
twitter_subtext: "Descarga videos y GIFs de Twitter/X en calidad HD. Rápido, gratis y seguro.",
instagram_subtext: "Descarga reels, historias y videos de Instagram en HD. Rápido, gratis y sin marca de agua.",
facebook_subtext: "Descarga videos y reels de Facebook en calidad HD. Rápido, gratis y seguro.",
pinterest_subtext: "Descarga videos e imágenes de Pinterest en calidad HD. Rápido, gratis y sin marca de agua.",

    
  }},
  pt: { translation: {
    home: "Início", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Conversor Mp3", blog: "Blog",
    installApp: "Instalar App", language: "Idioma",
    hero_title: "Baixe Qualquer Vídeo,",
    hero_highlight: "Em Qualquer Lugar",
    hero_subtitle: "O downloader completo definitivo para TikTok, YouTube, Instagram, Facebook, Pinterest e muito mais. Rápido, grátis e sem marca d'água.",
    paste_placeholder: "Cole qualquer URL de vídeo aqui (TikTok, YouTube, Instagram...)",
    download: "Baixar", video_mp4: "Vídeo (MP4)", audio_mp3: "Áudio (MP3)", options: "Opções",
    why_title: "Por que escolher SaveFlux?", why_subtitle: "O kit mais completo para baixar e editar conteúdo de redes sociais.",
    fast_title: "Super Rápido", fast_desc: "Baixe seus vídeos favoritos em segundos com nossos servidores otimizados.",
    safe_title: "Seguro e Privado", safe_desc: "Sem malware, sem rastreamento. Seus downloads são totalmente privados.",
    quality_title: "Alta Qualidade", quality_desc: "Obtenha vídeos em qualidade original, até resolução 4K.",

    // pt (Portuguese)
download_videos: "Baixar Vídeos do {{platform}}",
paste_link: "Cole aqui o link do vídeo do {{platform}}...",
tiktok_subtext: "Baixe vídeos do TikTok sem marca d'água em qualidade HD. Rápido, grátis e seguro.",
twitter_subtext: "Baixe vídeos e GIFs do Twitter/X em qualidade HD. Rápido, grátis e seguro.",
instagram_subtext: "Baixe reels, stories e vídeos do Instagram em HD. Rápido, grátis e sem marca d'água.",
facebook_subtext: "Baixe vídeos e reels do Facebook em qualidade HD. Rápido, grátis e seguro.",
pinterest_subtext: "Baixe vídeos e imagens do Pinterest em qualidade HD. Rápido, grátis e sem marca d'água.",
  }},
  hi: { translation: {
    home: "होम", tiktok: "टिकटॉक", twitter: "ट्विटर", instagram: "इंस्टाग्राम",
    facebook: "फेसबुक", pinterest: "पिंटरेस्ट", mp3: "Mp3 कन्वर्टर", blog: "ब्लॉग",
    installApp: "ऐप इंस्टॉल करें", language: "भाषा",
    hero_title: "कोई भी वीडियो डाउनलोड करें,",
    hero_highlight: "कहीं भी",
    hero_subtitle: "टिकटॉक, यूट्यूब, इंस्टाग्राम, फेसबुक, पिंटरेस्ट और अधिक के लिए परम ऑल-इन-वन डाउनलोडर। तेज़, मुफ्त, और बिना वॉटरमार्क।",
    paste_placeholder: "यहां कोई भी वीडियो URL पेस्ट करें (टिकटॉक, यूट्यूब, इंस्टाग्राम...)",
    download: "डाउनलोड", video_mp4: "वीडियो (MP4)", audio_mp3: "ऑडियो (MP3)", options: "विकल्प",
    why_title: "SaveFlux क्यों चुनें?", why_subtitle: "सोशल मीडिया कंटेंट डाउनलोड और एडिट करने के लिए सबसे संपूर्ण टूलकिट।",
    fast_title: "बिजली की गति", fast_desc: "हमारे ऑप्टिमाइज्ड सर्वर से सेकंडों में अपने पसंदीदा वीडियो डाउनलोड करें।",
    safe_title: "सुरक्षित और निजी", safe_desc: "कोई मैलवेयर नहीं, कोई ट्रैकिंग नहीं। आपके डाउनलोड पूरी तरह से निजी हैं।",
    quality_title: "उच्च गुणवत्ता", quality_desc: "मूल गुणवत्ता में वीडियो प्राप्त करें, 4K रिज़ॉल्यूशन तक।",

    // hi (Hindi)
download_videos: "{{platform}} वीडियो डाउनलोड करें",
paste_link: "यहां {{platform}} वीडियो लिंक पेस्ट करें...",
tiktok_subtext: "बिना वॉटरमार्क के HD क्वालिटी में टिकटॉक वीडियो डाउनलोड करें। तेज़, मुफ्त और सुरक्षित।",
twitter_subtext: "HD क्वालिटी में ट्विटर/X वीडियो और GIF डाउनलोड करें। तेज़, मुफ्त और सुरक्षित।",
instagram_subtext: "HD में इंस्टाग्राम रील्स, स्टोरीज़ और वीडियो डाउनलोड करें। तेज़, मुफ्त और बिना वॉटरमार्क।",
facebook_subtext: "HD क्वालिटी में फेसबुक वीडियो और रील्स डाउनलोड करें। तेज़, मुफ्त और सुरक्षित।",
pinterest_subtext: "HD क्वालिटी में पिंटरेस्ट वीडियो और इमेज डाउनलोड करें। तेज़, मुफ्त और बिना वॉटरमार्क।",


  }},
  id: { translation: {
    home: "Beranda", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Konverter Mp3", blog: "Blog",
    installApp: "Pasang Aplikasi", language: "Bahasa",
    hero_title: "Unduh Video Apa Saja,",
    hero_highlight: "Di Mana Saja",
    hero_subtitle: "Pengunduh all-in-one terbaik untuk TikTok, YouTube, Instagram, Facebook, Pinterest dan lainnya. Cepat, gratis, dan tanpa watermark.",
    paste_placeholder: "Tempel URL video apa pun di sini (TikTok, YouTube, Instagram...)",
    download: "Unduh", video_mp4: "Video (MP4)", audio_mp3: "Audio (MP3)", options: "Opsi",
    why_title: "Mengapa Memilih SaveFlux?", why_subtitle: "Toolkit terlengkap untuk mengunduh dan mengedit konten media sosial.",
    fast_title: "Sangat Cepat", fast_desc: "Unduh video favorit Anda dalam hitungan detik dengan server kami yang dioptimalkan.",
    safe_title: "Aman & Pribadi", safe_desc: "Tanpa malware, tanpa pelacakan. Unduhan Anda sepenuhnya pribadi.",
    quality_title: "Kualitas Tinggi", quality_desc: "Dapatkan video dalam kualitas asli, hingga resolusi 4K.",

    // id (Indonesian)
download_videos: "Unduh Video {{platform}}",
paste_link: "Tempel link video {{platform}} di sini...",
tiktok_subtext: "Unduh video TikTok tanpa watermark dalam kualitas HD. Cepat, gratis, dan aman.",
twitter_subtext: "Unduh video dan GIF Twitter/X dalam kualitas HD. Cepat, gratis, dan aman.",
instagram_subtext: "Unduh reels, stories, dan video Instagram dalam HD. Cepat, gratis, dan tanpa watermark.",
facebook_subtext: "Unduh video dan reels Facebook dalam kualitas HD. Cepat, gratis, dan aman.",
pinterest_subtext: "Unduh video dan gambar Pinterest dalam kualitas HD. Cepat, gratis, dan tanpa watermark.",
  }},
  ar: { translation: {
    home: "الرئيسية", tiktok: "تيك توك", twitter: "تويتر", instagram: "إنستغرام",
    facebook: "فيسبوك", pinterest: "بينتيريست", mp3: "محول Mp3", blog: "المدونة",
    installApp: "تثبيت التطبيق", language: "اللغة",
    hero_title: "حمّل أي فيديو،",
    hero_highlight: "في أي مكان",
    hero_subtitle: "أداة التحميل الشاملة المثلى لتيك توك ويوتيوب وإنستغرام وفيسبوك وبينتيريست والمزيد. سريع، مجاني، وبدون علامة مائية.",
    paste_placeholder: "الصق أي رابط فيديو هنا (تيك توك، يوتيوب، إنستغرام...)",
    download: "تحميل", video_mp4: "فيديو (MP4)", audio_mp3: "صوت (MP3)", options: "خيارات",
    why_title: "لماذا تختار SaveFlux؟", why_subtitle: "أكمل مجموعة أدوات لتحميل وتحرير محتوى وسائل التواصل الاجتماعي.",
    fast_title: "سرعة البرق", fast_desc: "حمّل مقاطع الفيديو المفضلة لديك في ثوانٍ باستخدام خوادمنا المحسّنة.",
    safe_title: "آمن وخاص", safe_desc: "لا برامج ضارة، لا تتبع. تنزيلاتك خاصة تمامًا.",
    quality_title: "جودة عالية", quality_desc: "احصل على مقاطع الفيديو بجودتها الأصلية، حتى دقة 4K.",

    // ar (Arabic)
download_videos: "تحميل فيديوهات {{platform}}",
paste_link: "الصق رابط فيديو {{platform}} هنا...",
tiktok_subtext: "حمّل فيديوهات تيك توك بدون علامة مائية بجودة HD. سريع، مجاني، وآمن.",
twitter_subtext: "حمّل فيديوهات و GIFs من تويتر/X بجودة HD. سريع، مجاني، وآمن.",
instagram_subtext: "حمّل ريلز وستوريز وفيديوهات إنستغرام بجودة HD. سريع، مجاني، وبدون علامة مائية.",
facebook_subtext: "حمّل فيديوهات وريلز فيسبوك بجودة HD. سريع، مجاني، وآمن.",
pinterest_subtext: "حمّل فيديوهات وصور بينتيريست بجودة HD. سريع، مجاني، وبدون علامة مائية.",
  }},
  fr: { translation: {
    home: "Accueil", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Convertisseur Mp3", blog: "Blog",
    installApp: "Installer l'app", language: "Langue",
    hero_title: "Téléchargez Toute Vidéo,",
    hero_highlight: "Partout",
    hero_subtitle: "Le téléchargeur tout-en-un ultime pour TikTok, YouTube, Instagram, Facebook, Pinterest et plus. Rapide, gratuit et sans filigrane.",
    paste_placeholder: "Collez n'importe quelle URL vidéo ici (TikTok, YouTube, Instagram...)",
    download: "Télécharger", video_mp4: "Vidéo (MP4)", audio_mp3: "Audio (MP3)", options: "Options",
    why_title: "Pourquoi choisir SaveFlux ?", why_subtitle: "La boîte à outils la plus complète pour télécharger et éditer le contenu des réseaux sociaux.",
    fast_title: "Ultra Rapide", fast_desc: "Téléchargez vos vidéos préférées en quelques secondes avec nos serveurs optimisés.",
    safe_title: "Sûr et Privé", safe_desc: "Aucun malware, aucun suivi. Vos téléchargements sont entièrement privés.",
    quality_title: "Haute Qualité", quality_desc: "Obtenez des vidéos en qualité originale, jusqu'à 4K.",

    // fr (French)
download_videos: "Télécharger les Vidéos {{platform}}",
paste_link: "Collez ici le lien de la vidéo {{platform}}...",
tiktok_subtext: "Téléchargez les vidéos TikTok sans filigrane en qualité HD. Rapide, gratuit et sécurisé.",
twitter_subtext: "Téléchargez les vidéos et GIFs Twitter/X en qualité HD. Rapide, gratuit et sécurisé.",
instagram_subtext: "Téléchargez les reels, stories et vidéos Instagram en HD. Rapide, gratuit, sans filigrane.",
facebook_subtext: "Téléchargez les vidéos et reels Facebook en qualité HD. Rapide, gratuit et sécurisé.",
pinterest_subtext: "Téléchargez les vidéos et images Pinterest en qualité HD. Rapide, gratuit, sans filigrane.",
  }},
  de: { translation: {
    home: "Startseite", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Mp3-Konverter", blog: "Blog",
    installApp: "App installieren", language: "Sprache",
    hero_title: "Lade Jedes Video Herunter,",
    hero_highlight: "Überall",
    hero_subtitle: "Der ultimative All-in-One-Downloader für TikTok, YouTube, Instagram, Facebook, Pinterest und mehr. Schnell, kostenlos und ohne Wasserzeichen.",
    paste_placeholder: "Füge hier eine Video-URL ein (TikTok, YouTube, Instagram...)",
    download: "Herunterladen", video_mp4: "Video (MP4)", audio_mp3: "Audio (MP3)", options: "Optionen",
    why_title: "Warum SaveFlux wählen?", why_subtitle: "Das umfassendste Toolkit zum Herunterladen und Bearbeiten von Social-Media-Inhalten.",
    fast_title: "Blitzschnell", fast_desc: "Lade deine Lieblingsvideos in Sekunden mit unseren optimierten Servern herunter.",
    safe_title: "Sicher & Privat", safe_desc: "Keine Malware, kein Tracking. Deine Downloads sind völlig privat.",
    quality_title: "Hohe Qualität", quality_desc: "Erhalte Videos in Originalqualität, bis zu 4K-Auflösung.",

    // de (German)
download_videos: "{{platform}}-Videos Herunterladen",
paste_link: "Füge hier den {{platform}}-Videolink ein...",
tiktok_subtext: "Lade TikTok-Videos ohne Wasserzeichen in HD-Qualität herunter. Schnell, kostenlos und sicher.",
twitter_subtext: "Lade Twitter/X-Videos und GIFs in HD-Qualität herunter. Schnell, kostenlos und sicher.",
instagram_subtext: "Lade Instagram-Reels, Stories und Videos in HD herunter. Schnell, kostenlos und ohne Wasserzeichen.",
facebook_subtext: "Lade Facebook-Videos und Reels in HD-Qualität herunter. Schnell, kostenlos und sicher.",
pinterest_subtext: "Lade Pinterest-Videos und Bilder in HD-Qualität herunter. Schnell, kostenlos und ohne Wasserzeichen.",
  }},
  ru: { translation: {
    home: "Главная", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Mp3 Конвертер", blog: "Блог",
    installApp: "Установить приложение", language: "Язык",
    hero_title: "Скачайте Любое Видео,",
    hero_highlight: "Везде",
    hero_subtitle: "Лучший универсальный загрузчик для TikTok, YouTube, Instagram, Facebook, Pinterest и других. Быстро, бесплатно и без водяных знаков.",
    paste_placeholder: "Вставьте сюда любой URL видео (TikTok, YouTube, Instagram...)",
    download: "Скачать", video_mp4: "Видео (MP4)", audio_mp3: "Аудио (MP3)", options: "Параметры",
    why_title: "Почему SaveFlux?", why_subtitle: "Самый полный набор инструментов для скачивания и редактирования контента из соцсетей.",
    fast_title: "Молниеносно", fast_desc: "Скачивайте любимые видео за секунды на наших оптимизированных серверах.",
    safe_title: "Безопасно и Приватно", safe_desc: "Никаких вирусов, никакого отслеживания. Ваши загрузки полностью приватны.",
    quality_title: "Высокое Качество", quality_desc: "Получайте видео в оригинальном качестве, до 4K разрешения.",

    // ru (Russian)
download_videos: "Скачать Видео из {{platform}}",
paste_link: "Вставьте сюда ссылку на видео из {{platform}}...",
tiktok_subtext: "Скачивайте видео из TikTok без водяных знаков в HD-качестве. Быстро, бесплатно и безопасно.",
twitter_subtext: "Скачивайте видео и GIF из Twitter/X в HD-качестве. Быстро, бесплатно и безопасно.",
instagram_subtext: "Скачивайте Reels, Stories и видео из Instagram в HD. Быстро, бесплатно и без водяных знаков.",
facebook_subtext: "Скачивайте видео и Reels из Facebook в HD-качестве. Быстро, бесплатно и безопасно.",
pinterest_subtext: "Скачивайте видео и изображения из Pinterest в HD-качестве. Быстро, бесплатно и без водяных знаков.",
  }},
  vi: { translation: {
    home: "Trang chủ", tiktok: "TikTok", twitter: "Twitter", instagram: "Instagram",
    facebook: "Facebook", pinterest: "Pinterest", mp3: "Chuyển đổi Mp3", blog: "Blog",
    installApp: "Cài đặt ứng dụng", language: "Ngôn ngữ",
    hero_title: "Tải Bất Kỳ Video Nào,",
    hero_highlight: "Mọi Lúc Mọi Nơi",
    hero_subtitle: "Trình tải xuống tất cả trong một tốt nhất cho TikTok, YouTube, Instagram, Facebook, Pinterest và nhiều hơn nữa. Nhanh, miễn phí, không hình mờ.",
    paste_placeholder: "Dán bất kỳ URL video nào tại đây (TikTok, YouTube, Instagram...)",
    download: "Tải xuống", video_mp4: "Video (MP4)", audio_mp3: "Âm thanh (MP3)", options: "Tùy chọn",
    why_title: "Tại sao chọn SaveFlux?", why_subtitle: "Bộ công cụ hoàn chỉnh nhất để tải xuống và chỉnh sửa nội dung mạng xã hội.",
    fast_title: "Cực Nhanh", fast_desc: "Tải video yêu thích của bạn trong vài giây với máy chủ được tối ưu hóa của chúng tôi.",
    safe_title: "An toàn & Riêng tư", safe_desc: "Không phần mềm độc hại, không theo dõi. Lượt tải của bạn hoàn toàn riêng tư.",
    quality_title: "Chất Lượng Cao", quality_desc: "Nhận video ở chất lượng gốc, lên đến độ phân giải 4K.", 

    // vi (Vietnamese)
download_videos: "Tải Video {{platform}}",
paste_link: "Dán link video {{platform}} vào đây...",
tiktok_subtext: "Tải video TikTok không watermark chất lượng HD. Nhanh, miễn phí và an toàn.",
twitter_subtext: "Tải video và GIF Twitter/X chất lượng HD. Nhanh, miễn phí và an toàn.",
instagram_subtext: "Tải reels, stories và video Instagram chất lượng HD. Nhanh, miễn phí, không watermark.",
facebook_subtext: "Tải video và reels Facebook chất lượng HD. Nhanh, miễn phí và an toàn.",
pinterest_subtext: "Tải video và hình ảnh Pinterest chất lượng HD. Nhanh, miễn phí, không watermark.",
  }}
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;