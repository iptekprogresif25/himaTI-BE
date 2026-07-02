import multer from "multer"
import type { FileFilterCallback } from "multer"
import type { Request } from "express"
import path from "path"

const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"]

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname
    cb(null, uniqueName)
  }
})

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {

  const ext = path.extname(file.originalname).replace(".", "").toLowerCase()

  if (allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("File must be an image"))
  }

}

export const upload = multer({
  storage,
  fileFilter
})