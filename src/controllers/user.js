import {asyncHandler} from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadCloudniary } from "../utils/cloudniary.js";
import { ApiResponse } from "../utils/apiResponse.js";


const registerUser = asyncHandler(async(req, res) => {
    // get user detail from frontend(abhi postman se data lenge kyuki frontend nhi)
    //    validation = not empty
    //check if user already exist: username , email
    // check for images , avatar
    // upload them in clodarany
    // create user object = create entry in db
    // remove password and refresh token feild from response
    // check for user creation
    //return res

     const {fullname, email, username, password}=req.body // from this we can handle data bur for file we use multer, code is wriiten on routes.user.js 
     console.log("email:", email);

    if([
        fullname, email, username, password].some((feild) =>
         feild.trim() === "")
    ){
        throw new ApiError(400, "All feilds are required")
    }

   const existedUser =  User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "user with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadCloudniary(avatarLocalPath)
    const coverImage = await uploadCloudniary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

   const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = User.findById(user._id).select("-password -refreshToken") // -password. - issliye use karte h kyuki humlog ye feild nhi chahiye 

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered Succesfully")
    )

})

export {registerUser}
