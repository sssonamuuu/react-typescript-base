declare namespace IndexLessNamespace {
  export interface IIndexLess {
    avatar: string;
    img: string;
    picture: string;
    placeholder: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
