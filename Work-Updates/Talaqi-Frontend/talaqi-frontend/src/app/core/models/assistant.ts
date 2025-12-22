// Assistant Models
// Defines request and response structures for assistant interactions
export interface AssistantAskRequest {
  question: string;
  topK?: number;
  category?: string;
  city?: string;
  governorate?: string;
  itemType?: string;
}

// Snippet Model returned by the assistant
export interface AssistantSnippet {
  itemId: string;
  itemType: string;
  snippet: string;
  score: number;
}

// Response Model for assistant's answer
export interface AssistantAskResponse {
  isSuccess: boolean;
  data: {
    answer: string;
    snippets: AssistantSnippet[];
  };
  message: string;
  statusCode: number;
  errors: string[];
}

// Chat Message Model used in conversations with the assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  createdAt: number;
  snippets?: AssistantSnippet[];
  error?: boolean;
}
