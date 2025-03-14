import Constants from 'expo-constants';

// Get environment variables from Constants
const extra = Constants.expoConfig?.extra;

export const CLOUDINARY_CLOUD_NAME = extra?.cloudinaryCloudName;
export const CLOUDINARY_UPLOAD_PRESET = extra?.cloudinaryUploadPreset;