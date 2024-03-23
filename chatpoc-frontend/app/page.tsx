"use client";
import { useEffect, useState } from "react";
import { startChat, continueChat } from "./utilities";
import { ConversationStatuses, fullConversation, completionRequest } from "@/app/types";

export default function Home() {
  const defaultAllTextState: string[] = [
    "Enter your own text here to talk to Claude 2:",
  ];

  const defaultConversation: fullConversation = {
    conversationStatus: ConversationStatuses.Begin,
    conversation: [],
  }

  const [errorMessage, setErrorMessage] = useState("");
  const [conversationState, setConversationState] = useState(defaultConversation)
  const [alltext, setAllText] = useState(defaultAllTextState);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("typing"); // typing, submitted, submitting, error

  const DECISIONSTATE: string = "decision-chat";
  const WAITINGSTATE: string = "waiting";
  const FREECHATSTATE: string = "free-chat";
  const [chatState, setChatState] = useState(WAITINGSTATE); // waiting, free-chat, decision-chat

  function handleSubmitResponse(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (userInput.length > 0) {
      setErrorMessage("");
      setStatus("submitted");
    }
  }

  function extractConversationText(fullConvo: fullConversation): string[] {
    const text: string[] = []
    
    fullConvo.conversation.forEach(dialogue => {
      const capitalizedRole = dialogue.role[0].toUpperCase() + dialogue.role.slice(1)
      const line: string = capitalizedRole + ": " + dialogue.content[0].text
      text.push(line)
    })

    return text
  }

  async function startDecisionChat() {
    setChatState(DECISIONSTATE);
    startChat().then(function (response: fullConversation) {
      setConversationState(response)
      const splitFulltext = extractConversationText(response);
      setAllText([...splitFulltext]);
    });
  }

  useEffect(() => {
    if (status == "submitted") {
      setStatus("submitting");
      if (chatState === WAITINGSTATE) {
        setChatState(FREECHATSTATE);
      }

      const completionReq: completionRequest = {
        userMessage: userInput,
        conversation: conversationState.conversation,
        conversationStatus: conversationState.conversationStatus
      }

      continueChat(completionReq).then(function (
        response: fullConversation
      ) {
        // if (response.message) {
        //   setErrorMessage(response.message);
        //   setStatus("error");
        // } else {
        setConversationState(response);
        const splitFulltext = extractConversationText(response);
        setUserInput("");
        setAllText([...splitFulltext]);
        setStatus("typing");
      });
    }
  }, [status]);
  return (
    <div className="not-small:grid not-small:grid-cols-2 not-small:gap-4">
      <div>
        <p className="mb-5">
          This is an experimental A.I. chat application that provides feedback
          on life decisions. It leverages the Claude 2 model published by
          Anthropic AI. It is not intended to give you advice so much as to
          present a reflection of what you give it. To that end, it&apos;s more
          interesting if you give it information about a real decision you are
          trying to make; then you can judge for yourself the quality of its
          response. Click the following button to start a chat about decision
          making or start your own by entering text to the right and hitting
          &apos;submit&apos;. You can refresh the page to reset.
        </p>
        <button
          hidden={chatState != WAITINGSTATE}
          className="border border-cyan-300 p-1 rounded-md text-cyan-300"
          onClick={startDecisionChat}
        >
          Chat About Decisions
        </button>
      </div>
      <div>
        {alltext.map((text, id) => {
          const color = id % 2 == 0 ? "text-cyan-300" : "text-rose-300";
          return (
            <p className={"mb-5 " + color} key={id}>
              {text}
            </p>
          );
        })}
        {status === "error" && (
          <p className="text-red-500 mb-5">{errorMessage}</p>
        )}
        <textarea
          className="text-black w-full mb-5 rounded-md p-1"
          disabled={status === "submitted" || status === "submitting"}
          placeholder="Your response here..."
          value={userInput}
          onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setUserInput(ev.target.value)
          }
        />
        <button
          className="border rounded-md border-white p-1"
          disabled={status === "submitted" || status === "submitting"}
          onClick={handleSubmitResponse}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
