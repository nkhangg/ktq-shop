import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const storageConfig = (folder: string) =>
    diskStorage({
        destination: `public/${folder}`,
        filename(req, file, callback) {
            try {
                callback(null, Date.now() + '-' + randomUUID() + '-' + file.originalname);
            } catch (error) {}
        },
    });

export const filterStorage: MulterOptions['fileFilter'] = (req, file, callback) => {
    const etx = extname(file.originalname);
    const allowedExtArr = ['.jpg', '.png', '.jpeg'];
    if (!allowedExtArr.includes(etx)) {
        req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.join(', ')}`;
        callback(null, false);
    } else {
        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size less than 5mb`;
            callback(null, false);
        } else {
            callback(null, true);
        }
    }
};
