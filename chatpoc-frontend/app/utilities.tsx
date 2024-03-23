"use client";
import { completionRequest, fullConversation } from "@/app/types";
import { getStage, getInitialRequest } from "./actions";


export async function startChat() {
  const initialPrompt: completionRequest = await getInitialRequest();
  return await continueChat(initialPrompt);
}

export async function continueChat(completionRequest: completionRequest) {
  const stage = await getStage();
  if (stage == "development") {
    completionRequest.test = true
  }
  const url: URL = new URL("https://b9u3m6pnec.execute-api.us-east-1.amazonaws.com/test/haikupoc");
  const promptBody = JSON.stringify(completionRequest);
  
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: promptBody,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data: fullConversation) {
      return data;
    });
}
