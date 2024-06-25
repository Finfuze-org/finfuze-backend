const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,"../utils/imageFolder"))
        console.log("imageFile",path.join(__dirname,"../utils/imageFolder"))
    },
    filename:function (req,file,cb){
        cb(null,Date.now() + file.originalname)
    },
    fileFilter: function(req,file,cb){
        let ext = path.extname(file.originalname);
        if(ext !== ".mp4" && ext !== ".mkv" && ext !== ".mp3" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png"){
            cb(new Error("file is not supported"), false)
            return
        }
        cb(null,true)
    }
})

const upload = multer({storage:storage})

module.exports = {upload}