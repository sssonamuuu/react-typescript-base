declare namespace IndexLessNamespace {
  export interface IIndexLess {
    attachment: string;
    attachmentInner: string;
    avatar: string;
    image: string;
    placeholder: string;
    title: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
