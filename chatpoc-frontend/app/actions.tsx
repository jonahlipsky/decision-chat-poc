"use server"

import { completionRequest, ConversationStatuses } from "./types"

export async function getInitialRequest(){
  const initial: completionRequest = {
    conversationStatus: ConversationStatuses.Begin,
    conversation: [],
    userMessage: ""
  }

  return initial
}

export async function getApiEndpointAndStage(){
  return [process.env.CHAT_API_ENDPOINT!, process.env.STAGE!]
}
