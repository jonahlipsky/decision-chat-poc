"use server";
import { IClaudeCompletion, ICompletionWithFulltext } from "@/app/types";

export async function startChat() {
  return await continueChat(process.env.INITIAL_PROMPT!);
}

export async function continueChat(prompt: string) {
  const url: URL = new URL(process.env.CHAT_API_ENDPOINT!);
  const modelPrompt = JSON.stringify({
    prompt: prompt + "\n\nAssistant:",
  });
  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
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
