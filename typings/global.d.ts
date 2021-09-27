declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare const __ENV__: string;
declare const __MODE__: 'production' | 'development';

declare type PaginationReq<T> = {
  pageSize?: number;
  pageNum: number;
} & T;

declare type PaginationRes<T> = {
  list: T[];
  /** 总条数 */
  total: number;
  pageSize: number;
  pageNum: number;
  /** 当前页 */
  current: number;
  /** 总页数 */
  pages: number;
  /** 是否最后一页 */
  isLastPage: boolean;
};

