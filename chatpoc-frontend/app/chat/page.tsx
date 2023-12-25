"use client";

import { useEffect, useState } from "react";
import { startChat } from "../actions";
import { ICompletionWithFulltext } from "@/app/types";

export default function Chat() {
  const [convo, setConvo] = useState("Loading...");
  useEffect(() => {
    startChat().then(function (response: ICompletionWithFulltext) {
      setConvo(response.completion);
    });
  }, []);
  return <p>{convo}</p>;
}
