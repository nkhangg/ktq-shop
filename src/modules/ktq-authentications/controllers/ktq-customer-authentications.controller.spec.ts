import { Test, TestingModule } from '@nestjs/testing';
import { KtqCustomerAuthenticationsController } from './ktq-customer-authentications.controller';

describe('KtqCustomerAuthenticationsController', () => {
    let controller: KtqCustomerAuthenticationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [KtqCustomerAuthenticationsController],
        }).compile();

        controller = module.get<KtqCustomerAuthenticationsController>(KtqCustomerAuthenticationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
