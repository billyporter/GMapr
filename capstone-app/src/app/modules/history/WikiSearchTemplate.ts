export interface WikiSearchResult {
  parse: MapResult;
}
export interface MapResult {
  title: string;
  text: TextResult;
  langlinks: LanguageLinks;
}
export interface TextResult {
  "*": string;
}
export interface LanguageLinks {
  lang: string;
  url: string;
  langname: string;
  "*": string;
}
