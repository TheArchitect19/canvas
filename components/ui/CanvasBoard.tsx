"use client"

import { useRef, useEffect, useState } from "react";

interface CanvasBoardProps {
  strokeWidth: number;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({ strokeWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false); // Track if mouse is being pressed

  const startDrawing = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red"; // Red color for drawing

        const { offsetX, offsetY } = e.nativeEvent;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return; // Only draw if mouse is pressed
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const { offsetX, offsetY } = e.nativeEvent;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.closePath(); // Close the current drawing path
      }
    }
    setIsDrawing(false); // Stop drawing
  };

  

  // Adjust the canvas size to match window size when it's loaded
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0"
        style={{
          border: "none",
          margin: 0,
          padding: 0,
          display: "block",
          width: "100vw", // Full viewport width
          height: "100vh", // Full viewport height
          overflow: "hidden", // Ensures no overflow
        }}
        onMouseDown={startDrawing} // Start drawing on mouse down
        onMouseMove={draw} // Draw as mouse moves
        onMouseUp={stopDrawing} // Stop drawing on mouse up
        onMouseOut={stopDrawing} // Stop drawing if mouse leaves canvas
      />
    </div>
  );
};

export default CanvasBoard;
