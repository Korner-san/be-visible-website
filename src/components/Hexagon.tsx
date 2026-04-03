import React from "react";

export const Hexagon = ({ size = 8, className = "", outline = false }: { size?: number; className?: string; outline?: boolean; key?: any }) => (
  <div 
    className={`${outline ? "border-black border" : "bg-current"} ${className}`}
    style={{ 
      width: size, 
      height: size, 
      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      backgroundColor: outline ? "transparent" : undefined
    }} 
  />
);
