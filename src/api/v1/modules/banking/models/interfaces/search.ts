export interface Pagination {
  limit: number;
  offset: number;
}

export interface Search {
  email?: string;
  category?: string;
  validation?: string;
  branch?: string;
  location?: string;
  room?: string;
  activity?: string;
  pagination?: Pagination;
}
