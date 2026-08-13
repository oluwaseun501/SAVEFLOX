import { useTranslation } from "react-i18next";
import { trackAdClick } from "./AdSlot";
import "../styles/CourseLinks.css";

const platformNames = {
  home: "online video",
  tiktok: "TikTok",
  twitter: "Twitter/X",
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  mp3: "MP3",
};

/**
 * Reusable course-link section.
 *
 * `courses` should contain the real course links for the current page:
 * [{ id, title, url, trackingNumber }]
 *
 * `onCourseClick` is optional. Without it, this component uses the same
 * trackAdClick function as AdSlot.
 */
export default function CourseLinks({
  platform = "home",
  courses = [],
  onCourseClick,
}) {
  const { t } = useTranslation();
  const platformName = platformNames[platform] || platform;

  const handleCourseClick = (course) => {
    const slot = `${platform}-course-${course.trackingNumber || course.id || "link"}`;
    const click = {
      slot,
      platform,
      courseId: course.id,
      trackingNumber: course.trackingNumber,
      link: course.url,
    };

    if (onCourseClick) {
      onCourseClick(click);
      return;
    }

    trackAdClick(slot, course.url);
  };

  return (
    <section
      className="course-links"
      aria-labelledby={`course-links-title-${platform}`}
    >
      <div className="course-links__container">
        <div className="course-links__header">
          <span className="course-links__eyebrow">
            {t("course_links_eyebrow", "Explore more")}
          </span>
          <h2
            id={`course-links-title-${platform}`}
            className="course-links__title"
          >
            {t("course_links_title", "People also search for")}
          </h2>
          <p className="course-links__subtitle">
            {t(
              // "course_links_subtitle",
              // `Useful ${platformName} courses and resources`
            )}
          </p>
        </div>

        {courses.length > 0 ? (
          <ol className="course-links__list">
            {courses.map((course, index) => (
              <li className="course-links__item" key={course.id || course.url}>
                <a
                  className="course-links__link"
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCourseClick(course)}
                >
                  <span className="course-links__number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="course-links__label">{course.title}</span>
                  <span className="course-links__arrow" aria-hidden="true">
                    ›
                  </span>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="course-links__empty">
            Add the course links for this page in `courseLinksData.js`.
          </p>
        )}
      </div>
    </section>
  );
}