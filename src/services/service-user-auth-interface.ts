export interface ServiceUserAuthInterface<M> {
    findByEmail(email: string): Promise<M>;

    findByUsername(username: string): Promise<M>;
}
