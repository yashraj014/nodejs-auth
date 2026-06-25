const cloudinary = require('../config/cloudinary')

// const uploadToCloudinary = async(filePath)=>{
//     try {
//         const result = await cloudinary.uploader.upload(filePath,{
//             folder: 'testing/users'
//         });

//         return {
//             url:result.secure_url,
//             publicId: result.public_id
            
//         }
//     } catch (error) {
//         console.log('Error while uploading',error);
//         throw new Error('Error while uploading to cloudinary')
//     }
// }


const uploadToCloudinary = (buffer)=>{
    return new Promise((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream({
            folder:'testing/buffer'
        },
        (error,result)=>{
            if(error){
                reject(error);
                return;
            }

            resolve({
                url:result.secure_url,
                publicId: result.public_id 
            });
        }
    )
      stream.end(buffer)
    });
};

module.exports={
    uploadToCloudinary
}