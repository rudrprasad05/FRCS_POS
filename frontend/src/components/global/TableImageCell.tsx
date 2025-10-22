"use client";

import { cn } from "@/lib/utils";
import { Media } from "@/types/models";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const TableImageCell = ({ media }: { media?: Media }) => {
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="relative object-cover aspect-square h-16 w-full rounded-md overflow-hidden">
      {isImageValid ? (
        <>
          <Image
            width={100}
            height={100}
            src={media?.url as string}
            onError={(e) => {
              e.currentTarget.onerror = null;
              setIsImageValid(false);
            }}
            onLoad={() => setIsImageLoaded(true)}
            alt="image"
            className={cn(
              "w-full h-full object-cover",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {!isImageLoaded && (
            <div className="absolute top-0 left-0 w-full h-full object-cover animate-pulse"></div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center ">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
