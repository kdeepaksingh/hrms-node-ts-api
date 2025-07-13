import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "uploads/");
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept only images for profilePhoto and PDFs for resume
  if (
    file.fieldname === "profilePhoto" &&
    !file.mimetype.startsWith("image/")
  ) {
    return cb(new Error("Profile photo must be an image"));
  }
  if (file.fieldname === "resume" && file.mimetype !== "application/pdf") {
    return cb(new Error("Resume must be a PDF"));
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
