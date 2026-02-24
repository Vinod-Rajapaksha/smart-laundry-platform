export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (
  page?: string | number,
  limit?: string | number,
  maxLimit = 100
): PaginationOptions => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 10, 1), maxLimit);

  const skip = (currentPage - 1) * perPage;

  return {
    page: currentPage,
    limit: perPage,
    skip,
  };
};