// import { DataAPIClient } from "@datastax/astra-db-ts";

// import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";


// import Together from "together-ai";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// import "dotenv/config";

// type SimilarityMetric = "dot_product" | "cosine" | "euclidean"


// const {
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
//   TOGETHER_AI_API_KEY,
// } = process.env;



// const together = new Together();

// const response = await together.chat.completions.create({
//     messages: [{"role": "user", "content": "What are some fun things to do in New York?"}],
//     model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
// });

// // console.log(response.choices[0].message.content)








// const f1Data = [
//   "https://en.wikipedia.org/wiki/Formula_One",
//   "https://www.formula1.com/en/latest/all",
//   "https://www.forbes.com/sites/brettknight/2024/12/10/formula-1s-highest-paid-drivers-2024/",
//   "https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions",
//   "https://en.wikipedia.org/wiki/List_of_female_Formula_One_drivers",
//   "https://www.fiaformula2.com/Latest",
//   "https://www.skysports.com/f1",
// ];

// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
// const db = client.db(ASTRA_DB_API_ENDPOINT, {
//   namespace: ASTRA_DB_NAMESPACE,
// });

// const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 512,
//     chunkOverlap: 100,

// })

// const createCollection = async (similarityMetric: SimilarityMetric="dot_product")=>{
//     const res =await db.createCollection(ASTRA_DB_COLLECTION,{
//         vector:{
//             dimension: 768,
//             metric: similarityMetric
            
//         }
//     })
//     console.log(res)

// }

// // const loadSampleData = async() => {
// //   const collection = await db.collection(ASTRA_DB_COLLECTION)
// //   for await (const url of f1Data){
// //     const content = await scrapePage(url)
// //     const chunks = await splitter.splitText(content)
// //    for await(const chunk of chunks){
// //     const embedding = await together.embeddings.create({
// //       model: "BAAI/bge-base-en-v1.5",
// //       input: chunk,
// //       encoding_format: "float" //this is used in open ai


// //     })
// //     const vector = embedding.data[0].embedding

// //     const res = await.collection.insertOne({
// //       $vector: vector,
// //       text: chunk
// //     })
// //     console.log(res)

// //    }
// //   }
// // }
// const loadSampleData = async () => {
//   const collection = await db.collection(ASTRA_DB_COLLECTION);

//   for await (const url of f1Data) {
//     const content = await scrapePage(url);
//     const chunks = await splitter.splitText(content);

//     for await (const chunk of chunks) {
//       const embeddingResponse = await together.embeddings.create({
//         model: "BAAI/bge-base-en-v1.5",
//         input: chunk,
//       });
      
//       const vector = embeddingResponse.data[0].embedding;
      
//       const res = await collection.insertOne({
//         $vector: vector,
//         text: chunk
//       });
      
//       console.log("Inserted chunk:", res.insertedId);
//     }
//   }
// };

// const scrapePage = async (url: string) =>{
//   const loader = new PuppeteerWebBaseLoader(url, {
//     launchOptions:{
//       headless: true
//     },
//     gotoOptions:{
//       waitUntil: "domcontentloaded"
//     },
//     evaluate: async (page, browser) =>{
//       const result = await page.evaluate(()=> document.body.innerHTML)
//       await browser.close()
//       return result
//     }
//   })
//   return ( await loader.scrape())?.replace(/<[^>]*>?/gm, '')



// }
// createCollection().then(()=> loadSampleData())
//wrap your entire logic in an async function

import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import Together from "together-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  TOGETHER_API_KEY,
} = process.env;

const together = new Together();

const f1Data = [
  "https://en.wikipedia.org/wiki/Formula_One",
  "https://www.formula1.com/en/latest/all",
  "https://www.forbes.com/sites/brettknight/2024/12/10/formula-1s-highest-paid-drivers-2024/",
  "https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions",
  "https://en.wikipedia.org/wiki/List_of_female_Formula_One_drivers",
  "https://www.fiaformula2.com/Latest",
  "https://www.skysports.com/f1",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  });
  console.log("Collection created:", res);
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);

  for await (const url of f1Data) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);

    for await (const chunk of chunks) {
      const embeddingResponse = await together.embeddings.create({
        model: "BAAI/bge-base-en-v1.5",
        input: chunk,
      });

      const vector = embeddingResponse.data[0].embedding;

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });

      console.log("Inserted chunk:", res.insertedId);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: { headless: true },
    gotoOptions: { waitUntil: "domcontentloaded" },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });

  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

// 👇 MAIN WRAPPER to avoid top-level await
async function main() {
  const response = await together.chat.completions.create({
    messages: [{ role: "user", content: "What are some fun things to do in New York?" }],
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  });

  console.log("LLM Response:", response.choices[0].message.content);

  await createCollection();
  await loadSampleData();
}

main().catch((err) => {
  console.error(" Error running script:", err);
});
