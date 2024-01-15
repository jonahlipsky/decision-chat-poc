"use client";
import { useEffect, useState } from "react";
import { startChat, continueChat } from "./utilities";
import { ICompletionWithFulltext } from "@/app/types";

export default function Home() {
  const defaultAllTextState: string[] = [
    "Enter your own text here to talk to Claude 2:",
  ];

  const [errorMessage, setErrorMessage] = useState("");
  const [fullConversation, setFullConversation] = useState("");
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

  function splitConversation(fullText: string): string[] {
    // This relies on the first human prompt not including the \n\n pattern.
    // That makes it a little brittle.

    const pairs = fullText.split("\n\nHuman:");
    const result: string[] = [];
    // need to handle the first one which won't split on the sequence

    pairs.forEach((pair, idx) => {
      // Basically, only change "human" to "system prompt"
      // if they've selected the decision chat.
      if (idx == 0 && chatState == DECISIONSTATE) {
        pair = pair.replace("Human:", "System Prompt:");
      } else if (idx != 0) {
        pair = "Human:" + pair;
      }

      const separatedReqResp = pair.split("\n\nAssistant:");
      result.push(separatedReqResp[0]);
      result.push("Assistant:" + separatedReqResp[1]);
    });
    return result;
  }

  async function startDecisionChat() {
    setChatState(DECISIONSTATE);
    startChat().then(function (response: ICompletionWithFulltext) {
      const splitFulltext = splitConversation(response.fullText);
      setAllText([...splitFulltext]);
      setFullConversation(response.fullText);
    });
  }

  useEffect(() => {
    if (status == "submitted") {
      setStatus("submitting");
      let humanPrefix: string = "\n\nHuman: ";
      if (chatState === WAITINGSTATE) {
        humanPrefix = "Human: ";
        setChatState(FREECHATSTATE);
      }
      const nextPrompt = fullConversation + humanPrefix + userInput;
      continueChat(nextPrompt).then(function (
        response: ICompletionWithFulltext
      ) {
        if (response.message) {
          setErrorMessage(response.message);
          setStatus("error");
        } else {
          const splitFulltext = splitConversation(response.fullText);
          setUserInput("");
          setAllText([...splitFulltext]);
          setFullConversation(response.fullText);
          setStatus("typing");
        }
      });
    }
  }, [status]);
  return (
    <div className="grid grid-cols-2 gap-4">
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
