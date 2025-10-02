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
  const [rating, setRating] = useState<number>(0);

  // refs para vídeos
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
        const isSelected = index <= rating;

        let content;

        if (isSelected) {
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
                className="w-12 h-12 object-contain"
                onEnded={() => handleVideoEnd(index)}
              />
            );
          } else {
            content = (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src="/Videos/StarBlink.webm"
                muted
                playsInline
                className="w-12 h-12 object-contain"
                onEnded={() => handleVideoEnd(index)}
              />
            );
          }
        } else {
          content = (
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src="/Videos/graystar.webm"
              autoPlay
              muted
              playsInline
              className="w-12 h-12 object-contain"
              onEnded={() => handleVideoEnd(index)}
            />
          );
        }

        return (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => handleClick(index)}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
