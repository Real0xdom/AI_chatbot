from helper_function import get_llm_response

chat_history = []

print("welcome to my AI Chatbot!")

while True:
    
    user_message = input("you: ")
    
    if user_message.lower() in ["bye", "exit", "quit"]:
        print("see you later, bye!")
        break
    chatbot_response = get_llm_response(user_message, chat_history)
    print(f"Chatbot: {chatbot_response}")
    print("")
    chat_history.append({"role": "user", "content": user_message})
    chat_history.append({"role": "assistant", "content": chatbot_response})

