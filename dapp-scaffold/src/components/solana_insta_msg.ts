/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_insta_msg.json`.
 */
export type SolanaInstaMsg = {
  "address": "HvSWzWV5Ay76njLS4k2YbCZrJK6WnGD8QCjbQTAQQs51",
  "metadata": {
    "name": "solanaInstaMsg",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initDiscussion",
      "discriminator": [
        201,
        33,
        3,
        66,
        149,
        78,
        68,
        29
      ],
      "accounts": [
        {
          "name": "msgsender",
          "writable": true,
          "signer": true
        },
        {
          "name": "discussion",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "msgreceiver",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "sendMsg",
      "discriminator": [
        100,
        14,
        19,
        101,
        48,
        27,
        247,
        11
      ],
      "accounts": [
        {
          "name": "msgsender",
          "writable": true,
          "signer": true
        },
        {
          "name": "discussion",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "msg",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "msgManager",
      "discriminator": [
        200,
        127,
        94,
        139,
        227,
        236,
        243,
        57
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "convNotStarted",
      "msg": "Error: you can't send a message without starting a discussion !"
    },
    {
      "code": 6001,
      "name": "discussionExists",
      "msg": "Error: Discussion already initiated !"
    }
  ],
  "types": [
    {
      "name": "msgManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sender",
            "type": "pubkey"
          },
          {
            "name": "receiver",
            "type": "pubkey"
          },
          {
            "name": "sendermsgs",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "receivermsgs",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    }
  ]
};
