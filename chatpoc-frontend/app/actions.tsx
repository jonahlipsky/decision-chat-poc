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

export async function getStage(){
  return process.env.VERCEL_ENV!
}
