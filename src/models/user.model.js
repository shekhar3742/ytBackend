import mongoose, {Schema} from mongoose ;
import bcrypt from "bcrypt"
import { JsonWebTokenError } from "jsonwebtoken";

const userSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true // jab apko bar bar ye search karna ho to index laga do aur behtar search milega 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
           
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudniary url
            required: true

        },
        coverImages: {
            type: String,
            
        },
        watchHistory:[
         {
            type: Schema.Types.ObjectId,
            ref: "video"

        }
     ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

} ,{timeStamps: true})

userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next() 
        
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)