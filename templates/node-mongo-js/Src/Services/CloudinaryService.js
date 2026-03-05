import cloudinary from "cloudinary";
import ErrorHandler from "../Utils/CustomErrorHandler.js";
import { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../../Config/index.js";

if (CLOUDINARY_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.v2.config({
        CLOUDINARY_name: CLOUDINARY_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });
}

/**
 * PROFESSIONAL CLOUDINARY SERVICE
 * ===================================
 *
 * Enterprise-grade Cloudinary integration service providing advanced file upload,
 * processing, and management capabilities with professional error handling.
 *
 * Features:
 * - Advanced image and video processing
 * - Automatic format optimization
 * - Professional error handling and logging
 * - File size conversion utilities
 * - Secure file management
 *
 * @author TryAppStack
 */
const CloudinaryService = {
    /**
     * UPLOAD FILE TO CLOUDINARY
     * =============================
     *
     * Uploads a file to Cloudinary with automatic processing and optimization.
     * Provides secure file storage with advanced transformation capabilities.
     *
     * @param {Object} fileObject - The file object to be uploaded
     * @param {string} cloudFolder - The folder path in Cloudinary for organization
     * @returns {Promise<Object>} Upload result with public_id and secure URL
     * @throws {Error} When upload fails or invalid parameters provided
     */
    async uploadFile(fileObject, cloudFolder) {
        try {
            // Validate required parameters
            if (!fileObject) {
                throw new Error("Invalid file object: file cannot be null or undefined");
            }

            // Handle different file object types
            let uploadSource;

            if (typeof fileObject === "string") {
                // File path string
                uploadSource = fileObject;
            } else if (fileObject.buffer) {
                // Multer file object with buffer
                uploadSource = `data:${fileObject.mimetype
                    };base64,${fileObject.buffer.toString("base64")}`;
            } else if (fileObject.path) {
                // Multer file object with path
                uploadSource = fileObject.path;
            } else if (Buffer.isBuffer(fileObject)) {
                // Direct buffer
                uploadSource = fileObject;
            } else {
                throw new Error("Invalid file object: unsupported file format");
            }

            console.log("[CloudinaryService] Uploading file:", {
                folder: cloudFolder,
                sourceType: typeof uploadSource,
                hasBuffer: !!fileObject.buffer,
                hasPath: !!fileObject.path,
            });

            const uploadResult = await cloudinary.v2.uploader.upload(uploadSource, {
                folder: cloudFolder,
                width: 150,
                crop: "scale",
                quality: "auto",
            });

            console.log("[CloudinaryService] Upload successful:", {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            });

            return {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        } catch (uploadError) {
            console.error("[CloudinaryService] Upload failed:", uploadError.message);
            throw new Error(`Cloudinary upload failed: ${uploadError.message}`);
        }
    },

    /**
     * CONVERT FILE SIZE TO HUMAN READABLE FORMAT
     * ==============================================
     *
     * Converts file size from bytes to a professional human-readable format.
     * Supports all standard file size units from Bytes to Yottabytes.
     *
     * @param {number} fileSizeInBytes - The file size in bytes
     * @returns {string} Formatted file size string (e.g., "2.5 MB", "150 KB")
     * @throws {Error} When invalid size parameter is provided
     */
    fileSizeConversion(fileSizeInBytes) {
        try {
            // Validate input parameter
            if (typeof fileSizeInBytes !== "number" || fileSizeInBytes < 0) {
                throw new Error("Invalid file size: must be a positive number");
            }

            if (fileSizeInBytes === 0) {
                return "0 Bytes";
            }

            const conversionBase = 1000;
            const decimalPlaces = 2;
            const sizeUnits = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

            const unitIndex = Math.floor(Math.log(fileSizeInBytes) / Math.log(conversionBase));
            const convertedSize = parseFloat(
                (fileSizeInBytes / Math.pow(conversionBase, unitIndex)).toFixed(decimalPlaces)
            );

            const formattedSize = `${convertedSize} ${sizeUnits[unitIndex]}`;
            return formattedSize;
        } catch (conversionError) {
            console.error("Cloudinary Error:", conversionError.message);
            throw new Error(`File size conversion failed: ${conversionError.message}`);
        }
    },

    /**
     * REMOVE FILE FROM CLOUDINARY
     * ================================
     *
     * Securely removes a file from Cloudinary storage using the public_id.
     * Provides comprehensive error handling and logging for file deletion operations.
     *
     * @param {string} publicId - The Cloudinary public_id of the file to be deleted
     * @returns {Promise<Object>} Deletion result with success status and details
     * @throws {Error} When file removal fails or invalid public_id provided
     */
    async removeFile(publicId) {
        try {
            // Validate required parameters
            if (!publicId || publicId.trim() === "") {
                throw new ErrorHandler("Invalid public ID: file identifier cannot be empty", 400);
            }

            const deletionResult = await cloudinary.v2.uploader.destroy(publicId);
            return deletionResult;
        } catch (removalError) {
            console.error("Cloudinary Error:", removalError.message);
            throw new Error(`Cloudinary file removal failed: ${removalError.message}`);
        }
    },

    /**
     * UPLOAD FILE WITH CUSTOM OPTIONS
     * ===================================
     *
     * Uploads a file to Cloudinary with advanced processing options and transformations.
     * Supports custom image/video processing, quality optimization, and format conversion.
     *
     * @param {Object} fileObject - The file object to be uploaded
     * @param {string} cloudFolder - The folder path in Cloudinary for organization
     * @param {Object} customOptions - Advanced processing and transformation options
     * @returns {Promise<Object>} Upload result with public_id and secure URL
     * @throws {Error} When upload fails or invalid parameters provided
     */
    async uploadFileWithOptions(fileObject, cloudFolder, customOptions = {}) {
        try {
            // Validate required parameters
            if (!fileObject) {
                throw new Error("Invalid file object: file cannot be null or undefined");
            }

            // Professional default options
            const professionalDefaults = {
                folder: cloudFolder,
                width: 150,
                crop: "scale",
                quality: "auto",
            };

            // Merge default options with custom options
            const finalUploadOptions = { ...professionalDefaults, ...customOptions };

            // Handle different file object types
            let uploadSource;

            if (typeof fileObject === "string") {
                // File path string
                uploadSource = fileObject;
            } else if (fileObject.buffer) {
                // Multer file object with buffer
                uploadSource = `data:${fileObject.mimetype
                    };base64,${fileObject.buffer.toString("base64")}`;
            } else if (fileObject.path) {
                // Multer file object with path
                uploadSource = fileObject.path;
            } else if (Buffer.isBuffer(fileObject)) {
                // Direct buffer
                uploadSource = fileObject;
            } else {
                throw new Error("Invalid file object: unsupported file format");
            }

            console.log("[CloudinaryService] Uploading file with options:", {
                folder: cloudFolder,
                sourceType: typeof uploadSource,
                hasBuffer: !!fileObject.buffer,
                hasPath: !!fileObject.path,
            });

            const uploadResult = await cloudinary.v2.uploader.upload(
                uploadSource,
                finalUploadOptions
            );

            console.log("[CloudinaryService] Upload successful:", {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            });

            return {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        } catch (uploadError) {
            console.error("[CloudinaryService] Upload failed:", uploadError.message);
            throw new Error(`Cloudinary advanced upload failed: ${uploadError.message}`);
        }
    },
};

export default CloudinaryService;
