export interface ChatMessage {
  _id?: string;
  author: string;
  text: string;
  timestamp: string;
  isImage?: boolean;
}
