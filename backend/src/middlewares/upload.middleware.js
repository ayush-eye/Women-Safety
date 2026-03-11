import multer from "multer";
import { v4 as uuidv4 } from "uuid";

 const storage = multer.diskStorage({

    destination: (req,file,cb) =>
    {
        cb(null,"uploads/");

    },
    filename:(req,file,cb)=>{
        const uniqueName = uuidv4() + "-" + file.originalname;
        cb(null, uniqueName);
     
    }
})

export const upload = multer({ storage });