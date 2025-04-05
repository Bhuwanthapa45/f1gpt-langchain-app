// "use client"
// import Image from "next/image"
// import f1gptlogofirst from "./assets/f1gptlogofirst.jpg"
// import {useChat} from "ai/react"
// import {Message} from "ai"
// import LoadingBubble from "./components/LoadingBubble"
// import Bubble from "./components/Bubble"
// import PromptSuggestionsRow from "./components/PromptSuggestionsRow"



// const Home = ()=>{
//     const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat();



//     const noMessages = !messages || messages.length === 0
//     const handlePrompt = ( promptText )=>{
//         console.log("Sending prompt:", promptText);
//         const msg: Message = {
//             id: crypto.randomUUID(),
//             content:promptText,
//             role: "user"
//         }
//         append(msg)

//     }



//     return(
//         <main>
//             <Image src={f1gptlogofirst} width="250" alt="F1 GPT"/>
//             <section className={noMessages ? "" : "populated"}>

//                 {
//                     noMessages ? (
//                         <>
//                         <p className="starter-text">
//                             F1 GPT is the best place where you can find the latest info about f1 before any where else. 
//                             For All The Kids Who Dream The Impossible, You Can Do It Too
//                         </p>
//                         <br/>
//                         <PromptSuggestionsRow onPromptClick={handlePrompt}/>


                        
//                         </>
//                     ) : (
//                         <>
//                         {/* //map the messages into the text bubbles */}
//                         {messages.map((message,index) => <Bubble key={`message-${index}`} message={message}/>)}

//                         {isLoading && <LoadingBubble/>}

//                         </>
//                     )  
//                 }
               
//             </section>
//             <form onSubmit={handleSubmit}>
//                     <input className="question-box" onChange={handleInputChange}
//                         value={input} placeholder="Du Du Tu Tu....."
//                     />
//                     <input type="submit"/>


//                 </form>
//         </main>
//     )

// }
// export default Home;

//chatgpt 1

"use client";
import Image from "next/image";
import { useState } from "react";
import f1gptlogofirst from "./assets/f1gptlogofirst.jpg";
import LoadingBubble from "./components/LoadingBubble";
import Bubble from "./components/Bubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const noMessages = messages.length === 0;

  const handlePrompt = async (promptText) => {
    console.log("Sending prompt:", promptText);
    await sendMessage(promptText);
  };

  const sendMessage = async (text) => {
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: updatedMessages }),
    });

    if (!res.body) {
      console.error("No response body");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    const streamMessages = [...updatedMessages];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      assistantMessage.content += chunk;
      setMessages([...streamMessages, { ...assistantMessage }]);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <main>
      <Image src={f1gptlogofirst} width="250" alt="F1 GPT" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              F1 GPT is the best place where you can find the latest info about F1 before anywhere else. 
              For All The Kids Who Dream The Impossible, You Can Do It Too.
            </p>
            <br />
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>

      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Du Du Tu Tu....."
        />
        <input type="submit" />
      </form>
    </main>
  );
};

export default Home;
