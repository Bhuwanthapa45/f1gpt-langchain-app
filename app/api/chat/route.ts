// import Together from "together-ai";
// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { DataAPIClient } from "@datastax/astra-db-ts";

// const {
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
//   TOGETHER_API_KEY,
// } = process.env;

// const together = new Together();
// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
// const db = client.db(ASTRA_DB_API_ENDPOINT, {
//   namespace: ASTRA_DB_NAMESPACE,
// });

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
//     const latestMessage = messages[messages?.length - 1]?.content;

//     let docContext = "";
//     const embedding = await together.embeddings.create({
//       model: "BAAI/bge-base-en-v1.5",
//       input: latestMessage,
//       encoding_format: "float",
//     });
//     try {
//       const collection = await db.collection(ASTRA_DB_COLLECTION);
//       const cursor = collection.find(null, {
//         sort: {
//           $vector: embedding.data[0].embedding,
//         },
//         limit: 10,
//       });
//       const documents = await cursor.toArray();
//       const docsMap = documents?.map((doc) => doc.text);

//       docContext = JSON.stringify(docsMap);
//     } catch (error) {
//       console.log("Error querying db...");
//       docContext = "";
//     }
//     const template = {
//       role: "system",
//       content: ` 
//             You are an AI assistant who knows everything about Formula One.
// Use the below context to augment what you know about Formula One racing. 
// The context will provide you with the most recent page data from wikipedia
// the official F1 website and others.
// If the context doesn't include the information you need answer based on your
// existing knowledge and don't mention the source of your information or
// what the context does or doesn't include.
// Format responses using markdown where applicable and don't return
// images. 

// ........
// START CONTEXT ${docContext}
// END CONTEXT
// .........
// QUESTION: ${latestMessage}
// ..........

//             `,
//     };
//    const response =  await openai.chat.completions.create({
//         model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//         stream: true,
//         messages: [template, ...messages]
//     })
//     const stream = OpenAIStream(response)
//     return new StreamingTextResponse(stream)



//   } catch (err) {
//     throw err
//   }
// }

//Chat gpt code 

// import Together from "together-ai";
// import { DataAPIClient } from "@datastax/astra-db-ts";

// const {
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
// } = process.env;

// const together = new Together();
// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
// const db = client.db(ASTRA_DB_API_ENDPOINT, {
//   namespace: ASTRA_DB_NAMESPACE,
// });

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
//     const latestMessage = messages[messages?.length - 1]?.content;

//     let docContext = "";
//     const embedding = await together.embeddings.create({
//       model: "BAAI/bge-base-en-v1.5",
//       input: latestMessage,
      
//     });

//     try {
//       const collection = await db.collection(ASTRA_DB_COLLECTION);
//       const cursor = collection.find(null, {
//         sort: {
//           $vector: embedding.data[0].embedding,
//         },
//         limit: 10,
//       });
//       const documents = await cursor.toArray();
//       const docsMap = documents?.map((doc) => doc.text);
//       docContext = JSON.stringify(docsMap);
//     } catch (error) {
//       console.log("Error querying db...");
//       docContext = "";
//     }

//     const template = {
//       role: "system",
//       content: `
//         You are an AI assistant who knows everything about Formula One.
//         Use the below context to augment what you know about Formula One racing.
//         The context will provide you with the most recent page data from wikipedia
//         the official F1 website and others.
//         If the context doesn't include the information you need, answer based on your
//         existing knowledge and don't mention the source of your information or
//         what the context does or doesn't include.
//         Format responses using markdown where applicable and don't return images.

//         ........
//         START CONTEXT ${docContext}
//         END CONTEXT
//         .........
//         QUESTION: ${latestMessage}
//         ..........
//       `
//     };

//     const response = await together.chat.completions.create({
//       model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//       messages: [template, ...messages],
//     });

//     return new Response(response.choices[0].message.content, {
//       status: 200,
//     });

//   } catch (err) {
//     console.error("Something went wrong:", err);
//     return new Response("Error generating response", { status: 500 });
//   }
// }

//chatgpt 2
// import Together from "together-ai";
// import { DataAPIClient } from "@datastax/astra-db-ts";

// const {
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
//   TOGETHER_API_KEY,
// } = process.env;

// // Ensure the Together client gets the API key
// const together = new Together({ apiKey: TOGETHER_API_KEY });
// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
// const db = client.db(ASTRA_DB_API_ENDPOINT!, {
//   namespace: ASTRA_DB_NAMESPACE,
// });

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
//     const latestMessage = messages?.[messages.length - 1]?.content;

//     if (!latestMessage) {
//       return new Response("No message content found", { status: 400 });
//     }

//     let docContext = "";
//     try {
//       const embedding = await together.embeddings.create({
//         model: "BAAI/bge-base-en-v1.5",
//         input: latestMessage,
//       });

