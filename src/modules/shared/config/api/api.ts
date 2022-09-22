import { UserRoleEnum } from '@w3block/sdk-id';
import axios, { AxiosRequestConfig } from 'axios';
import jwtDecode from 'jwt-decode';

export interface JwtInterface {
  sub: string;
  email: string;
  name: string;
  roles: Array<UserRoleEnum>;
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
