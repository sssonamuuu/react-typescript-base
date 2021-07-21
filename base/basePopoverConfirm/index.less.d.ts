declare namespace IndexLessNamespace {
  export interface IIndexLess {
    content: string;
    ctrl: string;
    file: string;
    mappings: string;
    names: string;
    popover: string;
    sources: string;
    sourcesContent: string;
    title: string;
    version: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
