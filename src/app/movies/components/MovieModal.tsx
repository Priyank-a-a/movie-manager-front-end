"use client";

import { useState, useRef, ChangeEvent } from "react";
import "./MovieModal.css";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movieData: MovieFormData) => void;
  initialData?: {
    id?: string;
    title: string;
    publishing_year: number;
    poster?: string;
  };
  mode: "add" | "edit";
}

export interface MovieFormData {
  id?: string;
  title: string;
  publishing_year: number;
  poster?: File | string | null;
}

export default function MovieModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: MovieModalProps) {
  const [formData, setFormData] = useState<MovieFormData>({
    id: initialData?.id || undefined,
    title: initialData?.title || "",
    publishing_year: initialData?.publishing_year || new Date().getFullYear(),
    poster: initialData?.poster || null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.poster ? String(initialData.poster) : null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "publishing_year" ? parseInt(value, 10) : value,
    });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        poster: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h1 className="modal-title">
          {mode === "add" ? "Create a new movie" : "Edit"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="image-upload-container" onClick={handleImageClick}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Movie poster preview"
                  className="preview-image"
                />
              ) : (
                <>
                  <span className="upload-icon">↓</span>
                  <span className="upload-text">
                    {mode === "add"
                      ? "Drop an image here"
                      : "Drop other image here"}
                  </span>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="image-upload-input"
              />
            </div>

            <div className="form-fields">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <input
                type="number"
                name="publishing_year"
                placeholder="Publishing year"
                value={formData.publishing_year || ""}
                onChange={handleInputChange}
                className="form-input"
                required
                min="1900"
                max={new Date().getFullYear() + 5}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {mode === "add" ? "Submit" : "Update"}
            </button>
          </div>
        </form>

        {/* Wave effect at the bottom */}
        <div className="modal-wave-container">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
