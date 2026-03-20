export const getPagination = (page, limit, maxLimit = 100) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), maxLimit);
    const skip = (currentPage - 1) * perPage;
    return {
        page: currentPage,
        limit: perPage,
        skip,
    };
};
