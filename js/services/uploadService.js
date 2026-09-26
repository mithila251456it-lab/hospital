/**
 * HospitalityHub B2B Resource Exchange
 * Image Upload & Authenticity Validation Service
 * 
 * Implements strict frontend validation for file types, size limits,
 * maximum 3–4 photo constraints, FileReader preview generation,
 * and backend-ready metadata structures for server-side authenticity checks.
 */

(function(window) {
  'use strict';

  const UPLOAD_CONSTRAINTS = {
    MAX_IMAGES: 4,
    MIN_RECOMMENDED: 3,
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
  };

  class UploadService {
    constructor() {
      this.constraints = UPLOAD_CONSTRAINTS;
    }

    // Validate a single File object before processing
    validateFile(file) {
      if (!file) {
        return { valid: false, error: 'No file provided.' };
      }

      // 1. Mime-type verification
      const mime = (file.type || '').toLowerCase();
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      
      const isMimeValid = this.constraints.ALLOWED_MIME_TYPES.includes(mime);
      const isExtValid = this.constraints.ALLOWED_EXTENSIONS.includes(ext);

      if (!isMimeValid && !isExtValid) {
        return {
          valid: false,
          error: `Unsupported file format (${file.name}). Please upload high-resolution JPG, PNG, or WEBP images.`
        };
      }

      // 2. File size validation (Max 5MB)
      if (file.size > this.constraints.MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          valid: false,
          error: `File "${file.name}" is ${sizeMb} MB. Maximum allowed size is 5.0 MB.`
        };
      }

      return { valid: true };
    }

    // Validate a batch of files against total limits
    validateBatch(existingCount, newFiles) {
      const remainingSlots = this.constraints.MAX_IMAGES - existingCount;
      if (remainingSlots <= 0) {
        return {
          valid: false,
          error: `Maximum limit of ${this.constraints.MAX_IMAGES} photos reached. Please remove an existing photo first.`
        };
      }

      if (newFiles.length > remainingSlots) {
        return {
          valid: false,
          error: `You can only add ${remainingSlots} more photo(s). Maximum total allowed is ${this.constraints.MAX_IMAGES}.`
        };
      }

      for (let i = 0; i < newFiles.length; i++) {
        const check = this.validateFile(newFiles[i]);
        if (!check.valid) {
          return check;
        }
      }

      return { valid: true };
    }

    // Read file and generate data URL with simulated progress
    async processFileForPreview(file, onProgress) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onprogress = (e) => {
          if (e.lengthComputable && typeof onProgress === 'function') {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };

        reader.onload = () => {
          if (typeof onProgress === 'function') onProgress(100);
          
          // Construct backend-ready image metadata payload
          const imageRecord = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            sizeBytes: file.size,
            mimeType: file.type,
            lastModified: file.lastModified,
            dataUrl: reader.result,
            previewUrl: reader.result,
            isCover: false,
            // Verification Architecture Metadata (to be verified by backend)
            verificationStatus: 'Pending Server Analysis',
            clientValidationPassed: true,
            serverAuthenticityChecked: false,
            moderationFlags: []
          };
          resolve(imageRecord);
        };

        reader.onerror = () => {
          reject(new Error(`Failed to read file "${file.name}".`));
        };

        reader.readAsDataURL(file);
      });
    }

    // Simulated cloud upload for backend integration
    async uploadToBackend(images, context = 'resource') {
      // Backend integration placeholder
      // When connected to backend: POST multipart/form-data to /api/uploads
      return {
        success: true,
        images: images.map((img, idx) => ({
          ...img,
          url: img.dataUrl || img.url,
          uploadedAt: new Date().toISOString(),
          serverAuthenticityStatus: 'Queued for Admin Review'
        })),
        message: `${images.length} photo(s) staged successfully. Server-side verification pending.`
      };
    }
  }

  if (typeof window !== 'undefined') {
    window.uploadService = new UploadService();
    window.UPLOAD_CONSTRAINTS = UPLOAD_CONSTRAINTS;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = UploadService;
  }
})(typeof window !== 'undefined' ? window : global);
