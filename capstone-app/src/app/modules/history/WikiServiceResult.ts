export interface WikiServiceResult {
  title: string,
  history: string,
  furtherReading?: Map<string, string>
  langlinks?: Map<string, Map<string, string>>
}
