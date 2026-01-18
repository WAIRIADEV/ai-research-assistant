import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setPreview(base64);
        onImageUpload(base64, file.name);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const clearPreview = () => {
    setPreview(null);
  };

  if (preview) {
    return (
      <div className="relative inline-block">
        <img
          src={preview}
          alt="Upload preview"
          className="max-w-xs max-h-48 rounded-lg border-2 border-blue-500"
        />
        <button
          onClick={clearPreview}
          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <ImageIcon className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          {isDragActive ? 'Drop image here' : 'Click or drag image to upload'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;