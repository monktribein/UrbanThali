"use client";

import React,{ useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


// ✅ Define the socket type for TypeScript
const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7001");

export default function OrderNotification() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect((): (() => void) => {
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("newOrder", (order) => {
      console.log("📦 New order received:", order);
      setShowPopup(true);
      playSound();

      setTimeout(() => setShowPopup(false), 5000);
    });

    // ✅ Proper cleanup
    return () => {
      socket.off("newOrder");
      socket.off("connect");
    };
  }, []);

//   const playSound = () => {
//     const audio = new Audio("/assets/sound/234523__foolboymedia__notification-up-2.wav"); 
//     audio.play().catch((err) => console.warn("Sound play failed:", err));
//   };


const playSound = () => {
  console.log("🎵 Trying to play sound...");
  const audio = new Audio("/assets/sound/234523__foolboymedia__notification-up-2.wav");
  audio.play().catch((err) => console.warn("Sound play failed:", err));
};

  return (
    <>
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
          🔔 One Order Received!
        </div>
      )}
    </>
  );
}
