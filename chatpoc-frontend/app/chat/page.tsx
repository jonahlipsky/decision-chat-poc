"use client";

import { useEffect, useState } from "react";
import { startChat, continueChat } from "../actions";
import { ICompletionWithFulltext } from "@/app/types";

export default function Chat() {
  const defaultAllTextState: string[] = ["Loading..."];

  const [errorMessage, setErrorMessage] = useState("");
  const [fullConversation, setFullConversation] = useState("");
  const [alltext, setAllText] = useState(defaultAllTextState);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("typing"); // typing, submitted, submitting, error

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
      if (idx != 0) {
        pair = "Human:" + pair;
      }
      const separatedReqResp = pair.split("\n\nAssistant:");
      result.push(separatedReqResp[0]);
      result.push("Assistant:" + separatedReqResp[1]);
    });
    return result;
  }

  useEffect(() => {
    startChat().then(function (response: ICompletionWithFulltext) {
      const splitFulltext = splitConversation(response.fullText);
      setAllText([...splitFulltext]);
      setFullConversation(response.fullText);
    });
  }, []);

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

  return (
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
      <div>
        <textarea
          className="text-black"
          disabled={status === "submitted" || status === "submitting"}
          value={userInput}
          onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setUserInput(ev.target.value)
          }
        />
        <button
          disabled={status === "submitted" || status === "submitting"}
          onClick={handleSubmitResponse}
        >
          Submit Response
        </button>
      </div>
    </div>
  );
}
