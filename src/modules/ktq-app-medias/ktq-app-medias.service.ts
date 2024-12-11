import KtqAppConstant from '@/constants/ktq-app.constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class KtqAppMediasService {
    async getCustomerMedia(filename: string) {
        const filePath = KtqAppConstant.customerMediaFilePath(filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('Avatar not found');
        }

        return filePath;
    }
}
