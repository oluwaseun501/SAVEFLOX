import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TopProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(0);

    const t1 = setTimeout(() => setProgress(80), 50);
    const t2 = setTimeout(() => setProgress(95), 300);
    const t3 = setTimeout(() => setProgress(100), 550);
    const t4 = setTimeout(() => { setVisible(false); setProgress(0); }, 750);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${progress}%`,
        background: "linear-gradient(to right, #6366f1, #8b5cf6)",
        zIndex: 99999,
        transition: "width 0.25s ease",
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 8px rgba(99, 102, 241, 0.6)",
      }}
    />
  );
}