import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const register = asynchandler(async (req, res) => {

   //GET USER DETAIL FROM FRONT END

   const { username,password,fullname,email  } = req.body;
   console.log(req.body);

   // VALIDATION - NOT EMPTY
   if([username,password,fullname,email].some((item)=>item?.trim()==="")){
      throw new ApiError(400,"Please fill all the fields");
   }
   // CHECK IF USER ALREADY EXIST ; USERAME , EMAIL

   const existeduser = await User.findOne({
        $or:[{username},{email}]
     })

     if(existeduser){
        throw new ApiError(400,"User already exist");
     }
   
   // CHECK FOR IMAGES AND CHECK FOR AVATAR 

   const avatarlocalpath = req.files?.avatar[0]?.path;
//    const coverImagelocalpath = req.files?.coverImage[0]?.path;

  let coverImagelocalpath;

  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImagelocalpath = req.files.coverImage[0].path;
  }

   if(!avatarlocalpath){
        throw new ApiError(400,"Please upload avatar");
   }
   // UPLOAD THEM TO CLOUDINARY

   const avatar = await uploadOnCloudinary(avatarlocalpath);
   const coverImage = await uploadOnCloudinary(coverImagelocalpath);

   if(!avatar){
        throw new ApiError(500,"Something went wrong while uploading avatar");
   }
   // CREATE A USER OBJECT

   const user = await User.create({
      username : username.toLowerCase(),
      password,
      fullname,
      email,
      avatar:avatar.url,
      coverImage:coverImage?.url || null,
   })
   // REMOVE PASSWORD AND REFRESH TOKEN FROM USER RESPONSE &
   // CHECK FOR USER CREATED OR NOT

   const createduser = await User.findById(user._id).select("-password -refreshToken");
   // RETURN RESPONSE


   if(!createduser){
        throw new ApiError(500,"Something went wrong while creating user");
   } else {
    res.status(201).json(new ApiResponse(201,"User created successfully",createduser));
   }
});