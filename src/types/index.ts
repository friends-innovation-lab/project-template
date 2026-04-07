// Shared application types
// Add project-specific types here as the project grows

export type Status = "idle" | "loading" | "success" | "error";

export type AsyncState<T> = {
  data: T | null;
  status: Status;
  error: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
