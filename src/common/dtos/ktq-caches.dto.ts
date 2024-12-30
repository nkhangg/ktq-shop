import KtqAppConstant from '@/constants/ktq-app.constant';
import { ArrayNotEmpty, IsArray, IsIn } from 'class-validator';

export class ClearCacheByKeys {
    @IsArray()
    @ArrayNotEmpty()
    @IsIn(KtqAppConstant.CACHE_KEYS, {
        each: true,
    })
    cache_keys: string[];
}
