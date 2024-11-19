<template>
    <div>
        <div class="header">
            <menu>
                <li><b>MENU</b></li>
                <li>
                    <a id="link2" href="#sobre"><b>SOBRE</b></a>
                </li>
                <li>
                    <a id="link3" href="#contato"><b>CONTATO</b></a>
                </li>
            </menu>
            <div class="header2">
                <img class="logo" src="../assets/1.png" alt="" />
                <h1 class="title">Assistente Literário Virtual</h1>
            </div>
        </div>
        <article class="textos">
            <p>
                <b>Bem-vindo ao Seu Assistente Literário Virtual</b>
                Conheça o seu guia personalizado de leitura! Aqui, a Inteligência
                Artificial trabalha para recomendar as melhores obras literárias,
                adaptadas ao seu gosto e estilo de leitura.
                <b>Recomendações Personalizadas: </b> Responda a algumas perguntas
                rápidas sobre seus interesses, gêneros favoritos ou humor do momento, e
                receba sugestões de livros que combinam com seu perfil.
            </p>
            <p>
                <b id="sobre">Exploração de Novos Gêneros:</b> Quer se aventurar em uma
                nova categoria literária? Nosso assistente oferece opções variadas,
                desde clássicos da literatura até best-sellers contemporâneos.
                <b> Listas Curadas para Você:</b> Receba listas temáticas de livros para
                diferentes ocasiões, como leituras para férias, momentos de introspecção
                ou pura diversão. <b>Descoberta de Autores:</b> Conheça escritores
                consagrados e novos talentos com base em suas leituras anteriores.
            </p>
        </article>
        <section id="sectionAsk">
            <div id="chatbox">
                <div v-for="(message, index) in chatHistory" :key="index" :class="['message', message.role]">
                    <p>{{ message.parts[0].text }}</p>
                </div>
            </div>
            <form id="historyForm" @submit.prevent="enviarPergunta">
                <input type="text" v-model="consulta" placeholder="Em que posso te ajudar hoje?" required />
                <button @click="enviarPergunta" style="margin-right: 20px" type="submit">Enviar</button>
            </form>
        </section>
        <footer id="contato">
            <p style="text-align: center">Desenvolvido por Tainá Leandra Dreissig</p>
            <div class="social-icons">
                <a href="https://www.instagram.com/_tainadreissig/">
                    <img height="30px" width="30px" src="../assets/logotipo-do-instagram.png" />
                </a>
                <a href="https://github.com/tainadr">
                    <img height="30px" width="30px" src="../assets/github.png" />
                </a>
                <a href="https://www.linkedin.com/in/tain%C3%A1-dreissig-159593185/">
                    <img height="30px" width="30px" src="../assets/logotipo-do-linkedin.png" />
                </a>
            </div>
        </footer>
    </div>
</template>
<!-- //AIzaSyBCEztLwNHhKP9KeWPbLMS4HRwzvUpm0QE -->
<script>
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBCEztLwNHhKP9KeWPbLMS4HRwzvUpm0QE";
const genAI = new GoogleGenerativeAI(apiKey);

const api = axios.create({
    baseURL: "https://endpoint-assistenteliterario.onrender.com/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    data() {
        return {
            consulta: "",
            chatHistory: [
                {
                    role: "user",
                    parts: [
                        { text: "Olá!\n" },
                    ],
                },
            ],
            ipAddress: "",
            city: "",
            state: "",
            country: "",
            isSending: false,
        };
    },
    methods: {
        async enviarPergunta() {
            if (!this.consulta.trim()) {
                console.warn("Consulta vazia! Nada será enviado.");
                return;
            }
            if (this.isSending) {
                console.warn("Já existe uma mensagem em envio. Aguarde.");
                return;
            }
            this.isSending = true;
            try {
                const userMessage = this.consulta.replace(/\*/g, "");
                this.chatHistory.push({
                    role: "user",
                    parts: [{ text: userMessage }],
                });
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
                if (!model) {
                    console.error("Modelo não foi inicializado corretamente.");
                    return;
                }
                const generationConfig = {
                    temperature: 1,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                    responseMimeType: "text/plain",
                };
                const chatSession = model.startChat({
                    generationConfig,
                    history: this.chatHistory, 
                });
                const result = await chatSession.sendMessage(userMessage);
                if (!result || !result.response) {
                    console.error("Nenhuma resposta recebida do modelo.");
                    return;
                }
                const respostaTexto = await result.response.text();
                const cleanResponse = respostaTexto.replace(/\*/g, "");
                this.chatHistory.push({
            role: "user",
            parts: [{ text: userMessage }],
        }, {
            role: "model",
            parts: [{ text: cleanResponse }],
        });
                await api.post("/history", {
                    userId: "12345",
                    action: userMessage,
                    city: this.city || "Cidade desconhecida",
                    state: this.state || "Estado desconhecido",
                    country: this.country || "País desconhecido",
                    ipAddress: this.ipAddress || "127.0.0.1",
                });
                this.consulta = "";
            } catch (error) {
                console.error("Erro ao enviar a mensagem:", error);
            } finally {
                this.isSending = false;
            }
            this.$nextTick(() => {
                const chatbox = document.getElementById("chatbox");
                if (chatbox) chatbox.scrollTop = chatbox.scrollHeight;
            });
        },
    },
    mounted() {
        if (this.chatHistory.length === 1) {
            this.chatHistory.push({
                role: "model",
                parts: [{ text: "Olá! Sou Aza, sua assistente literária. Como posso ajudar você com dúvidas sobre livros e literatura?\n" }],
            });
        }
    },
};
</script>

