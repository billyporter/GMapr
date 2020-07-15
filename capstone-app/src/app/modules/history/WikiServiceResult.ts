export interface WikiServiceResult {
  title: string,
  history: string,
  furtherReading?: Map<string, string>
  langLinks?: Map<string, Map<string, string>>
}
