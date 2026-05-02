import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUploader({ onImageSelect, isLoading = false }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect({
          file,
          preview: e.target.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tif', '.tiff'],
    },
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-300
        ${
          isDragActive
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl">☁️</div>
        <div>
          <p className="text-lg font-semibold text-white">
            {isDragActive ? 'Drop satellite image here' : 'Drag satellite image here'}
          </p>
          <p className="text-sm text-gray-400">
            or click to select from your computer
          </p>
        </div>
        <p className="text-xs text-gray-500">
          Supported: JPEG, PNG, GeoTIFF (max 100MB)
        </p>
      </div>
    </div>
  );
}
