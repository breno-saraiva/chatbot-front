const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
// debugger;

function addMessage(content, sender) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;

  messageElement.appendChild(bubble);
  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  return messageElement;
}

async function sendToApi(userMessage) {
  try {
    const response = await fetch(
      "https://global-solution-2-fiap.vercel.app/pergunta",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result.response;
  } catch (error) {
    console.error("Erro ao se comunicar com a API:", error);
    return "Desculpe, não foi possível processar sua mensagem agora.";
  }
}

sendBtn.addEventListener("click", async () => {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage(userMessage, "user");
    userInput.value = "";
    const loadingMessage = addMessage("Carregando...", "bot");

    const botResponse = await sendToApi(userMessage);

    if (botResponse.resposta) {
      loadingMessage.querySelector(".bubble").textContent =
        botResponse.resposta;
    } else {
      const resposta = botResponse.listaSugestoes.join(`; `);
      loadingMessage.querySelector(
        ".bubble"
      ).textContent = `Infelizmente não sei essa! Acho que você quis dizer: ${resposta}`;
    }
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
