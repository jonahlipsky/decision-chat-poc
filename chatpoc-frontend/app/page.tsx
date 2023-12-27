import Link from "next/link";

export default function Home() {
  return <div>
    <p className="mb-5">This is an experimental A.I. chat application that provides feedback on life decisions. It leverages the Claude 2 model published by Anthropic AI. It is not intended to give you advice so much as to present a reflection of what you give it. To that end, it&apos;s more interesting if you give it information about a real decision you are trying to make;  then you can judge for yourself the quality of its response.</p>
    <Link className="border border-cyan-300 p-1 rounded-md text-cyan-300" href="/chat">Click to start chat</Link>
  </div>
}
