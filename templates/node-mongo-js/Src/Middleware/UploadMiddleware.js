import multer from "multer";
import slugify from "slugify";

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Src/Uploads");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            slugify(file.fieldname, {
                lower: true,
                strict: true,
            }) +
                "_" +
                Date.now() +
                "." +
                file.originalname.split(".").pop()
        );
    },
});

const uploadMiddleware = multer({ storage: storage });
export default uploadMiddleware;

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "Src/Uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// var upload = multer({ storage: storage });
// export default upload;
