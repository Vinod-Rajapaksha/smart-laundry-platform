export const feedbackEndpoints = {
  list: "/feedback",
  stats: "/feedback/stats",
  byId: (id: string) => `/feedback/${id}`,
  updateStatus: (id: string) => `/feedback/${id}/status`,
} as const;