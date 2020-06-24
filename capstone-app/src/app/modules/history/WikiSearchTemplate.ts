export interface WikiSearchResult{
  parse: MapResult;
}
export interface MapResult{
  title: string;
  text: TextResult;
}
export interface TextResult{
  "*": string;
}
