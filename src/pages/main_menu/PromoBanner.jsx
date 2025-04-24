import { useEffect, useState } from "react";

const bannerImages = [
  "/banner1.png",
  "/banner2.png",
  "/banner3.png",
];

function PromoBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[434px] overflow-hidden font-jakarta">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${bannerImages.length * 100}%`,
          transform: `translateX(-${current * (100 / bannerImages.length)}%)`,
        }}
      >
        {bannerImages.map((src, i) => (
          <div
            key={i}
            className="w-full max-w-[434px] flex-shrink-0"
          >
            <img
              src={src}
              alt={`Banner ${i + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PromoBanner;
