```code

    // Customer entity
    @Column({ type: 'varchar', default: null })
    @Transform(({ value }) => {
        if (!value) return value;

        return `${KtqConfigConstant.getCustomerMediaPath(value, 'avatar', true)}`;
    })
    avatar: string;

    @Column({ type: 'varchar', default: null })
    @Transform(({ value }) => {
        if (!value) return value;

        return `${KtqConfigConstant.getCustomerMediaPath(value, 'avatar', true)}`;
    })
    bg_cover: string;
```
