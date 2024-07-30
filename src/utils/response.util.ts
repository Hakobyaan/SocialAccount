export class ResponseUtil {
  static success(data: any, message = 'Success') {
    return {
      status: 'success',
      message,
      data,
    };
  }

  static error(message: string, statusCode: number) {
    return {
      status: 'error',
      message,
      statusCode,
    };
  }
}
