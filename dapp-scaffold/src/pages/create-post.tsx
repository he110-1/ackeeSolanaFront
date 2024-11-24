import type { NextPage } from "next";
import Head from "next/head";
import { CreatePostView } from "../views";

const CreatePost: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Instagram - New Post</title>
        <meta
          name="description"
          content="Create new post"
        />
      </Head>
      <CreatePostView />
    </div>
  );
};

export default CreatePost;
