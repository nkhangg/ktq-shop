import { HasExistedValidator } from '@/common/systems/validators/has-existed.validator';
import { IsUniqueValidator } from '@/common/systems/validators/is-unique.validator';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    providers: [IsUniqueValidator, HasExistedValidator],
    exports: [IsUniqueValidator, HasExistedValidator],
})
export class KtqAppValidatorsModule {}
