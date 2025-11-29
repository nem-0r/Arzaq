// src/components/common/ImageUpload/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import { IoCloudUploadOutline, IoCloseCircle, IoImageOutline } from 'react-icons/io5';
import styles from './ImageUpload.module.css';

const ImageUpload = ({
  onImageSelect,
  onImageRemove,
  existingImage = null,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [preview, setPreview] = useState(existingImage);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Please upload an image (${acceptedFormats.join(', ')})`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `Image size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      {!preview ? (
        <div
          className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${error ? styles.error : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <IoCloudUploadOutline className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p className={styles.uploadHint}>
            PNG, JPG, WEBP up to {maxSizeMB}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleInputChange}
            className={styles.fileInput}
          />
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <img
            src={preview}
            alt="Preview"
            className={styles.previewImage}
          />
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeButton}
            aria-label="Remove image"
          >
            <IoCloseCircle />
          </button>
        </div>
      )}

      {error && (
        <p className={styles.errorMessage}>{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
