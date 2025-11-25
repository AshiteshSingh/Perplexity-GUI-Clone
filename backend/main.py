import os
import json
from typing import List, Optional, Union, Dict, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from huggingface_hub import InferenceClient

load_dotenv()

app = FastAPI()

# Initialize Clients
groq_client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

hf_client = InferenceClient(token=os.getenv("HF_API_TOKEN"))

class MessagePart(BaseModel):
    type: Optional[str] = None
    text: Optional[str] = None

class Message(BaseModel):
    role: str
    content: Union[str, List[Union[str, MessagePart, Dict[str, Any]]]]
    parts: Optional[List[MessagePart]] = None

class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "llama-3.3-70b-versatile"
    isDeepResearch: Optional[bool] = False
    isBrowsing: Optional[bool] = False

def process_messages(messages: List[Message]) -> List[Dict[str, str]]:
    processed_messages = []
    for m in messages:
        content = ""
        if isinstance(m.content, str):
            content = m.content
        elif isinstance(m.content, list):
            for item in m.content:
                if isinstance(item, str):
                    content += item + "\n"
                elif isinstance(item, dict) and "text" in item:
                    content += item["text"] + "\n"
                elif hasattr(item, "text") and item.text:
                    content += item.text + "\n"
        
        if m.parts:
            for p in m.parts:
                if p.text:
                    content += p.text + "\n"
        
        if content.strip():
            processed_messages.append({"role": m.role, "content": content.strip()})
    return processed_messages

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        model = request.model
        is_deep_research = request.isDeepResearch
        is_browsing = request.isBrowsing
        messages = request.messages

        system_prompt = "You are a helpful, expert coding assistant. You provide accurate, concise, and well-formatted code. You are part of a Sagan interface."

        if is_deep_research:
            system_prompt += "\n\n[DEEP RESEARCH MODE ENABLED]\nYou are in Deep Research mode. Provide exhaustive, detailed, and well-cited answers. Explore multiple angles and depths of the topic."
        
        if is_browsing:
            system_prompt += "\n\n[BROWSING MODE ENABLED]\nYou have access to the internet (simulated). When answering, pretend to browse the web for the latest information. Cite your sources."

        selected_model_id = "llama-3.3-70b-versatile" # Default
        
        if model == 'hf':
            # Hugging Face (Qwen 2.5 Coder)
            # Using InferenceClient for streaming
            processed_msgs = process_messages(messages)
            # Prepend system prompt if possible, or add as first system message
            final_messages = [{"role": "system", "content": system_prompt}] + processed_msgs
            
            async def hf_stream():
                try:
                    stream = hf_client.chat_completion(
                        model="Qwen/Qwen2.5-Coder-32B-Instruct",
                        messages=final_messages,
                        stream=True,
                        max_tokens=2048
                    )
                    for chunk in stream:
                        if chunk.choices and chunk.choices[0].delta.content:
                            yield chunk.choices[0].delta.content
                except Exception as e:
                    yield f"Error: {str(e)}"

            return StreamingResponse(hf_stream(), media_type="text/plain")

        elif model == 'deepseek':
            selected_model_id = "llama-3.3-70b-versatile"
            system_prompt += "\n\nYou are simulating DeepSeek R1. Prioritize deep reasoning and step-by-step logic."
        elif model == 'gpt-oss':
            selected_model_id = "gemma2-9b-it"
            system_prompt += "\n\nYou are simulating GPT-OSS (Gemma 2 9B). You are a helpful, open-source assistant."
        else:
            selected_model_id = "llama-3.3-70b-versatile"

        # Groq / OpenAI compatible
        processed_msgs = process_messages(messages)
        final_messages = [{"role": "system", "content": system_prompt}] + processed_msgs

        async def openai_stream():
            try:
                stream = groq_client.chat.completions.create(
                    model=selected_model_id,
                    messages=final_messages,
                    stream=True
                )
                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
            except Exception as e:
                yield f"Error: {str(e)}"

        return StreamingResponse(openai_stream(), media_type="text/plain")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
