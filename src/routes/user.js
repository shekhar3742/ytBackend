import { Router } from "express";
import { registerUser } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
const userRouter = Router()

userRouter.route("/register").post( //  .feilds(multer ) we can handle files
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1 
        }
    ]),
    registerUser
)



export default userRouter