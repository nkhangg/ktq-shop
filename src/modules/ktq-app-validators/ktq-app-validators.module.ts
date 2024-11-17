import { HasExistedValidator } from '@/common/systems/validators/has-existed.validator';
import { IsUniqueValidator } from '@/common/systems/validators/is-unique.validator';
import { OnBlackListValidator } from '@/common/systems/validators/on-black-list.validator';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    providers: [IsUniqueValidator, HasExistedValidator, OnBlackListValidator],
    exports: [IsUniqueValidator, HasExistedValidator, OnBlackListValidator],
})
export class KtqAppValidatorsModule {}
