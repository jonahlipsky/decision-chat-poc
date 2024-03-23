"use client";
import { useEffect, useState } from "react";
import { startChat, continueChat } from "./utilities";
import {
  ConversationStatuses,
  fullConversation,
  completionRequest,
} from "@/app/types";

export default function Home() {
  const defaultAllTextState: string[] = [
    "Enter your own text here to talk to Claude 3:",
  ];

  const defaultConversation: fullConversation = {
    conversationStatus: ConversationStatuses.Begin,
    conversation: [],
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [conversationState, setConversationState] =
    useState(defaultConversation);
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
    const text: string[] = [];

    fullConvo.conversation.forEach((dialogue) => {
      const capitalizedRole =
        dialogue.role[0].toUpperCase() + dialogue.role.slice(1);
      const line: string = capitalizedRole + ": " + dialogue.content[0].text;
      text.push(line);
    });

    return text;
  }

  async function startDecisionChat() {
    setChatState(DECISIONSTATE);
    startChat().then(function (response: fullConversation) {
      setConversationState(response);
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
        conversationStatus: conversationState.conversationStatus,
      };

      continueChat(completionReq).then(function (response: fullConversation) {
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
          on life decisions. It leverages the &quot;Claude 3 Haiku&quot; model published
          by Anthropic AI. It is based on the creator&apos;s college thesis which
          focused on decision making and life choices. The thesis is used as a
          baseline input into the model, which is guided to use &quot;the text&quot; as
          the theory that it gives you feedback with. The paper focused on
          Prospect Theory, a cognitive psychology theory that gave birth to the
          field of Behavioral Economics. If a Prospect Theory concept is
          mentioned and you want more of an explanation, ask about it! The only
          other guidance is that the model prompt is geared towards personal
          life choices, which was the focal point of the paper. Presenting a
          hypothetical or real life choice will yield the intended results of
          this experiment. Click the following button to start a chat about
          decision making! You can refresh the page to reset.
        </p>
        <button
          hidden={chatState != WAITINGSTATE}
          className="border border-black p-1 rounded-md "
          onClick={startDecisionChat}
        >
          Chat About Decisions
        </button>
      </div>
      <div>
        {alltext.map((text, id) => {
          let color = id % 2 == 0 ? "black" : "text-cyan-500";
          if (chatState == WAITINGSTATE){
            color = "black"
          }
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
          className="border rounded-md border-black p-1"
          disabled={status === "submitted" || status === "submitting"}
          onClick={handleSubmitResponse}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
