"use client";
import { completionRequest, fullConversation } from "@/app/types";
import { getApiEndpointAndStage, getInitialRequest } from "./actions";


export async function startChat() {
  const initialPrompt: completionRequest = await getInitialRequest();
  return await continueChat(initialPrompt);
}

export async function continueChat(completionRequest: completionRequest) {
  const [apiUrl, stage] = await getApiEndpointAndStage();
  console.log(`apiUrl: ${apiUrl}`)
  console.log(`stage: ${stage}`)
  if (stage == "development") {
    completionRequest.test = true
  }
  const url: URL = new URL(apiUrl);
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
