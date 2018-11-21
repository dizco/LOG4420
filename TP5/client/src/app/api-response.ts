export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public error?: any
  ) { }
}
