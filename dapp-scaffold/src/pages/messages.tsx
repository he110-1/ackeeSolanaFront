import type { NextPage } from "next";
import Head from "next/head";
import { ChatView } from "../views";

const Messages: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Instagram Chat</title>
        <meta
          name="description"
          content="Chat"
        />
      </Head>
      <ChatView />
    </div>
  );
};

export default Messages;
