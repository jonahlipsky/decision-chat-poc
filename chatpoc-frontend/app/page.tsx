"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { startChat, continueChat } from "./utilities";
import { ICompletionWithFulltext } from "@/app/types";
import { getInitialPrompt } from "./actions";


export default function Home() {
  const defaultAllTextState: string[] = ["Loading..."];

  const [errorMessage, setErrorMessage] = useState("");
  const [fullConversation, setFullConversation] = useState("");
  const [alltext, setAllText] = useState(defaultAllTextState);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("typing"); // typing, submitted, submitting, error
  const [decisionChat, setDecisionChat] = useState(false)

  function handleSubmitResponse(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (userInput.length > 0) {
      setErrorMessage("");
      setStatus("submitted");
    }
  }

  function splitConversation(fullText: string): string[] {
    const pairs = fullText.split("\n\nHuman:");
    const result: string[] = [];
    // need to handle the first one which won't split on the sequence
    pairs.forEach((pair, idx) => {
      if (idx == 0) {
        pair = pair.replace("Human:", "System Prompt:")
      } else {
        pair = "Human:" + pair;
      }
      const separatedReqResp = pair.split("\n\nAssistant:");
      result.push(separatedReqResp[0]);
      result.push("Assistant:" + separatedReqResp[1]);
    });
    return result;
  }

  // useEffect(() => {
  //   startChat().then(function (response: ICompletionWithFulltext) {
  //     const splitFulltext = splitConversation(response.fullText);
  //     setAllText([...splitFulltext]);
  //     setFullConversation(response.fullText);
  //   });
  // }, []);

  async function startNewChat(){
    setDecisionChat(true)
    startChat().then(function (response: ICompletionWithFulltext) {
      const splitFulltext = splitConversation(response.fullText);
      setAllText([...splitFulltext]);
      setFullConversation(response.fullText);
    });
  }

  useEffect(() => {
    if (status == "submitted") {
      setStatus("submitting");
      const nextPrompt = fullConversation + "\n\nHuman: " + userInput;
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
  return <><div>
    <p className="mb-5">This is an experimental A.I. chat application that provides feedback on life decisions. It leverages the Claude 2 model published by Anthropic AI. It is not intended to give you advice so much as to present a reflection of what you give it. To that end, it&apos;s more interesting if you give it information about a real decision you are trying to make;  then you can judge for yourself the quality of its response. Click the following button to start a chat about decision making or start your own by entering text to the right and hitting 'submit'.</p>
    <button disabled={decisionChat} className="border border-cyan-300 p-1 rounded-md text-cyan-300" onClick={startNewChat}>Chat About Decisions</button>
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
  </>
}
