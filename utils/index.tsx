import axios from "axios";

export const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    let uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
    if (uploadPreset === undefined) uploadPreset = ""
    formData.append('upload_preset', uploadPreset);

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/auto/upload`,
        formData
    );

    return response.data.secure_url;
}