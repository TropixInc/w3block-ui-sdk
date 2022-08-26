export interface PixwayPaginatedResponse<Item> {
  items: Array<Item>;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
