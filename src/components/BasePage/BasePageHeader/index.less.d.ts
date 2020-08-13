declare namespace IndexLessNamespace {
  export interface IIndexLess {
    file: string;
    fixed: string;
    header: string;
    mappings: string;
    names: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
