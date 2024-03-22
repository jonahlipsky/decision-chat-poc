export enum ConversationStatuses {
  Begin = "beginDecisionConversation",
  Continue = "continueDecisionConversation"
}

export enum Role {
  User = "User",
  Assistant = "Assistant"
}

export interface conversationContent {
  type: string,
  text: string
}

export interface structuredConversation {
  role: Role.User | Role.Assistant,
  content: conversationContent
}

export interface fullConversation {
  conversationStatus: string;
  conversation: structuredConversation[];
}

export interface completionRequest extends fullConversation {
  userMessage: string;
  test?: boolean
}