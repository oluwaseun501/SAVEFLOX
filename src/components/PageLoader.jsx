import { useEffect, useState } from "react";

export default function PageLoader() {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setProgress(30), 100),
      setTimeout(() => setProgress(60), 400),
      setTimeout(() => setProgress(80), 800),
      setTimeout(() => setProgress(95), 1400),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="min-h-[calc(100vh-64px)] w-full bg-white dark:bg-gray-900" />
    </>
  );
}