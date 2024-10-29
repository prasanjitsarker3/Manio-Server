import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../App/config";
import { ICloudinaryResponse, IFile } from "./file";
import fs from "fs";

cloudinary.config({
  cloud_name: "du1ibrigy",
  api_key: "993154364964536",
  api_secret: "MYSYgvEmmCZOS_WqMfsJc0mVK40",
  // cloud_name: "dby9tcuil",
  // api_key: "511759649588371",
  // api_secret: "_OTTEH8U82ubXpom7nKw8ibPgcQ",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  //   console.log(file);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
