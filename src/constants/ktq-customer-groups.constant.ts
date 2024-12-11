import KtqCustomerGroup from '@/entities/ktq-customer-groups.entity';

export default class KtqCustomerGroupsConstant {
    public static CUSTOMER_GENERAL_GROUP = 'general';
    public static CUSTOMER_RETAILER_GROUP = 'retailer';
    public static CUSTOMER_WHOLESALE_GROUP = 'wholesale';

    public static getGroups() {
        return [
            {
                id: 1,
                name: this.CUSTOMER_GENERAL_GROUP,
            },
            {
                id: 2,
                name: this.CUSTOMER_RETAILER_GROUP,
            },
            {
                id: 3,
                name: this.CUSTOMER_WHOLESALE_GROUP,
            },
        ] as KtqCustomerGroup[];
    }

    public static getCustomerGeneralGroup() {
        return this.getGroups().find((group) => group.name === this.CUSTOMER_GENERAL_GROUP);
    }
}
