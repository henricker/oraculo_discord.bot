export interface ITextChannel {
  name: string
  send(text: string): Promise<void>
}
