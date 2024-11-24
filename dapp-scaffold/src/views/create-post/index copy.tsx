
import { FC,useEffect } from "react";
import { useState } from 'react'
import { Connection, /*PublicKey,*/ LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
/*import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { Program, AnchorProvider, web3, Idl, setProvider } from '@project-serum/anchor';
import Link from 'next/link'
import type { SolanaInstagram } from "../../components/solana_instagram";
import idl from '../../components/solana_instagram.json';*/

import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import { SolanaInstagram } from "../../components/solana_instagram";
import idl from '../../components/solana_instagram.json';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Link from "next/link";

/*const [caption, setCaption] = useState('te')
    setCaption("test");*/
    const caption = "test"
    let POST_SEED = new Uint8Array(0);


export const CreatePostView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const PROGRAM_ID = new web3.PublicKey("EJj7FtkP4X5iS4NbsJp4Y12eKCyybveq6cxLKgVeuYj8");

  /*const createPost = async () => {



  /*useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      console.log("Hi this is a test")
    }
  }, [wallet.publicKey, connection])*/

  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });
    //anchor.setProvider(provider);
    
    /*const program = new Program(idl as SolanaInstagram, {
      connection
    });*/
    const program = new Program(idl, PROGRAM_ID, provider);
    if (!wallet.publicKey) {
      console.error('Wallet not connected');
      return;
    }
    console.log("test 1");

    //const program = anchor.workspace.SolanaInstagram as Program<SolanaInstagram>;

    




    //type SolanaInstagramProgram = Program<typeof idl>;
    try {
      console.log("test 3");
      // Generate a unique key for the post (example using timestamp)
      const [postPDA] = await web3.PublicKey.findProgramAddressSync(
        [Buffer.from('post'), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );
      console.log("test 4");
      // Call createPost function on the program

      POST_SEED = new Uint8Array([POST_SEED[0]+1]);
      const [post_pkey, _bump] = anchor.web3.PublicKey.findProgramAddressSync([POST_SEED,wallet.publicKey.toBuffer()], program.programId);
      const tx = await program.methods.createPost(POST_SEED[0], "Post 1").accounts({
        postAuthor: wallet.publicKey,
        post: post_pkey,
        systemProgram: anchor.web3.SystemProgram.programId
      }).rpc();

      /*await program.methods
        .createPost(caption) // Pass the caption to the createPost function
        .accounts({
          post: postPDA,
          postAuthor: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();*/
        console.log("test 5");
      console.log('Post created successfully! '+ tx);
    } catch (error) {
      console.error('Error creating post:', error);
    }*/
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost();
    //setCaption("test");
  };

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Create new post
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="relative group items-center">
          <input 
            type="file" 
            accept="image/*" 
            className="mb-4"
          />
          <textarea
            value={caption}
            onChange={(e) => /*setCaption(e.target.value)*/"test"}
            placeholder="Write a caption..."
            className="mb-4 w-full min-h-[100px] p-3 text-slate-900 bg-slate-100 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y transition duration-200 ease-in-out placeholder-slate-400"
          />
          </div>
          <div className="relative group items-center">
          <button type="submit" className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black">Create Post</button>
          </div>
        </form>
        <Link href="/" className="mt-4 text-indigo-500 hover:text-indigo-600">
          Back to Posts
        </Link>
      </div>
    </div>
  );
};
