"use client";
import { useState, useRef } from "react";

interface StarRatingProps {
  totalStars?: number;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  totalStars = 5,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);

  // refs para cada vídeo
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handleClick = (index: number) => {
    setRating(index);
    onChange?.(index);
  };

  const handleVideoEnd = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      // Congela no último frame
      video.currentTime = video.duration;
      video.pause();
    }
  };

  return (
    <div className="flex gap-2 mx-auto">
      {Array.from({ length: totalStars }, (_, i) => {
        const index = i + 1;
        const isHovered = hovered !== null && index <= hovered;
        const isSelected = index <= rating;

        let content;

        if (isHovered) {
          content = (
            <img
              src="/Gifs/starblink.gif"
              alt="Star hover"
              className="w-10 h-10 object-contain [animation-play-state:paused]"
            />
          );
        } else if (isSelected) {
          if (index === rating) {
            content = (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src="/Videos/StarBlink.webm"
                autoPlay
                muted
                playsInline
                className="w-10 h-10 object-contain"
                onEnded={() => handleVideoEnd(index)}
              />
            );
          } else {
            content = (
              <img
                src="/Gifs/starblink.gif"
                alt="Star static"
                className="w-10 h-10 object-contain [animation-play-state:paused]"
              />
            );
          }
        } else {
          // Padrão → graystar.webm, rodando uma vez e parando
          content = (
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src="/Videos/graystar.webm"
              autoPlay
              muted
              playsInline
              className="w-10 h-10 object-contain"
              onEnded={() => handleVideoEnd(index)}
            />
          );
        }

        return (
          <div
            key={index}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleClick(index)}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
