import React from "react";

const leaves = [
  { width: 18, height: 22, top: 10, left: 60,  delay: "0s",   opacity: 0.7  },
  { width: 14, height: 18, top: 0,  left: 90,  delay: "0.3s", opacity: 0.5  },
  { width: 16, height: 20, top: 20, left: 115, delay: "0.6s", opacity: 0.8  },
  { width: 12, height: 16, top: 5,  left: 135, delay: "0.9s", opacity: 0.55 },
  { width: 15, height: 19, top: 30, left: 150, delay: "1.2s", opacity: 0.65 },
  { width: 13, height: 17, top: 15, left: 170, delay: "0.4s", opacity: 0.6  },
  { width: 11, height: 15, top: 45, left: 160, delay: "0.8s", opacity: 0.45 },
];

function LeafIcon({ width, height, opacity }) {
  const cx = width / 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={`M${cx} 1 C${cx} 1 1 ${Math.round(height * 0.36)} 1 ${Math.round(height * 0.59)} C1 ${Math.round(height * 0.82)} ${Math.round(width * 0.3)} ${height} ${cx} ${height} C${Math.round(width * 0.7)} ${height} ${width - 1} ${Math.round(height * 0.82)} ${width - 1} ${Math.round(height * 0.59)} C${width - 1} ${Math.round(height * 0.36)} ${cx} 1 ${cx} 1Z`}
        fill="#4ecdc4"
        opacity={opacity}
      />
    </svg>
  );
}

export default function AccountRelatedForms() {
  return (
    <div className="flex items-center justify-start p-10 bg-white min-h-full border border-gray-200 flex-col rounded-md">
      {/* Keyframe injection — Tailwind doesn't cover custom keyframes */}
    

      <img src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/emptyState.b0f4e12f.svg" alt="" className="mb-10" width={600} height={600}/>
      <p className="text-2xl text-gray-600 font-bold">No account related forms found</p>
    </div>
  );
}