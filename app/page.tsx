"use client"

import Dock from "@/components/ui/dockDemo";
import { ModeToggle } from "@/components/ui/toggle-theme";
import CanvasBoard from "@/components/ui/CanvasBoard";
import { useState } from "react";

export default function Home() {
  const [strokeWidth, setStrokeWidth] = useState(2); // Default stroke width

  // Clear canvas function
  const clearCanvas = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
};


  return (
    <div className="p-2 relative h-screen overflow-hidden">
      {/* Canvas */}
      <div className="relative z-0">
        <CanvasBoard strokeWidth={strokeWidth} />

        {/* Mode Toggle inside the canvas */}
        <div className="absolute top-4 left-4 z-2">
          <ModeToggle />
        </div>
      </div>

      {/* Dock positioned at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 pb-3 z-10">
        <Dock setStrokeWidth={setStrokeWidth} clearCanvas={clearCanvas} />
      </div>
    </div>
  );
}
