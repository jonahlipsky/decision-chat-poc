export interface IClaudeCompletion {
  completion: string;
  stop: string;
  stop_reason: string;
  message?: string;
}

export interface ICompletionWithFulltext extends IClaudeCompletion {
  fullText: string;
}