<style>
* {
    box-sizing: border-box;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    padding: 0;
    margin: 0 auto;
}

menu {
    display: flex;
    justify-content: end;
    padding: 0;
    margin: 0;
    color: #6a6f;
    list-style-type: none;
}

menu li {
    margin-right: 20px;
    margin-left: 10px;
    margin-top: 20px;
}

#link3,
#link2 {
    color: #6a6f;
    text-decoration: none;
}

.header2 {
    padding-top: 40px;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    width: 150px;
    height: 150px;
}

.textos {
    display: flex;
    justify-content: center;
    text-align: justify;
    gap: 20px;
    flex-wrap: wrap;
    padding-left: 50px;
    padding-right: 50px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin: 0 auto;
    color: #ffffff;
    background-color: #6a6f;
}

.textos p {
    flex: 1;
}

#chatbox {
    background-color: #ede1d2;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.554);
    width: 80%;
    max-width: 800px;
    height: 400px;
    overflow-y: scroll;
    padding: 20px;
    margin-top: 20px;
}

#chatbox::-webkit-scrollbar {
    width: 10px;
}

#chatbox::-webkit-scrollbar-track {
    background: #ede1d2;
}

#chatbox::-webkit-scrollbar-thumb {
    background-color: #806044;
    border-radius: 20px;
    border: 3px solid #ede1d2;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
}

.message.user {
    background-color: #cbb89d;
    text-align: right;
    color: #000000;
    margin-bottom: 10px;
    padding: 10px;
    margin-left: 400px;
}

.message.model {
    background-color: #806044;
    text-align: left;
    color: #ede1d2;
    margin-right: 400px;
}

form {
    display: flex;
    flex-direction: row;
    width: 80%;
    align-items: center;
    max-width: 800px;
    margin-top: 20px;
    margin-bottom: 50px;
}

#sectionAsk {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
}

input[type="text"] {
    flex: 1;
    padding: 15px 10px;
    border: 1px solid #6a6f;
    border-radius: 3px;
}

button {
    background-color: #6a6f;
    color: white;
    padding: 15px 60px;
    margin-left: 50px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #5a5e;
}

footer {
    text-align: center;
    margin-top: 20px;
    background-color: #6a6f;
    padding-bottom: 30px;
    color: white;
    padding-top: 30px;
}

.social-icons img {
    margin: 0 10px;
    width: 30px;
    height: 30px;
}

.imagemlivro {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-top: 0;
}

@media (max-width: 768px) {
    .logo {
        width: 80px;
        height: 80px;
    }

    .title {
        font-size: 32px;
    }

    .textos {
        padding-left: 20px;
        padding-right: 20px;
    }

    menu {
        flex-direction: column;
        align-items: center;
    }

    menu li {
        margin-right: 0;
        margin-left: 0;
        margin-top: 10px;
    }

    form {
        flex-direction: column;
        align-items: center;
        width: 90%;
    }

    input[type="text"] {
        margin-right: 0;
        margin-bottom: 10px;
    }

    button {
        width: 100%;
        margin-left: 0;
    }

    #chatbox {
        height: 300px;
        width: 90%;
    }

    .message.user {
        margin-left: 0;
    }

    .message.model {
        margin-right: 0;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 24px;
    }

    .logo {
        width: 60px;
        height: 60px;
    }

    #chatbox {
        height: 250px;
    }
}
</style>
