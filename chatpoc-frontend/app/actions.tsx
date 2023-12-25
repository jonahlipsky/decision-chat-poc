"use server";
import { IClaudeCompletion, ICompletionWithFulltext } from "@/app/types";

export async function startChat() {
  const url: URL = new URL(process.env.CHAT_API_ENDPOINT!);
  const initialPrompt = JSON.stringify({
    prompt: process.env.INITIAL_PROMPT,
  });
  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: initialPrompt,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data: IClaudeCompletion) {
      const fullText = {
        fullText: process.env.INITIAL_PROMPT + data.completion,
      };
      const fullResponse: ICompletionWithFulltext = { ...fullText, ...data };
      return fullResponse;
    });
}
