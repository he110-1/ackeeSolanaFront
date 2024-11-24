
import { FC,useCallback } from "react";
import { useState } from 'react'
import { Program,AnchorProvider, web3, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import { SolanaInstagram } from "../../components/solana_instagram";
import idl from '../../components/solana_instagram.json';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Link from "next/link";


const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programId = new PublicKey(idl.address);

let POST_SEED = new Uint8Array(0);
export const CreatePostView: FC = ({ }) => {
  const [caption, setCaption] = useState('');
  const wallet = useWallet();
  const {connection} = useConnection();
  const PROGRAM_ID = new PublicKey("EJj7FtkP4X5iS4NbsJp4Y12eKCyybveq6cxLKgVeuYj8");

  const getProvider = () => {
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    setProvider(provider);
    return provider
  }

  const createPost = async () =>{
    try {
      const anchProvider = getProvider();
      let localval = localStorage.getItem("POST_SEED");
      if(localval == null){
        localval = "0";
      }
      POST_SEED = new Uint8Array([parseInt(localval)+1]);
      const program = new Program<SolanaInstagram>(idl_object,anchProvider);
      const [post_pkey, _bump] = PublicKey.findProgramAddressSync(
        [POST_SEED,wallet.publicKey.toBuffer()], 
        program.programId
      );
      await program.methods.createPost(POST_SEED[0], caption).accountsStrict({
        postAuthor: wallet.publicKey,
        post: post_pkey,
        systemProgram: web3.SystemProgram.programId
      }).rpc();
      alert("!!!!!!!!!!! Post Added !!!!!!!!!!!!!!!!!!" + POST_SEED)
      localStorage.setItem("POST_SEED", POST_SEED[0]+"");
      localStorage.setItem("LIST_OF_POSTS", post_pkey.toString()+";"+localStorage.getItem("LIST_OF_POSTS"));
    } catch (error) {
      console.log(error);
      console.error("Error While creating a post");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost();
    setCaption("");
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
            onChange={(e) => setCaption(e.target.value)}
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


