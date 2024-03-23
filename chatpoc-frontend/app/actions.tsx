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
  console.log(`RETURNING ENDPOINT: ${process.env.CHAT_ENDPOINT!}`)
  console.log(`RETURNING STAGE: ${process.env.VERCEL_ENV!}`)

  return [process.env.CHAT_ENDPOINT!, process.env.VERCEL_ENV!]
}
