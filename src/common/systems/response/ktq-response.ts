import { plainToClass } from 'class-transformer';
import { Paginated } from 'nestjs-paginate';

export default class KtqResponse {
    public static toResponse(data: any, options?: { message?: string; status_code?: number; bonus?: any }) {
        return {
            message: options?.message || 'Success',
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
}
