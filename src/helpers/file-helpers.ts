import { extname, join } from "path";
import { v4 } from 'uuid';
import { unlink } from "fs";

export type FileNameCallback = (error: (Error | null), filename: string) => void;
export type FileFilterCallback = (error: (Error | null), acceptFile: boolean) => void;

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

export const saveImage = (file: Express.Multer.File, callback: FileNameCallback) => {
    const extension = extname(file.originalname);
    const filename = v4() + extension;
    callback(null, filename);
    return filename;
}

export const imageFilter = (file: Express.Multer.File, callback: FileFilterCallback) =>
    callback(null, ALLOWED_EXTENSIONS.includes(extname(file.originalname)));

export const deleteImage = (imageUrl: string) => {
    const path = join(__dirname, '..', '..', 'public', imageUrl);
    unlink(path, error => {
        if (error)
            console.log(error);
    });
}
