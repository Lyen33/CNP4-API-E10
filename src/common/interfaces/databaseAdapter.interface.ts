// interfaces/database.interface.ts
export interface DatabaseAdapter<T> {
  findAll(
    query: Record<string, any>,
    page: number,
    per_page: number,
    baseUrl: string
  ): Promise<{
    count: number;
    total_pages: number;
    page: number;
    per_page: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }>;

  find(query: Record<string, any>): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(query: Record<string, any>, data: Partial<T>): Promise<T>;
  delete(query: Record<string, any>): Promise<void>;
}
