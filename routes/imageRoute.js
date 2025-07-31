const express = require("express")
const router = express.Router()
const uploadimg = require("../middleware/uploadImg")
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');
const authenticate = require("../middleware/authenticate")

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error,result) => {
            if(result){
                resolve(result)
            }else {
                reject(error)
            }
        })
        streamifier.createReadStream(buffer).pipe(stream)
    })
}

/*
const stream = ...
-> creating a writable stream using cloudinary's upload_stream
streamifier.createReadStream(buffer) turns the raw buffer into a readable stream.
Then .pipe(stream) sends that stream into Cloudinary's upload stream — meaning, we pipe the image into Cloudinary.
*/

router.post("/upload", authenticate, uploadimg.single("image"), async(req, res) =>{
       
    
    if(!req.file){
        return res.status(400).json({msg:"no file uploaded"})
    }

    try {
        console.log("this is what req.file looks like", req.file)
        const result = await uploadFromBuffer(req.file.buffer)
        console.log(result)
        res.json({
            img_url:result.secure_url,
            success:true})

    }catch(error){
        console.log(error)
        res.status(500).json(
            {err:error,
             success:false
            })
    }
} )

module.exports = router

