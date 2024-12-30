import { plainToClass } from 'class-transformer';
import { FilterOperator, FilterSuffix, Paginated } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';

export default class KtqResponse {
    public static toResponse(data: any, options?: { message?: string; status_code?: number; bonus?: any }) {
        return {
            message: options?.message || (!Boolean(data) ? `This action cannot be performed` : 'Success'),
            status_code: options?.status_code || 200,
            data: data,
            timestamp: new Date().toISOString(),
            ...(options?.bonus || {}),
        };
    }

    public static plainToInStance<M>(this: new (...args: any[]) => M, obj: M): M {
        return plainToClass(this, obj);
    }

    public static toPagination<M>({ data, meta }: Paginated<M>, transform = true, dtoClass?: new () => M) {
        const transformedData = transform && dtoClass ? data.map((item) => plainToClass(dtoClass, item)) : data;

        return this.toResponse(transformedData, {
            bonus: {
                current_page: meta.currentPage,
                from: meta.currentPage * meta.itemsPerPage - (meta.itemsPerPage - 1),
                to: meta.currentPage * meta.itemsPerPage > meta.totalItems ? meta.totalItems : meta.currentPage * meta.itemsPerPage,
                last_page: meta.totalPages,
                per_page: meta.itemsPerPage,
                total: meta.totalItems,
            },
        });
    }

    public static processFilters<T>(
        queryFilters: any,
        filterableColumns: {
            [key in Column<T> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        },
    ): any {
        if (!queryFilters) return {};

        const processedFilters = { ...queryFilters };

        for (const key in queryFilters) {
            const value = queryFilters[key];

            // Kiểm tra nếu cột có trong cấu hình filterableColumns
            if (filterableColumns[key]) {
                const columnConfig = filterableColumns[key];

                // Nếu cột hỗ trợ mảng các toán tử
                if (Array.isArray(columnConfig)) {
                    // Duyệt qua từng toán tử được hỗ trợ
                    for (const operator of columnConfig) {
                        if (operator === FilterOperator.ILIKE && !value.startsWith('$ilike')) {
                            processedFilters[key] = `$ilike:%${value}%`; // Thêm ký tự đại diện %
                            break;
                        }
                        if (operator === FilterOperator.LTE && !value.startsWith('$lte')) {
                            processedFilters[key] = `$lte:${value}`;
                            break;
                        }
                        if (operator === FilterOperator.GTE && !value.startsWith('$gte')) {
                            processedFilters[key] = `$gte:${value}`;
                            break;
                        }
                        if (operator === FilterOperator.EQ && !value.startsWith('$eq')) {
                            processedFilters[key] = `$eq:${value}`;
                            break;
                        }
                    }
                }
                // Nếu cột chỉ có giá trị `true` (mặc định EQ)
                else if (columnConfig === true && !value.startsWith('$eq')) {
                    processedFilters[key] = `$eq:${value}`;
                }
            }
        }

        return processedFilters;
    }
}
