"use client";
import { IClaudeCompletion, ICompletionWithFulltext } from "@/app/types";
import { getInitialPrompt, getApiEndpoint } from "./actions";

export async function startChat() {
  const initialPrompt = await getInitialPrompt();
  return await continueChat(initialPrompt);
}

export async function continueChat(prompt: string) {
  const apiUrl = await getApiEndpoint();
  const url: URL = new URL(apiUrl);
  const modelPrompt = JSON.stringify({
    prompt: prompt + "\n\nAssistant:",
  });
  
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: modelPrompt,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data: IClaudeCompletion) {
      if (data.stop_reason && data.stop_reason != "stop_sequence") {
        const fullErrorResponse: ICompletionWithFulltext = {
          fullText: prompt,
          ...data,
        };
        fullErrorResponse.message = data.stop_reason;
        return fullErrorResponse;
      }

      const fullText = {
        fullText: prompt + "\n\nAssistant:" + data.completion,
      };

      const fullResponse: ICompletionWithFulltext = { ...fullText, ...data };
      return fullResponse;
    });
}
