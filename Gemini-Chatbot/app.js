

const typingForm = document.querySelector(".typing-form");
const typingInput = typingForm.querySelector(".typing-input");
const chatList = document.querySelector(".chat-list");
const themeIcon = document.querySelector("#toggleThemeButton");
const deleteBtn = document.querySelector("#Chat-delete-btn");
const suggestions = document.querySelectorAll(".suggestion-list .suggestion");



let userMessage = null;
let isResponceGenerating = false;

const loadLocalStorageData = () => {
    const savedChats = sessionStorage.getItem("savedChats");
    const isLight = (localStorage.getItem("themeColor") === "light_mode");

    // Apply the stored theme
    document.body.classList.toggle("light_mode", isLight);
    themeIcon.querySelector("img").src = isLight ? "images/moon.png" : "images/sun.png";

    //Restore Saved chats 
    chatList.innerHTML = savedChats || " ";

    document.body.classList.toggle("hide-header", savedChats)

    chatList.scrollTo(0, chatList.scrollHeight); //Scroll to bottom
}
loadLocalStorageData();

// API configuration
const API_KEY = "AIzaSyD9KFamylnyuMAggJ5B876Dy2b4LdKWPQg"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

//Create a new message ele and return it
const createMsgElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("msg", ...classes);
    div.innerHTML = content;
    return div;
}

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMsgDiv) => {
    const words = text.split(" ");
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];
        incomingMsgDiv.querySelector("span").classList.add("hide");
        chatList.scrollTo(0, chatList.scrollHeight); //Scroll to bottom

        // IF all words are displayed
        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponceGenerating = false;
            incomingMsgDiv.querySelector("span").classList.remove("hide");
            sessionStorage.setItem("savedChats", chatList.innerHTML);  //Save chats to local storage
        }
    }, 75);
}

// Fetch responce from API based onn user message
const generateAPIResponce = async (div) => {

    const textElement = div.querySelector(".text");

    // Send a post request to the API with the user's message
    try {
        const responce = await fetch(API_URL, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        })

        const data = await responce.json();
        if (!responce.ok) {
            throw new Error(data.error.message);
        }

        //Get the api responce in text format and remove asterisks from it
        const apiResponce = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1");
        showTypingEffect(apiResponce, textElement, div);
    } catch (error) {
        isResponceGenerating = false;
        textElement.innerText = error.message;
        textElement.classList.add("error");
    } finally {
        div.classList.remove("loading")
    }
}

//Show loading animation while waiting for the API responce
const showLoadingAnimation = () => {
    const html = `<div class="msg-content">
        <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
        <p class="text">
          
        </p>
        <div class="loading-indicator">
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
        </div>
      </div>
      <span onclick="copymsg(this)" class="icon"><i class="fa-regular fa-copy"></i></span>`

    const incomingMsgDiv = createMsgElement(html, "incoming", "loading")
    chatList.appendChild(incomingMsgDiv);

    chatList.scrollTo(0, chatList.scrollHeight); //Scroll to bottom
    generateAPIResponce(incomingMsgDiv);
}

// Copy message text to the clicpbord
const copymsg = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyIcon.innerHTML = `<i class="fa-solid fa-check"></i>`; //Show tick icon
    setTimeout(() => {
        copyIcon.innerHTML = `<i class="fa-regular fa-copy"></i>`; //Revert icon after 1 second
    }, 1000)
}

// Lets handle outgoing messages 
const handleOutgoingChat = () => {
    userMessage = typingInput.value.trim() || userMessage;
    if (!userMessage || isResponceGenerating) return; //Exit if there is no message

    isResponceGenerating = true;

    const html = `<div class="msg-content">
        <img src="images/user.jpg" alt="User Image" class="avatar">
        <p class="text">

        </p>
      </div>`

    const outgoingMsgDiv = createMsgElement(html, "outgoing")
    outgoingMsgDiv.querySelector(".text").innerText = userMessage;
    chatList.appendChild(outgoingMsgDiv);

    typingForm.reset() // Clear the input field
    chatList.scrollTo(0, chatList.scrollHeight); //Scroll to bottom
    document.body.classList.add("hide-header")
    setTimeout(showLoadingAnimation, 500) //show loading animation after a delay
}

// set UserMessage and handle outgoing message when suggestions clicked
suggestions.forEach(suggestion => {
    suggestion.addEventListener("click", () => {
        userMessage = suggestion.querySelector(".text").innerText;
        handleOutgoingChat();
    })
});

// toggle between light and dark theme
themeIcon.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light_mode");
    localStorage.setItem("themeColor", isLight ? "light_mode" : "dark_mode");
    themeIcon.querySelector("img").src = isLight ? "images/moon.png" : "images/sun.png"
})


deleteBtn.addEventListener("click", () => {
    if (confirm("Are u sure ?")) {
        sessionStorage.removeItem("savedChats");
        loadLocalStorageData();
    }
})

// prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
})