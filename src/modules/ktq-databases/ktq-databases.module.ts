import KtqWebsite from '@/entities/ktq-websites.entity';
import KtqWard from '@/entities/ktq-wards.entity';
import KtqVisible from '@/entities/ktq-visibles.entity';
import KtqUserForgotPassword from '@/entities/ktq-user-forgot-passwords.entity';
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';
import KtqUserBlackListLog from '@/entities/ktq-user-black-list-logs.entity';
import KtqTaxRate from '@/entities/ktq-tax-rates.entity';
import KtqTaxCondition from '@/entities/ktq-tax-conditions.entity';
import KtqSession from '@/entities/ktq-sessions.entity';
import KtqRole from '@/entities/ktq-roles.entity';
import KtqRoleResource from '@/entities/ktq-role-resources.entity';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import KtqRegion from '@/entities/ktq-regions.entity';
import KtqReadNotification from '@/entities/ktq-read-notifications.entity';
import KtqReadAdminNotification from '@/entities/ktq-read-admin-notifications.entity';
import KtqProvince from '@/entities/ktq-provinces.entity';
import KtqPromotion from '@/entities/ktq-promotions.entity';
import KtqProduct from '@/entities/ktq-products.entity';
import KtqProductWebsite from '@/entities/ktq-product-websites.entity';
import KtqProductVisible from '@/entities/ktq-product-visibles.entity';
import KtqProductReview from '@/entities/ktq-product-reviews.entity';
import KtqProductPromotion from '@/entities/ktq-product-promotions.entity';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqPaymentMethod from '@/entities/ktq-payment-methods.entity';
import KtqOrder from '@/entities/ktq-orders.entity';
import KtqOrderTax from '@/entities/ktq-order-taxes.entity';
import KtqOrderPayment from '@/entities/ktq-order-payments.entity';
import KtqOrderItem from '@/entities/ktq-order-items.entity';
import KtqNotification from '@/entities/ktq-notifications.entity';
import KtqNotifiImage from '@/entities/ktq-notifi-images.entity';
import KtqMedia from '@/entities/ktq-medias.entity';
import KtqInventory from '@/entities/ktq-inventories.entity';
import KtqDistrict from '@/entities/ktq-districts.entity';
import KtqDefaultAttribute from '@/entities/ktq-default-attributes.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';
import KtqCustomerGroup from '@/entities/ktq-customer-groups.entity';
import KtqCoupon from '@/entities/ktq-coupons.entity';
import KtqCouponUsage from '@/entities/ktq-coupon-usage.entity';
import KtqCouponCondition from '@/entities/ktq-coupon-conditions.entity';
import KtqCountry from '@/entities/ktq-countries.entity';
import KtqConfig from '@/entities/ktq-configs.entity';
import KtqCategoryProduct from '@/entities/ktq-category-products.entity';
import KtqCategory from '@/entities/ktq-categories.entity';
import KtqCart from '@/entities/ktq-carts.entity';
import KtqAttribute from '@/entities/ktq-attributes.entity';
import KtqAttributeValue from '@/entities/ktq-attribute-values.entity';
import KtqAttributeSet from '@/entities/ktq-attribute-sets.entity';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import KtqAdminNotification from '@/entities/ktq-admin-notifications.entity';
import KtqAddress from '@/entities/ktq-addresses.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                charset: 'utf8mb4_unicode_ci',
                entities: [KtqAddress,KtqAdminNotification,KtqAdminUser,KtqAttributeSet,KtqAttributeValue,KtqAttribute,KtqCart,KtqCategory,KtqCategoryProduct,KtqConfig,KtqCountry,KtqCouponCondition,KtqCouponUsage,KtqCoupon,KtqCustomerGroup,KtqCustomer,KtqDefaultAttribute,KtqDistrict,KtqInventory,KtqMedia,KtqNotifiImage,KtqNotification,KtqOrderItem,KtqOrderPayment,KtqOrderTax,KtqOrder,KtqPaymentMethod,KtqPermission,KtqProductPromotion,KtqProductReview,KtqProductVisible,KtqProductWebsite,KtqProduct,KtqPromotion,KtqProvince,KtqReadAdminNotification,KtqReadNotification,KtqRegion,KtqResourcePermission,KtqResource,KtqRolePermission,KtqRoleResource,KtqRole,KtqSession,KtqTaxCondition,KtqTaxRate,KtqUserBlackListLog,KtqUserBlackList,KtqUserForgotPassword,KtqVisible,KtqWard,KtqWebsite],
                synchronize: true,
            }),
        }),
    ],
})
export class KtqDatabasesModule {}
