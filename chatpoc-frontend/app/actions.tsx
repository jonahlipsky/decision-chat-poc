"use server"

export async function getInitialPrompt(){
  return process.env.INITIAL_PROMPT!
}

export async function getApiEndpoint(){
  return process.env.CHAT_API_ENDPOINT!
}
export async function getApiKey(){
  return process.env.API_KEY!
}