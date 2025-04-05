import React from 'react'
import PromptSuggestionButton from './PromptSuggestionButton'

const PromptSuggestionsRow = ({onPromptClick}) => {
    const prompts = [
        "Who is the head of Mclaren Racing?",
        "Who is the highest Paid f1 driver?",
        "Who won the race in suzuka circuit?",
        "Who is in the lead of current world driver championship?"
    ]

  return (
    <div className='prompt-suggestion-row'>
        {prompts.map((prompt, index) => <PromptSuggestionButton 
        key={`suggestion-${index}`}
        text={prompt}
        onClick={() => onPromptClick(prompt)}
        />)}
      
    </div>
  )
}

export default PromptSuggestionsRow
