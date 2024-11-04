require('dotenv').config()
// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key :process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result.url;
    } catch (error) {
      console.error(error);
      throw error;
    }
};

const deleteCloudFile = (url) => {
  return new Promise((resolve, reject) => {
    // Extract public ID from URL
    const matches = url.match(/\/([^\/]*)\.[a-z]{3,4}$/i);
    if (!matches || matches.length < 2) {
      return reject(new Error('Invalid Cloudinary URL'));
    }
    const publicId = matches[1];

    // Delete the image using the public ID
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};
// /////////////////////////////////////
// // Gets details of an uploaded image
// /////////////////////////////////////
// const getAssetInfo = async (publicId) => {

//     // Return colors in the response
//     const options = {
//       colors: true,
//     };

//     try {
//         // Get details about the asset
//         const result = await cloudinary.api.resource(publicId, options);
//         console.log(result);
//         return result.colors;
//         } catch (error) {
//         console.error(error);
//     }
// };

module.exports = {uploadImage , deleteCloudFile }