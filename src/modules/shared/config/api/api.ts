import axios, { AxiosAdapter, AxiosRequestConfig } from 'axios';
import http from 'http';
import https from 'https';
import jwtDecode from 'jwt-decode';
//import agent from 'agent-base';

import { Roles } from '../../enums/Roles';

export interface JwtInterface {
  sub: string;
  email: string;
  name: string;
  roles: Array<Roles>;
  verified: boolean;
  iat: number;
  exp: number;
}

export const validateJwtToken = (token: string) => {
  const decodedJwt = jwtDecode<JwtInterface>(token);
  return decodedJwt.exp * 1000 > Date.now();
};

const createTropixAxiosInstance = (baseURL: string) =>
  axios.create({
    baseURL,
    /*
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
    */
  });

export const getPublicAPI = createTropixAxiosInstance;

export const getSecureApi = (token: string, baseURL: string) => {
  const instance = createTropixAxiosInstance(baseURL);
  instance.interceptors.request.use((axiosRequest: AxiosRequestConfig) => {
    if (token) {
      if (!validateJwtToken(token)) {
        throw new Error('Token expired');
      }
      const headers = axiosRequest.headers ? axiosRequest.headers : {};
      axiosRequest.headers = { ...headers, Authorization: `Bearer ${token}` };
    }
    return axiosRequest;
  });
  return instance;
};
