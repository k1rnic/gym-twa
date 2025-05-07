import { Endpoints } from './endpoints';

export const Api = new Endpoints({ baseURL: import.meta.env.APP_API_BASE_URL });
