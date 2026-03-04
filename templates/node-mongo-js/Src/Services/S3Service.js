import AWS from "aws-sdk";
import fs from "fs";
import { AWS_BUCKET_NAME, AWS_CLIENT_ID, AWS_CLIENT_SECRET, AWS_REGION } from "../../Config";

const bucketName = AWS_BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: AWS_CLIENT_ID,
    secretAccessKey: AWS_CLIENT_SECRET,
    region: AWS_REGION,
});

const S3Service = {
    /**
     * Uploads an image to AWS S3.
     *
     * @param {string} filePath - The local path to the file to be uploaded.
     * @param {string} key - The key (path) in the bucket where the file will be stored.
     * @returns {Promise<string>} - A promise that resolves with the public URL of the uploaded file.
     */
    async _upload(file, key, ContentType) {
        try {
            const fileContent = fs.readFileSync(file.path);
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: fileContent,
                ACL: "public-read", // Set to 'private' if the file should not be publicly accessible
            };

            const uploadResult = await s3.upload(params).promise();
            console.log("File uploaded successfully:", uploadResult.Location);
            return uploadResult;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    },
    /**
     * Removes an image from AWS S3.
     *
     * @param {string} key - The key (path) of the file to be deleted.
     * @returns {Promise} - A promise that resolves when the file is deleted.
     */
    async _remove() {
        try {
            const params = {
                Bucket: bucketName,
                Key: key,
            };

            const deleteResult = await s3.deleteObject(params).promise();
            console.log("File deleted successfully:", deleteResult);
            return deleteResult;
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    },
};

export default S3Service;
