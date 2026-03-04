import { IS_S3 } from "../../Config/index.js";
import S3Service from "./S3Service.js";
import CloudinaryService from "./CloudinaryService.js";

/**
 * 🚀 PROFESSIONAL FILE UPLOAD SERVICE
 * ===================================
 *
 * Enterprise-grade file upload service that provides a unified interface
 * for multiple storage providers (AWS S3 & Cloudinary).
 *
 * Features:
 * - Automatic provider detection based on environment configuration
 * - Consistent API across all storage providers
 * - Professional error handling and logging
 * - File size conversion utilities
 * - Support for images, videos, and documents
 *
 * @author Ground Booking Team
 * @version 2.0.0
 */
const FileUploadService = {
    /**
     * 📤 UPLOAD FILE TO STORAGE
     * =========================
     *
     * Uploads a file to the configured storage service with automatic provider detection.
     * Supports both AWS S3 and Cloudinary with unified response format.
     *
     * @param {Object} fileObject - The file object to be uploaded
     * @param {string} storageKey - The unique key/path for file storage
     * @param {string} cloudFolder - The folder name (Cloudinary specific)
     * @param {string} mimeType - The content type of the file (S3 specific)
     * @param {Object} uploadOptions - Additional upload configuration options
     * @returns {Promise<Object>} Upload result with URL and metadata
     * @throws {Error} When upload fails or invalid parameters provided
     */
    async uploadFile(
        fileObject,
        storageKey,
        cloudFolder = "",
        mimeType = "image/jpeg",
        uploadOptions = {}
    ) {
        try {
            // Validate required parameters
            if (!fileObject || !storageKey) {
                throw new Error("Invalid parameters: fileObject and storageKey are required");
            }

            const isS3Enabled = IS_S3 === "true" || IS_S3 === true;

            if (isS3Enabled) {
                const uploadResult = await S3Service._upload(fileObject, storageKey, mimeType);

                return {
                    url: uploadResult.Location,
                    key: storageKey,
                    bucket: uploadResult.Bucket,
                };
            } else {
                const uploadResult = await CloudinaryService.uploadFileWithOptions(
                    fileObject,
                    cloudFolder,
                    uploadOptions
                );

                return {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                };
            }
        } catch (uploadError) {
            console.error("FileUpload Error:", uploadError.message);
            throw new Error(`File upload failed: ${uploadError.message}`);
        }
    },

    /**
     * 🗑️ REMOVE FILE FROM STORAGE
     * ============================
     *
     * Removes a file from the configured storage service with automatic provider detection.
     * Handles both S3 keys and Cloudinary public_ids seamlessly.
     *
     * @param {string} fileIdentifier - The file identifier (S3 key or Cloudinary public_id)
     * @returns {Promise<Object>} Deletion result with success status
     * @throws {Error} When file removal fails or invalid identifier provided
     */
    async removeFile(fileIdentifier) {
        try {
            // Validate required parameters
            if (!fileIdentifier || fileIdentifier.trim() === "") {
                throw new Error("Invalid file identifier: identifier cannot be empty");
            }

            const isS3Enabled = IS_S3 === "true" || IS_S3 === true;

            if (isS3Enabled) {
                const deletionResult = await S3Service._remove(fileIdentifier);
                return deletionResult;
            } else {
                const deletionResult = await CloudinaryService.removeFile(fileIdentifier);
                return deletionResult;
            }
        } catch (removalError) {
            console.error("FileUpload Error:", removalError.message);
            throw new Error(`File removal failed: ${removalError.message}`);
        }
    },

    /**
     * 🖼️ UPLOAD IMAGE WITH PROCESSING
     * ================================
     *
     * Uploads an image file with automatic processing and optimization.
     * Supports advanced image transformations on Cloudinary and standard storage on S3.
     *
     * @param {Object} imageFile - The image file object to be uploaded
     * @param {string} storageKey - The unique key/path for image storage
     * @param {string} cloudFolder - The folder name (Cloudinary specific)
     * @param {Object} processingOptions - Image processing and transformation options
     * @returns {Promise<Object>} Upload result with URL and metadata
     * @throws {Error} When image upload fails or invalid parameters provided
     */
    async uploadImage(imageFile, storageKey, cloudFolder = "", processingOptions = {}) {
        try {
            // Validate required parameters
            if (!imageFile || !storageKey) {
                throw new Error("Invalid parameters: imageFile and storageKey are required");
            }

            const isS3Enabled = IS_S3 === "true" || IS_S3 === true;

            if (isS3Enabled) {
                const uploadResult = await S3Service._upload(imageFile, storageKey, "image/jpeg");

                return {
                    url: uploadResult.Location,
                    key: storageKey,
                    bucket: uploadResult.Bucket,
                };
            } else {
                const defaultProcessingOptions = {
                    width: 150,
                    crop: "scale",
                    quality: "auto",
                };

                const finalProcessingOptions = {
                    ...defaultProcessingOptions,
                    ...processingOptions,
                };
                const uploadResult = await CloudinaryService.uploadFileWithOptions(
                    imageFile,
                    cloudFolder,
                    finalProcessingOptions
                );

                return {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                };
            }
        } catch (uploadError) {
            console.error("FileUpload Error:", uploadError.message);
            throw new Error(`Image upload failed: ${uploadError.message}`);
        }
    },

    /**
     * 🎥 UPLOAD VIDEO WITH PROCESSING
     * ================================
     *
     * Uploads a video file with automatic processing and optimization.
     * Supports advanced video transformations on Cloudinary and standard storage on S3.
     *
     * @param {Object} videoFile - The video file object to be uploaded
     * @param {string} storageKey - The unique key/path for video storage
     * @param {string} cloudFolder - The folder name (Cloudinary specific)
     * @param {Object} videoProcessingOptions - Video processing and transformation options
     * @returns {Promise<Object>} Upload result with URL and metadata
     * @throws {Error} When video upload fails or invalid parameters provided
     */
    async uploadVideo(videoFile, storageKey, cloudFolder = "", videoProcessingOptions = {}) {
        try {
            // Validate required parameters
            if (!videoFile || !storageKey) {
                throw new Error("Invalid parameters: videoFile and storageKey are required");
            }

            const isS3Enabled = IS_S3 === "true" || IS_S3 === true;

            if (isS3Enabled) {
                console.log("🔄 [FileUpload] Uploading video to AWS S3");
                const uploadResult = await S3Service._upload(videoFile, storageKey, "video/mp4");
                console.log("✅ [FileUpload] Video successfully uploaded to S3");

                return {
                    url: uploadResult.Location,
                    key: storageKey,
                    bucket: uploadResult.Bucket,
                };
            } else {
                console.log("🔄 [FileUpload] Uploading video to Cloudinary with processing");

                // Professional video processing options
                const defaultVideoOptions = {
                    resource_type: "video",
                    quality: "auto",
                };

                const finalVideoOptions = {
                    ...defaultVideoOptions,
                    ...videoProcessingOptions,
                };
                const uploadResult = await CloudinaryService.uploadFileWithOptions(
                    videoFile,
                    cloudFolder,
                    finalVideoOptions
                );

                console.log(
                    "✅ [FileUpload] Video successfully uploaded to Cloudinary with processing"
                );
                return {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                };
            }
        } catch (uploadError) {
            console.error("❌ [FileUpload] Video upload failed:", uploadError.message);
            throw new Error(`Video upload failed: ${uploadError.message}`);
        }
    },

    /**
     * 📎 UPLOAD DOCUMENT/ATTACHMENT
     * ==============================
     *
     * Uploads a document or attachment file with appropriate handling for different file types.
     * Supports various document formats with proper MIME type detection.
     *
     * @param {Object} documentFile - The document file object to be uploaded
     * @param {string} storageKey - The unique key/path for document storage
     * @param {string} cloudFolder - The folder name (Cloudinary specific)
     * @param {string} mimeType - The MIME type of the document
     * @returns {Promise<Object>} Upload result with URL and metadata
     * @throws {Error} When document upload fails or invalid parameters provided
     */
    async uploadAttachment(
        documentFile,
        storageKey,
        cloudFolder = "",
        mimeType = "application/octet-stream"
    ) {
        try {
            // Validate required parameters
            if (!documentFile || !storageKey) {
                throw new Error("Invalid parameters: documentFile and storageKey are required");
            }

            const isS3Enabled = IS_S3 === "true" || IS_S3 === true;

            if (isS3Enabled) {
                console.log("🔄 [FileUpload] Uploading document to AWS S3");
                const uploadResult = await S3Service._upload(documentFile, storageKey, mimeType);
                console.log("✅ [FileUpload] Document successfully uploaded to S3");

                return {
                    url: uploadResult.Location,
                    key: storageKey,
                    bucket: uploadResult.Bucket,
                };
            } else {
                console.log("🔄 [FileUpload] Uploading document to Cloudinary");

                // Professional document handling options
                const documentOptions = {
                    resource_type: "raw",
                    folder: cloudFolder,
                };

                const uploadResult = await CloudinaryService.uploadFileWithOptions(
                    documentFile,
                    cloudFolder,
                    documentOptions
                );

                console.log("✅ [FileUpload] Document successfully uploaded to Cloudinary");
                return {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                };
            }
        } catch (uploadError) {
            console.error("❌ [FileUpload] Document upload failed:", uploadError.message);
            throw new Error(`Document upload failed: ${uploadError.message}`);
        }
    },

    /**
     * 🔍 GET CURRENT STORAGE PROVIDER
     * ================================
     *
     * Returns the currently active storage provider based on environment configuration.
     *
     * @returns {string} The active storage provider ('AWS S3' or 'Cloudinary')
     */
    getCurrentProvider() {
        return IS_S3 === "true" || IS_S3 === true ? "AWS S3" : "Cloudinary";
    },

    /**
     * ✅ CHECK IF AWS S3 IS ENABLED
     * ==============================
     *
     * Determines if AWS S3 is currently configured as the storage provider.
     *
     * @returns {boolean} True if S3 is enabled, false otherwise
     */
    isUsingS3() {
        return IS_S3 === "true" || IS_S3 === true;
    },

    /**
     * ✅ CHECK IF CLOUDINARY IS ENABLED
     * ==================================
     *
     * Determines if Cloudinary is currently configured as the storage provider.
     *
     * @returns {boolean} True if Cloudinary is enabled, false otherwise
     */
    isUsingCloudinary() {
        return !this.isUsingS3();
    },

    /**
     * 📏 CONVERT FILE SIZE TO HUMAN READABLE FORMAT
     * ==============================================
     *
     * Converts file size from bytes to a human-readable format (KB, MB, GB, etc.).
     * Uses CloudinaryService implementation for consistency across the application.
     *
     * @param {number} fileSizeInBytes - The file size in bytes
     * @returns {string} Formatted file size string (e.g., "2.5 MB", "150 KB")
     * @throws {Error} When invalid size parameter is provided
     */
    fileSizeConversion(fileSizeInBytes) {
        try {
            if (typeof fileSizeInBytes !== "number" || fileSizeInBytes < 0) {
                throw new Error("Invalid file size: must be a positive number");
            }

            const formattedSize = CloudinaryService.fileSizeConversion(fileSizeInBytes);
            return formattedSize;
        } catch (conversionError) {
            console.error("FileUpload Error:", conversionError.message);
            throw new Error(`File size conversion failed: ${conversionError.message}`);
        }
    },
};

export default FileUploadService;
