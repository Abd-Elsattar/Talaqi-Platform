// ApiResponse Model

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string | null;
  errors: string[] | null;
  data: T;
}
