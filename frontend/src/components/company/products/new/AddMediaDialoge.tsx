"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, Upload } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";

export default function AddMediaDialoge({
  file,
  setFile,
}: {
  file: File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (f: File) => {
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setPreviewUrl(null);
      setIsDragOver(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Upload Product Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }
            `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drop your image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF, WebP, Avif
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.avif"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={previewUrl! || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(undefined);
                    setPreviewUrl(null);
                  }}
                >
                  Remove
                </Button>
              </div>
              <Button onClick={() => handleSubmit()} className="w-full">
                Submit Image
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
