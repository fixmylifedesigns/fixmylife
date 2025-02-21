// src/components/TikTokPreview.js
"use client";
import { useState, useEffect, useRef } from "react";

export default function TikTokPreview({ videoSource, className,thumbnail }) {
  const [aspectRatio, setAspectRatio] = useState("9/16");
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoSource) {
      setAspectRatio("9/16");
    }
  }, [videoSource]);

  const handleDownload = () => {
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = videoSource;
    a.download = 'tiktok-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Video container styles
  const videoContainerStyle = {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: "0.5rem",
  };

  return (
    <div className={`tiktok-preview ${className || ""}`}>
      {videoSource && (
        <div className="video-container">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Video Preview</h3>
            <div className="flex space-x-2">
              <button 
                onClick={toggleFullscreen}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center text-sm"
                title="Expand video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 flex items-center text-sm"
                title="Download video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div style={videoContainerStyle} className="video-wrapper">
              <video
                ref={videoRef}
                src={videoSource}
                autoPlay
                muted
                loop
                playsInline
                className="rounded-lg w-full"
                style={{ aspectRatio: aspectRatio }}
                poster={thumbnail}
                onClick={(e) => {
                  if (e.target.paused) {
                    e.target.play();
                  } else {
                    e.target.pause();
                  }
                }}
              />
              {/* Custom video controls overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black bg-opacity-40 px-3 py-1 rounded-full flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      if (videoRef.current.paused) {
                        videoRef.current.play();
                      } else {
                        videoRef.current.pause();
                      }
                    }}
                    className="text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      videoRef.current.muted = !videoRef.current.muted;
                    }}
                    className="text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}