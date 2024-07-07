import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDNIARY_CLOUD_NAME, 
    api_key: process.env.CLOUDNIARY_CLOUD_API, 
    api_secret: process.env.CLOUDNIARY_CLOUD_SECRET 
});

const uploadCloudniary = async (localfilePath) =>{
    try {
        if (!localfilePath) return null 
            
        const  response = await cloudinary.uploader.upload(localfilePath, {resource_type: "auto"})
        //file has been uploaded successfully
        console.log("file is uploaded on cloudniary", response.url);
        return response; // it return to user 
    } catch (error) {
        fs.unlinkSync(localfilePath); // remove the locally save temporary file as the upload operation got failed
        return null;
    }
}

export {uploadCloudniary}