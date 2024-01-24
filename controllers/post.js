const Post=require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
createPost=async(req,res)=>{
    req.body.user=req.user.userId
    req.body.location=req.user.location;
    if(req.files)
    {
        if (req.files.photo) {
        if (req.files.photo.size > 1000000) {
          throw new CustomError.BadRequestError(
            `File size must be less than 1MB`
          );
        }
        const result = await cloudinary.uploader.upload(
          req.files.photo.tempFilePath,
          {
            use_filename: true,
            folder: "PetsKart",
          }
        );
        fs.unlinkSync(req.files.photo.tempFilePath);
        req.body.photos = [result.secure_url];
        }

         if (req.files.video) {
           if (req.files.video.size > 1000000) {
             throw new CustomError.BadRequestError(
               `File size must be less than 1MB`
             );
           }
           const result = await cloudinary.uploader.upload(
             req.files.video.tempFilePath,
             {
               use_filename: true,
               folder: "PetsKart",
             }
           );
           fs.unlinkSync(req.files.video.tempFilePath);
           req.body.videos = [result.secure_url];
         }
    }

    const post=await Post.create(req.body);
    res.status(StatusCodes.CREATED).json({ post });
}

updatePost = async (req, res) => {
  let entry=await Post.findOne({_id:req.params.id});
  if (req.files) {
    if (req.files.photo) {
      if (req.files.photo.size > 1000000) {
        throw new CustomError.BadRequestError(
          `File size must be less than 1MB`
        );
      }
      const result = await cloudinary.uploader.upload(
        req.files.photo.tempFilePath,
        {
          use_filename: true,
          folder: "PetsKart",
        }
      );
      fs.unlinkSync(req.files.photo.tempFilePath);
      req.body.photos = [result.secure_url,...entry.photos];
    }

    if (req.files.video) {
      if (req.files.video.size > 5000000) {
        throw new CustomError.BadRequestError(
          `File size must be less than 1MB`
        );
      }
      const result = await cloudinary.uploader.upload(
        req.files.video.tempFilePath,

        {
          use_filename: true,
          folder: "PetsKart",
          resource_type: "video",
        }
      );
      fs.unlinkSync(req.files.video.tempFilePath);
      req.body.videos = [result.secure_url,...entry.videos];
    }
   
  }
  let result = await Post.findOneAndUpdate({ _id: entry._id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json({ result });
  
};

const getPostById = async (req, res) => {
     result = await Post.findOne({ _id: req.params.id });
     res.status(StatusCodes.CREATED).json({ result });
};

const getPostsByCategory= async (req, res) => {
  result = await Post.findOne({ _id: req.params.category });
  res.status(StatusCodes.OK).json({ result });
};

const getUserPosts=async (req,res)=>{
     result = await Post.find({ user:req.user.userId ,is_active:true});
     res.status(StatusCodes.OK).json({ result });
}

const getAllPosts = async (req, res) => {
  if(req.query.kind)
  {
    req.body.kind = req.query.kind;
  }
  result = await Post.find({ is_active: true,...req.body });
  res.status(StatusCodes.OK).json({ result });
};

const likePost = async (req, res) => {
  let result = await Post.findOne({ _id: req.params.id });
  let count_likes = result.likes ? result.likes : 0;
  result = await Post.findOneAndUpdate(
    { _id: result._id },
    { likes: count_likes + 1 },
    { new: true }
  );
  res.status(StatusCodes.CREATED).json({ result });
};


module.exports = {
 createPost,
 updatePost,
 getPostById,
 getPostsByCategory,
 getUserPosts,
 getAllPosts,
 likePost

};