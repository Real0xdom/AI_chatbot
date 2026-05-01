import os
from openai import OpenAI
from dotenv import load_dotenv
#load the env variables
load_dotenv()


client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HF_TOKEN"],
)

def get_llm_response(prompt, chat_history):
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b:groq",
        messages=[
            {
                "role": "system",
                "content": "You're an helpful AI assistant only give brief and small answers be direct"
            }
        ] + chat_history[-6:] + [
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )
    reply = completion.choices[0].message.content
    return reply

def print_llm_response(prompt):
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b:groq",
        messages=[
            {
                "role": "system",
                "content": "You're an helpful AI assistant"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )
    print(completion.choices[0].message.content)

