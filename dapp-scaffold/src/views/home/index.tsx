// Next, React
import Image from 'next/image'

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import { FC,useCallback, useEffect } from "react";
import { useState } from 'react'
import { Program,AnchorProvider, web3, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import { SolanaInstagram } from "../../components/solana_instagram";
import idl from '../../components/solana_instagram.json';

import Link from "next/link";
import { SolanaInstaMsg } from 'components/solana_insta_msg';
import idl_msg from '../../components/solana_insta_msg.json';


const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programId = new PublicKey(idl.address);

// for msgs
const idl_msg_string = JSON.stringify(idl_msg);
const idl_msg_object = JSON.parse(idl_msg_string);
const programId_msg = new PublicKey(idl_msg.address);

export const HomeView: FC = ({ }) => {
  
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

  const getPostInfos = async () =>{
    try {
      const anchProvider = getProvider();
      const program = new Program<SolanaInstagram>(idl_object,anchProvider);
      let list_string = localStorage.getItem("LIST_OF_POSTS");
      let listPosts = list_string.split(";");
      let posts2 = []
      listPosts.forEach(async post => {
          console.log(post)
          try{
            let postinfos = await program.account.post.fetch(post);
            let exists = false
            for (let index = 0; index < posts.length; index++) {
              if(posts[index].id == postinfos.postid){
                exists = true;
                break;
              }
            }
            if(!exists)
              posts.push({
                id: postinfos.postid,
                image: "/tmpImage.jpg",
                caption: postinfos.content,
                liked: postinfos.nbrlikes > 0,
                account: post
              })
            
          }catch(error){
            console.log("Not a PDA");
          }
      });
      
      
    } catch (error) {
      console.log(error);
      console.error("Error While creating a post");
    }
  }
  useEffect(() => {
    getPostInfos(); // Run the function when the component is mounted
  }, []);
  
  const handleLike = async (postId: number) => {
    /*setPosts(posts.map(post => 
      post.id === postId ? { ...post, liked: !post.liked } : post
    ))*/
    
    const anchProvider = getProvider();
    const program = new Program<SolanaInstagram>(idl_object,anchProvider);
    for (let i = 0; i < posts.length; i++) {
      if(posts[i].id == postId){
        if(posts[i].liked == false){
          await program.methods.likepost().accounts({
            user: wallet.publicKey,
            post: posts[i].account
          }).rpc();
          console.log("Post successfuly liked !!!")
        }else{
          await program.methods.dislikepost().accounts({
            user: wallet.publicKey,
            post: posts[i].account,
          }).rpc();
          console.log("Post successfuly disliked !!!")
        }
      }
    }
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, liked: !post.liked } : post
    ))
  }

  const handleDelete = async (postId: number) => {
    const anchProvider = getProvider();
    const program = new Program<SolanaInstagram>(idl_object,anchProvider);
  
    let post_seed_tmp = new Uint8Array([postId]);
    const [post_pkey, _bump] = PublicKey.findProgramAddressSync(
      [post_seed_tmp,wallet.publicKey.toBuffer()], 
      program.programId
    );
    await program.methods.removePost().accounts({
      postAuthor: wallet.publicKey,
      post: post_pkey,
    }).rpc();
    console.log("Post was successfuly deleted")
    for (let i = 0; i < posts.length; i++) {
      if(posts[i].id == postId){
        localStorage.setItem("LIST_OF_POSTS",localStorage.getItem("LIST_OF_POSTS").replace(posts[i].account+";",""))
      }
    }
    setPosts(posts.filter(post => post.id !== postId))
  }
  
  const handleTransfer = async (postAccount) => {
    let newMessage = postAccount
    if (newMessage.trim()) {
      // step 1: try to start a conversation if it is already started go to step 2
      const anchProvider = getProvider();
      const programMsg = new Program<SolanaInstaMsg>(idl_msg_object,anchProvider);
    
      let localval = localStorage.getItem("MSG_SEED");
      if(localval == null){
        localval = "0";
      }
      let MSG_SEED = new Uint8Array(0);
      MSG_SEED = new Uint8Array([parseInt(localval)+1]);
      let alice = new PublicKey("9WoG1SgfPvspD6FSXC6m7q7gtcBhzDxc88iuSjjUgMNp"); // for now its the only user you can talk to
      const [discussion_pkey, _bump] = PublicKey.findProgramAddressSync([
        ,
        wallet.publicKey.toBuffer(),
        alice.toBuffer()
      ],programMsg.programId);
      try{
        const tx = await programMsg.methods.initDiscussion(alice).accounts({
          msgsender: wallet.publicKey,
          discussion: discussion_pkey,
          systemProgram: web3.SystemProgram.programId
        }).rpc();
      }catch(error){
        console.log(error)
        console.log("The discussion is already initiated")
      }
      // step 2: send the message
      const tx = await programMsg.methods.sendMsg(newMessage).accounts({
        msgsender: wallet.publicKey,
        discussion: discussion_pkey,
        systemProgram: web3.SystemProgram.programId
      }).rpc();

      // step 3: make changes to the interface
      localStorage.setItem("MSG_SEED",MSG_SEED[0]+1+"")
      localStorage.setItem("DISCUSSION_ACCOUNT",discussion_pkey.toString());
      alert("msg sent !!!!!!!!!!!!!")
    }
  }


  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          Solana Instagram
        </h1>
        </div>

        <div className="w-full max-w-md">
          {posts.map(post => (
            <div key={post.id} className="border border-slate-700 rounded-lg mb-6 p-4">
              <Image src={post.image} alt="Post image" width={300} height={300} className="w-full h-auto rounded-lg" />
              <p className="mt-2 text-slate-300">{post.caption}</p>
              <div className="flex justify-between items-center mt-4">
                <button 
                  className={`text-2xl ${post.liked ? 'text-red-500' : 'text-slate-400'}`}
                  onClick={() => handleLike(post.id)}
                >
                  ❤
                </button>
                <button 
                  className={`text-2xl text-slate-400`}
                  onClick={(e) => { handleTransfer(post.account)}
                  }
                >
                  ➤
                </button>
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
