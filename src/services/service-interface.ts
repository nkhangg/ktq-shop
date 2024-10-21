export interface ServiceInterface<T, C> {
    /**
     * Create a new object.
     * @param createData Data to create the object.
     * @returns A promise that resolves to the created object.
     */
    create(createData: C): Promise<T>;

    /**
     * Retrieve all objects.
     * @returns A promise that resolves to an array of objects.
     */
    findAll(): Promise<T[]>;

    /**
     * Find an object by ID.
     * @param id The ID of the object to find.
     * @returns A promise that resolves to the found object.
     */
    findOne(id: number): Promise<T>;

    /**
     * Update an object by ID.
     * @param id The ID of the object to update.
     * @param updateData Data to update the object.
     * @returns A promise that resolves to the updated object.
     */
    update(id: number, updateData: C): Promise<T>;

    /**
     * Delete an object by ID.
     * @param id The ID of the object to delete.
     * @returns A promise that does not return any value.
     */
    delete(id: number): Promise<void>;
}