//       const collection = await db.collection(ASTRA_DB_COLLECTION!);
//       const cursor = collection.find(null, {
//         sort: {
//           $vector: embedding.data[0].embedding,
//         },
//         limit: 10,
//       });

//       const documents = await cursor.toArray();
//       const docsMap = documents.map((doc) => doc.text);
//       docContext = JSON.stringify(docsMap);
//     } catch (err) {
//       console.warn("Vector DB fallback: ", err);
//     }

//     const systemPrompt = {
//       role: "system",
//       content: `
// You are an AI assistant who knows everything about Formula One.
// Use the below context to augment what you know about Formula One racing.
// The context will provide you with the most recent page data from Wikipedia,
// the official F1 website, and others.

// If the context doesn't include the information you need, answer based on your
// existing knowledge. Do not mention the source of your information or what
// the context does or doesn't include.

// Format responses using markdown where applicable. Do not return images.

// ---
// START CONTEXT:
// ${docContext}
// END CONTEXT
// ---
// QUESTION:
// ${latestMessage}
//       `,
//     };

//     const response = await together.chat.completions.create({
//       model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//       messages: [systemPrompt, ...messages],
//     });

//     const finalMessage = response.choices?.[0]?.message?.content ?? "No response from model";

//     return new Response(finalMessage, {
//       status: 200,
//     });

//     // If you want to support streaming later:
//     // for await (const chunk of response) { ... }

//   } catch (err) {
//     console.error("Something went wrong:", err);
//     return new Response("Error generating response", { status: 500 });
//   }
// }

//temp testing
// import Together from "together-ai";

// const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

// export async function POST() {
//   try {
//     const response = await together.chat.completions.create({
//       model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//       messages: [
//         { role: "user", content: "Tell me something about Lewis Hamilton" }
//       ],
//     });

//     return new Response(response.choices[0].message.content, {
//       status: 200,
//     });
//   } catch (err) {
//     console.error("API error:", err);
//     return new Response("Error in Together.ai API", { status: 500 });
//   }
// }

// export async function GET() {
//     return new Response("Use POST instead", { status: 405 });
//   }

//chatgpt 3
// import Together from "together-ai";
// import { DataAPIClient } from "@datastax/astra-db-ts";
// import { StreamingTextResponse } from "ai";
// import { createStreamableValue } from "ai";

// const {
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
//   TOGETHER_API_KEY,
// } = process.env;

// const together = new Together({ apiKey: TOGETHER_API_KEY });
// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
// const db = client.db(ASTRA_DB_API_ENDPOINT!, {
//   namespace: ASTRA_DB_NAMESPACE,
// });

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
//     const latestMessage = messages?.[messages.length - 1]?.content;

//     if (!latestMessage) {
//       return new Response("No message content found", { status: 400 });
//     }

//     let docContext = "";
//     try {
//       const embedding = await together.embeddings.create({
//         model: "BAAI/bge-base-en-v1.5",
//         input: latestMessage,
//       });

//       const collection = await db.collection(ASTRA_DB_COLLECTION!);
//       const cursor = collection.find(null, {
//         sort: {
//           $vector: embedding.data[0].embedding,
//         },
//         limit: 10,
//       });

//       const documents = await cursor.toArray();
//       const docsMap = documents.map((doc) => doc.text);
//       docContext = JSON.stringify(docsMap);
//     } catch (err) {
//       console.warn("Vector DB fallback: ", err);
//     }

//     const systemPrompt = {
//       role: "system",
//       content: `
// You are an AI assistant who knows everything about Formula One.
// Use the below context to augment what you know about Formula One racing.
// The context will provide you with the most recent page data from Wikipedia,
// the official F1 website, and others.

// If the context doesn't include the information you need, answer based on your
// existing knowledge. Do not mention the source of your information or what
// the context does or doesn't include.

// Format responses using markdown where applicable. Do not return images.

// ---
// START CONTEXT:
// ${docContext}
// END CONTEXT
// ---
// QUESTION:
// ${latestMessage}
//       `,
//     };

//     const stream = createStreamableValue();

//     (async () => {
//       const completion = await together.chat.completions.create({
//         model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//         messages: [systemPrompt, ...messages],
//         stream: true,
//       });

//       for await (const chunk of completion) {
//         const content = chunk.choices?.[0]?.delta?.content;
//         if (content) {
//           stream.update(content);
//         }
//       }

//       stream.done();
//     })();

//     return new StreamingTextResponse(stream.value);
//   } catch (err) {
//     console.error("Something went wrong:", err);
//     return new Response("Error generating response", { status: 500 });
//   }
// }



//chatgpt 4

// 


