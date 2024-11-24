/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_instagram.json`.
 */
export type SolanaInstagram = {
  "address": "EJj7FtkP4X5iS4NbsJp4Y12eKCyybveq6cxLKgVeuYj8",
  "metadata": {
    "name": "solanaInstagram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPost",
      "discriminator": [
        169,
        32,
        103,
        230,
        206,
        60,
        66,
        247
      ],
      "accounts": [
        {
          "name": "postAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postid",
          "type": "u8"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "dislikepost",
      "discriminator": [
        248,
        71,
        144,
        16,
        91,
        221,
        222,
        212
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "likepost",
      "discriminator": [
        137,
        14,
        145,
        30,
        61,
        225,
        242,
        188
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "removePost",
      "discriminator": [
        103,
        105,
        227,
        79,
        190,
        198,
        25,
        90
      ],
      "accounts": [
        {
          "name": "postAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "transferPost",
      "discriminator": [
        128,
        247,
        104,
        245,
        130,
        200,
        180,
        216
      ],
      "accounts": [
        {
          "name": "msgSender",
          "writable": true,
          "signer": true
        },
        {
          "name": "discussion",
          "writable": true
        },
        {
          "name": "msgmanagerpro",
          "address": "HvSWzWV5Ay76njLS4k2YbCZrJK6WnGD8QCjbQTAQQs51"
        }
      ],
      "args": [
        {
          "name": "post",
          "type": "pubkey"
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
    },
    {
      "name": "post",
      "discriminator": [
        8,
        147,
        90,
        186,
        185,
        56,
        192,
        150
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "multipleLikes",
      "msg": "Error: You can't like the same post multiple times !"
    },
    {
      "code": 6001,
      "name": "neverLiked",
      "msg": "Error: Never liked this post !"
    },
    {
      "code": 6002,
      "name": "postNotTransfered",
      "msg": "Error: Post Not transfered !"
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
    },
    {
      "name": "post",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "postid",
            "type": "u8"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "nbrlikes",
            "type": "u32"
          },
          {
            "name": "likerslist",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    }
  ]
};
