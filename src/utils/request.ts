import axios, { AxiosRequestConfig } from 'axios';

interface RequestOption extends AxiosRequestConfig {

}

export default function request <T> (option: RequestOption) {
  return axios.request<T>(option);
}
