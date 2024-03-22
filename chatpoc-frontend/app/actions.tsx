"use server"

import { completionRequest, ConversationStatuses } from "./types"

export async function getInitialRequest(){
  const initial: completionRequest = {
    conversationStatus: ConversationStatuses.Begin,
    conversation: [],
    userMessage: ""
  }

  if (process.env.STAGE! == "dev") {
    initial.test = true
  }
  return initial
}

export async function getApiEndpoint(){
  return process.env.CHAT_API_ENDPOINT!
}
