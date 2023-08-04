const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler =document.querySelector(".chatbot-toggler"); //hidding chatbot for button click 

let userMessage;
const API_KEY = "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"; /*APIKEY is an authentication token*/
const inputInitHeight = chatInput.scrollHeight;

// create a new chatlist
const createChatlist = (message, className) =>{
    //message is for the contents of chat.it would be text string
    // className is used to differentiate which message is incoming or outgoing
    // Create a chatlist element with passed message and classname
    const chatList = document.createElement("li");
    chatList.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatList.innerHTML= chatContent;

//   to set the text message whether it is html tag
   chatList.querySelector("p").textContent = message
//    console.log(chatContent);
   return chatList;
}

// creating response and fetch the data
const generateResponse = (incomingChatlist) => {
    const API_URL ="https://api.openai.com/v1/chat/completions";
   
    const messageElement = incomingChatlist.querySelector("p");

    const requestOptions = { /*requestOptions returns message as Object*/
        method: "POST",
        headers: /*indicates that the request body is in JSON format by application/JSON*/ 
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },

        body: JSON.stringify({ /*sends the API POST request converting object to string*/
            model: "gpt-3.5-turbo",
            messages: [ { role: "user", content: userMessage }]
        })
    }
   
    
    // send POST response to API, then i get response from API
     // requestOption object contains the necessary configurations for the request,
    // fetch(API_URL, requestOptions) then sends POST request to API_URL 
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        /*.then(res => res.json()) fetch returns a promise and res.json() method is called to extract and parse the JSON data from the response into Object*/
        // console.log(data); /*get data from api*/
        messageElement.textContent = data.choices[0].message.content;
    }) 
    .catch((error) => {
        // console.log(error);
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    })
    //for auto scroll to the chatbox output
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight)); 
}    

const handleChat = () => {
    userMessage = chatInput.value.trim();
    /*if the chatbox filed is empty*/
    if(!userMessage) return;  
    // to clear the chatbox automatically after a chat
    chatInput.value=" "
    
    // resetting the text area to its default height once a message is sent
    chatInput.style.height = `${inputInitHeight}px`;
    // Append the user message for the chatbox as outgoing message
    chatbox.appendChild(createChatlist(userMessage,"outgoing"));

    // for auto scroll to the chatbox
    chatbox.scrollTo(0, chatbox.scrollHeight)
    setTimeout(() => {
        const incomingChatlist = createChatlist("Creating Response....","incoming")
        chatbox.appendChild(incomingChatlist);
    // 
        chatbox.scrollTo(0, chatbox.scrollHeight);
       generateResponse(incomingChatlist);
    //creating response message from chatbot as incoming message for 600m
    },600);
}

chatInput.addEventListener("input", () =>
{
//    Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// for enter key
chatInput.addEventListener("keyup", (e) =>
{
   if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800)
   {
    e.preventDefault();
    handleChat();
   }

});

// to start the send button
sendChatBtn.addEventListener("click",handleChat); 

// to start the chatbot toggler
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));