declare namespace IndexLessNamespace {
  export interface IIndexLess {
    cantPreviewFile: string;
    cover: string;
    ctrlBox: string;
    head: string;
    icon: string;
    image: string;
    item: string;
    leftBox: string;
    list: string;
    mousedown: string;
    rightBox: string;
    title: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
