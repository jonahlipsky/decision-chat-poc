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
  console.log(`RETURNING API ENDPOINT: ${process.env.CHAT_API_ENDPOINT!}`)
  console.log(`RETURNING STAGE: ${process.env.VERCEL_ENV!}`)

  return [process.env.CHAT_API_ENDPOINT!, process.env.VERCEL_ENV!]
}
