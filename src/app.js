import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

 
 //mainly .use is used for setup middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,  limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// import router
import userRouter from "./routes/user.js"

// routes deceleration
app.use("/api/v1/users", userRouter) //aise karne se app.js ganda nhi hoga user me jane ke bad control user router ke pass jayega phir waha se jaha route karna h kar sakte h 

export { app }