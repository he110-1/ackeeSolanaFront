
// Next, React
import Image from 'next/image'

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import React, { FC,useCallback, useEffect } from "react";
import { useState } from 'react'
import { Program,AnchorProvider, web3, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import { SolanaInstaMsg } from "../../components/solana_insta_msg";
import idl from '../../components/solana_insta_msg.json';

import Link from "next/link";

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programId = new PublicKey(idl.address);
let MSG_SEED = new Uint8Array(0);

export const ChatView: FC = ({ }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you?", sent: false },
    { id: 2, text: "Hi there! I'm doing great, thanks for asking.", sent: true },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [posts, setPosts] = useState([
  ])
  

  const wallet = useWallet();
  const {connection} = useConnection();
  const PROGRAM_ID = new PublicKey("EJj7FtkP4X5iS4NbsJp4Y12eKCyybveq6cxLKgVeuYj8");

  const getProvider = () => {
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    setProvider(provider);
    return provider
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // step 1: try to start a conversation if it is already started go to step 2
      const anchProvider = getProvider();
      const program = new Program<SolanaInstaMsg>(idl_object,anchProvider);
    
      let localval = localStorage.getItem("MSG_SEED");
      if(localval == null){
        localval = "0";
      }
      MSG_SEED = new Uint8Array([parseInt(localval)+1]);
      let alice = new PublicKey("9WoG1SgfPvspD6FSXC6m7q7gtcBhzDxc88iuSjjUgMNp"); // for now its the only user you can talk to
      const [discussion_pkey, _bump] = PublicKey.findProgramAddressSync([
        ,
        wallet.publicKey.toBuffer(),
        alice.toBuffer()
      ],program.programId);
      try{
        const tx = await program.methods.initDiscussion(alice).accounts({
          msgsender: wallet.publicKey,
          discussion: discussion_pkey,
          systemProgram: web3.SystemProgram.programId
        }).rpc();
      }catch(error){
        console.log(error)
        console.log("The discussion is already initiated")
      }
      // step 2: send the message
      const tx = await program.methods.sendMsg(newMessage).accounts({
        msgsender: wallet.publicKey,
        discussion: discussion_pkey,
        systemProgram: web3.SystemProgram.programId
      }).rpc();

      // step 3: make changes to the interface
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sent: true }])
      setNewMessage('')
      localStorage.setItem("MSG_SEED",MSG_SEED[0]+1+"")
      localStorage.setItem("DISCUSSION_ACCOUNT",discussion_pkey.toString());
      console.log("msg sent !!!!!!!!!!!!!")
    }
  }

  useEffect(() => {
    handleListMsgs(); // Run the function when the component is mounted
  }, []);

  const handleListMsgs = async () =>{
    // TODO: get the list of msgs from solana and list them here no problem for the timeline of the msgs
    // this functionality should also be trigered each time a new message is sent 
    const discussion_account = localStorage.getItem("DISCUSSION_ACCOUNT");
    if (discussion_account == null){
      return
    }
    const anchProvider = getProvider();
    const program = new Program<SolanaInstaMsg>(idl_object,anchProvider);
    let discussion = await program.account.msgManager.fetch(discussion_account);
    let listMsgs = [{ id: 1, text: "Hello! How are you?", sent: false },] // this is a design msg
    for (let i = 0; i < discussion.sendermsgs.length; i++) {
      console.log(discussion.receivermsgs[i])
      if(discussion.sendermsgs[i] == undefined ) continue
      listMsgs.push({
        id: i,
        text: discussion.sendermsgs[i],
        sent: true,
      });
    }
    for (let i = 0; i < discussion.sendermsgs.length; i++) {
      if(discussion.receivermsgs[i] == undefined ) continue
      listMsgs.push({
        id: i,
        text: discussion.receivermsgs[i],
        sent: false,
      });
    }
    setMessages(listMsgs)
  }
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          Messages
        </h1>
        <div className="w-full max-w-md border border-slate-700 rounded-lg p-4 mb-4 h-80 overflow-y-auto">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-2 p-2 rounded-lg ${
                message.sent 
                  ? 'bg-indigo-500 text-white ml-auto' 
                  : 'bg-slate-700 text-slate-200'
              } max-w-[80%]`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="w-full max-w-md flex">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-slate-100 text-slate-900 placeholder-slate-400 border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-full py-2 px-4"
          />
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full transition duration-200 ease-in-out">Send</button>
        </form>
        <Link href="/" className="mt-4 text-indigo-500 hover:text-indigo-600">
          Back to Posts
        </Link>
      </div>
    </div>
  );
};
