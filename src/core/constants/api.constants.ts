export class ApiConstants {
  static DEBUG = process.env.DEBUG === 'true';
  static SANDBOX = false;

  static MONGOOSETLSCERT = !(process.env.MONGOOSETLSCERT === 'false');

  static excludedEndpoints = ['/swagger/', '/auth/token', '/healthcheck'];
}
