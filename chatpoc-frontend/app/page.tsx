'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [chatHasBegun, setChatHasBegun] = useState(false)
  // console.log(process.env.CHAT_API_ENDPOINT)
  // console.log(process.env.INITIAL_PROMPT)
  const [chatBlocks, setChatBlocks] = useState([])
  const [fullChat, setFullChat] = useState(process.env.INITIAL_PROMPT)

  const url: URL = new URL(process.env.CHAT_API_ENDPOINT!)

  async function startChat(prompt:string) {
    const response = await window.fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      "prompt": process.env.INITIAL_PROMPT
    }),
  })
  }

  const handleChatStart = () => {
    setChatHasBegun(true)
    // Now we query for the initial chat, store the correct pieces in chatBlocks and fullChat
    // and then we're off and running. 
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {!chatHasBegun && <button onClick={handleChatStart}>Click to begin chat</button>}

      </div>
    </main>
  )
}
