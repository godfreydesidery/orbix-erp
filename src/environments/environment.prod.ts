import { EPROTO } from "constants";
declare var apiUrl: any;
export const environment = {
  production: true,
  projectName : "Orbix ERP",
  //apiUrl: 'http://127.0.0.1:8080/api'
  apiUrl : apiUrl.getApiUrl()
};
