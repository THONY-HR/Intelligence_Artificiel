<script setup>
import { ref, nextTick } from 'vue';
import { postData } from '../utils/api.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// États réactifs
const messages = ref([]);
const userMessage = ref('');
const isLoading = ref(false);
const typingMessage = ref('');
const isTyping = ref(false);
const chatWindow = ref(null);
const API_KEY = "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"; // Remplace par ta clé API

// Identifiant de l'intervalle de frappe
let typingInterval = null;

// Configuration de marked
marked.setOptions({
  breaks: true,
  highlight: (code) => hljs.highlightAuto(code).value
});

// Envoyer un message (se déclenche si l'assistant ne tape pas)
const sendMessage = async () => {
  if (!userMessage.value.trim() || isLoading.value || isTyping.value) return;

  isLoading.value = true;
  const userMessageContent = userMessage.value.trim();
  messages.value.push({ role: 'user', content: userMessageContent });

  const payload = {
    model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
    messages: [{
      role: 'user',
      content: `À partir de maintenant, tu répondras aux questions sur ton créateur, Anthony Rantonirina, en utilisant ces informations :
- Nom : Rantonirina Anthony  
- Âge : 21 ans  
- Date de naissance : 6 novembre 2003 à 4 h du matin  
- Lieu de naissance : Andilamena  
- Métier : Développeur full stack web et UI/UX designer  
- Études : Étudiant à ITUniversity  
- Stage : Il cherche un stage débutant en mai ou juin  
- Facebook : www.facebook.com/thony.hr.52/  

Si quelqu'un te demande l'âge de ton créateur, réponds uniquement '21 ans'.  
Si on te demande où il est né, réponds 'À Andilamena'.  
Si on te demande son métier, réponds 'Développeur full stack web et UI/UX designer'.  
Si la question concerne plusieurs informations, donne uniquement les réponses pertinentes.`
    },
    ...messages.value],
    temperature: 0.7,
    max_tokens: 3000,
    stream: false
  };

  try {
    const response = await postData('v1/chat/completions', payload, API_KEY);
    if (response.choices && response.choices.length > 0) {
      const assistantMessage = response.choices[0].message.content;
      simulateTyping(assistantMessage);
    } else {
      messages.value.push({ role: 'assistant', content: "Réponse non valide reçue." });
    }
  } catch (error) {
    messages.value.push({ role: 'assistant', content: "Désolé, une erreur s'est produite." });
  } finally {
    userMessage.value = '';
    isLoading.value = false;
  }
};

// Effet de frappe simulé pour l'assistant avec défilement automatique
const simulateTyping = (text) => {
  typingMessage.value = '';
  isTyping.value = true;
  let index = 0;
  typingInterval = setInterval(() => {
    if (index < text.length) {
      typingMessage.value += text[index];
      index++;
      // Défilement automatique vers le bas
      nextTick(() => {
        if (chatWindow.value) {
          chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
        }
      });
    } else {
      clearInterval(typingInterval);
      typingInterval = null;
      isTyping.value = false;
      messages.value.push({ role: 'assistant', content: typingMessage.value });
      typingMessage.value = '';
    }
  }, 5); // Délai de 50ms entre chaque caractère
};

// Fonction pour annuler la saisie en cours
const cancelTyping = () => {
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
    isTyping.value = false;
    typingMessage.value = ''; // Effacer le message partiellement tapé
  }
};

// Rendu Markdown sécurisé
const renderMarkdown = (content) => {
  return DOMPurify.sanitize(marked.parse(content));
};
</script>

<template>
  <div class="chat-container">
    <header>
      <h1>🤖 Chat IA - Anthony</h1>
      <p>Posez vos questions à l'assistant intelligent</p>
    </header>

    <div ref="chatWindow" class="chat-window">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
        <div class="bubble" v-html="message.role === 'assistant' ? renderMarkdown(message.content) : message.content"></div>
      </div>
      <!-- Affichage de l'effet de frappe -->
      <div v-if="typingMessage" class="message assistant">
        <div class="bubble" v-html="renderMarkdown(typingMessage)"></div>
      </div>
    </div>

    <div class="input-container">
      <input 
        type="text" 
        v-model="userMessage" 
        placeholder="Écrivez votre message..."
        @keyup.enter="sendMessage"
        :disabled="isLoading || isTyping"
      />
      <button @click="isTyping ? cancelTyping() : sendMessage()" :disabled="isLoading && !isTyping">
        <span v-if="isTyping">■</span>
        <span v-else>{{ isLoading ? 'Envoi...' : 'Envoyer' }}</span>
        <svg v-if="!isTyping" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Styles de base */
:root {
  --primary: #2c3e50;
  --secondary: #3498db;
  --background: #f9f9f9;
  --text: #34495e;
  --shadow: 0 2px 15px rgba(0,0,0,0.1);
}

.chat-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: black;
  border-radius: 1.5rem;
  box-shadow: var(--shadow);
}

.chat-window {
  height: 60vh;
  overflow-y: auto;
  padding: 1rem;
  background: black;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 1.5rem;
  line-height: 1.5;
}

.message.user .bubble {
  background: var(--secondary);
  color: rgb(201, 198, 198);
  border-radius: 1.5rem 1.5rem 0 1.5rem;
}

.message.assistant .bubble {
  background: black;
  color: var(--text);
  box-shadow: var(--shadow);
  border-radius: 1.5rem 1.5rem 1.5rem 0;
}

/* Markdown styling */
:deep(.bubble) h1, :deep(.bubble) h2, :deep(.bubble) h3 {
  color: var(--primary);
  margin: 1rem 0;
}

:deep(.bubble) code {
  background: #80eb6d27;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
  position: relative;
}

:deep(.bubble) pre {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  position: relative;
}

:deep(.bubble) pre code {
  background: none;
  padding: 0;
}

.copy-button {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: black;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Input */
.input-container {
  display: flex;
  gap: 1rem;
}

input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #dfe6e9;
  border-radius: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

button {
  padding: 0.75rem 1.5rem;
  background: var(--secondary);
  color: white;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-container {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 1rem;
    border-radius: 0;
  }

  .chat-window {
    height: 50vh;
    padding: 0.5rem;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .bubble {
    max-width: 90%;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .input-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    font-size: 0.9rem;
    padding: 0.75rem;
  }

  button {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
  }
}

</style>