//chatgpt 5
// import Together from "together-ai";
// import { DataAPIClient } from "@datastax/astra-db-ts";

// const {
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
//   TOGETHER_API_KEY,
// } = process.env;

// const together = new Together({ apiKey: TOGETHER_API_KEY });
// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
// const db = client.db(ASTRA_DB_API_ENDPOINT!, {
//   namespace: ASTRA_DB_NAMESPACE,
// });

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
//     const latestMessage = messages?.[messages.length - 1]?.content;

//     if (!latestMessage) {
//       return new Response("No message content found", { status: 400 });
//     }

//     let docContext = "";
//     try {
//       const embedding = await together.embeddings.create({
//         model: "BAAI/bge-base-en-v1.5",
//         input: latestMessage,
//       });

//       const collection = await db.collection(ASTRA_DB_COLLECTION!);
//       const cursor = collection.find(null, {
//         sort: {
//           $vector: embedding.data[0].embedding,
//         },
//         limit: 10,
//       });

//       const documents = await cursor.toArray();
//       console.log("🔍 Retrieved documents:", documents);

//     //   const docsMap = documents.map((doc) => doc.text);
//     //   docContext = JSON.stringify(docsMap);
//     const filteredDocs = documents.filter(doc =>
//         doc.text && doc.text.length > 50 && !doc.text.includes('teamColour')
//       );
//       const docsMap = filteredDocs.map((doc, i) => `Document ${i + 1}:\n${doc.text}`).join("\n\n");
//       docContext = docsMap;

//     } catch (err) {
//       console.warn("Vector DB fallback: ", err);
//     }

//     const systemPrompt = {
//       role: "system",
//       content: `
// You are an AI assistant who knows everything about Formula One.
// Use the below context to augment what you know about Formula One racing.
// The context will provide you with the most recent page data from Wikipedia,
// the official F1 website, and others.

// If the context doesn't include the information you need, answer based on your
// existing knowledge. Do not mention the source of your information or what
// the context does or doesn't include.

// Format responses using markdown where applicable. Do not return images.

// ---
// START CONTEXT:
// ${docContext}
// END CONTEXT
// ---
// QUESTION:
// ${latestMessage}
//       `,
//     };

//     const encoder = new TextEncoder();
//     const stream = new ReadableStream({
//       async start(controller) {
//         const completion = await together.chat.completions.create({
//           model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//           messages: [systemPrompt, ...messages],
//           stream: true,
//         });

//         for await (const chunk of completion) {
//           const content = chunk.choices?.[0]?.delta?.content;
//           if (content) {
//             controller.enqueue(encoder.encode(content));
//           }
//         }

//         controller.close();
//       },
//     });

//     return new Response(stream, {
//       status: 200,
//       headers: {
//         "Content-Type": "text/plain; charset=utf-8",
//         "Transfer-Encoding": "chunked",
//       },
//     });
//   } catch (err) {
//     console.error("Something went wrong:", err);
//     return new Response("Error generating response", { status: 500 });
//   }
// }


//chatgpt 6
import Together from "together-ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  TOGETHER_API_KEY,
} = process.env;

const together = new Together({ apiKey: TOGETHER_API_KEY });
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
  namespace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages?.[messages.length - 1]?.content;

    if (!latestMessage) {
      return new Response("No message content found", { status: 400 });
    }

    let docContext = "";
    try {
      const embedding = await together.embeddings.create({
        model: "BAAI/bge-base-en-v1.5",
        input: latestMessage,
      });

      const collection = await db.collection(ASTRA_DB_COLLECTION!);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      });

      const documents = await cursor.toArray();
      const filteredDocs = documents.filter(doc =>
        doc.text && doc.text.length > 50 && !doc.text.includes('teamColour')
      );
      const docsMap = filteredDocs.map((doc, i) => `Document ${i + 1}:
${doc.text}`).join("\n\n");
      docContext = docsMap;

      console.log("\uD83E\uDEB0 Final context sent to Together:", docContext);
    } catch (err) {
      console.warn("Vector DB fallback: ", err);
    }

    const systemPrompt = {
      role: "system",
      content: `
You are an AI assistant who knows everything about Formula One.
Use the below context to augment what you know about Formula One racing.
The context will provide you with the most recent page data from Wikipedia,
the official F1 website, and others.

If the context doesn't include the information you need, answer based on your
existing knowledge. Do not mention the source of your information or what
the context does or doesn't include.

Format responses using markdown where applicable. Do not return images.

---
START CONTEXT:
${docContext}
END CONTEXT
---
QUESTION:
${latestMessage}
      `,


    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const completion = await together.chat.completions.create({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
          messages: [systemPrompt, ...messages],
          stream: true,
        });

        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("Something went wrong:", err);
    return new Response("Error generating response", { status: 500 });
  }
}

