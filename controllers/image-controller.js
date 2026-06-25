const Image = require('../models/image')
const {uploadToCloudinary} = require('../helper/cloudinaryHelper')
const cloudinary = require('../config/cloudinary')
const uploadImage = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                message:'File is required'
            })
        }

        const {url,publicId} = await uploadToCloudinary(req.file.buffer);

        const newUploadedImage = new Image({
            url,
            publicId,
            uploadedBy:req.user.userId
        });

        await newUploadedImage.save();

        res.status(201).json({
            sucess:true,
            message:'Image uploaded successfully',
            image: newUploadedImage
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:'Something went wrong',
            error:error.message
        })
        
    }
}

const fetchImage = async(req,res)=>{

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = parseInt(page-1)*limit;

        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder ==='asc'?1:-1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj= {};
        sortObj[sortBy]= sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success:true,
                currentPage:page,
                limit:limit,
                totalPages:totalPages,
                totalImages:totalImages,
                data:images
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:'Something went wrong',
            error:error.message
        })
    }
}

const deleteImage = async(req,res)=>{
    try {
        const currentImageId = req.params.id;
        const userId = req.user.userId;

        const image = await Image.findById(currentImageId);
        if(!image){
            return res.status(404).json({
                message:'image not found'
            })
        }
        const isOwner = image.uploadedBy.toString()===userId;
        if(!isOwner){
            return res.status(403).json({
                message:'Not authorized'
            })
        }

        await cloudinary.uploader.destroy(image.publicId);

        await Image.findByIdAndDelete(currentImageId);

        res.status(200).json({
            message:'Image deleted successfully.'
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:'Something went wrong',
            error:error.message
        })
    }
}

module.exports = {
    uploadImage,
    fetchImage,
    deleteImage
}