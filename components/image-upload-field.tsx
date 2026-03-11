"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadFieldProps {
  label: string;
  currentValue?: string;
  pendingPreview?: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  onUrlChange: (url: string) => void;
}

export function ImageUploadField({
  label,
  currentValue,
  pendingPreview,
  onFileSelect,
  onRemove,
  onUrlChange,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayImage = pendingPreview || currentValue;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return;
      onFileSelect(file);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {displayImage ? (
        <div className="relative w-20 h-20 border rounded-lg overflow-hidden bg-muted group">
          <img
            src={displayImage}
            alt={label}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-primary-foreground rounded p-1"
            >
              <Upload className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="bg-destructive text-destructive-foreground rounded p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          {pendingPreview && (
            <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] px-1 rounded">
              Novo
            </div>
          )}
        </div>
      ) : (
        <div
          className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-6 w-6 text-muted-foreground/50" />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Selecionar
        </Button>
        <Input
          value={currentValue || ""}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="ou cole a URL"
          className="flex-1"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
