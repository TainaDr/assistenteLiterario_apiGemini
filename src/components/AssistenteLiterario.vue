<template>
    <div>
        <div class="header">
            <img class="imagemlivro" src="../assets/books-8594725_1280.jpg" alt="imagem livros">
        </div>
        <h1 class="title">Assistente Literário Virtual</h1>
        <p style="text-align: center;">Olá, eu sou a Aza! Sua Assistente Literário Virtual...</p>
        <p style="text-align: center;">Experimente me fazer uma pergunta.</p>
        <section id="sectionAsk">
            <div id="chatbox">
                <div v-for="(message, index) in chatHistory" :key="index" :class="['message', message.role]">
                    <p>{{ message.parts[0].text }}</p>
                </div>
            </div>
            <form id="historyForm" @submit.prevent="enviarPergunta">
                <input type="text" v-model="consulta" placeholder="Em que posso te ajudar hoje?" required>
                <button style="margin-right: 20px" type="submit">Enviar</button>
                <button  style="margin-right: 20px" type="button" @click="conectarMongo">Conectar com Mongo</button>
                <button type="submit">Registrar Histórico</button>
            </form>
        </section>
        <hr>
        <footer>
            <p style="text-align: center;">Desenvolvido por Tainá Leandra Dreissig</p>
            <div class="social-icons">
                <a href="https://www.instagram.com/_tainadreissig/">
                    <img height="30px" width="30px" src="../assets/logotipo-do-instagram.png">
                </a>
                <a href="https://github.com/tainadr">
                    <img height="30px" width="30px" src="../assets/github.png">
                </a>
                <a href="https://www.linkedin.com/in/tain%C3%A1-dreissig-159593185/">
                    <img height="30px" width="30px" src="../assets/logotipo-do-linkedin.png">
                </a>
            </div>
        </footer>
    </div>
</template>

<script>
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCZLjOX4zpSgW1J21SEFeSuYdaTR7SdUPc";
const genAI = new GoogleGenerativeAI(apiKey);

export default {
    name: 'AssistenteLiterario',
    data() {
        return {
            consulta: '',
            chatHistory: [],
        };
    },
    methods: {
        async enviarPergunta() {
    if (this.consulta.trim() === '') return;

    this.chatHistory.push({
        role: 'user',
        parts: [{ text: this.consulta }]
    });

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const initialMessage = {
        role: 'user',
        parts: [{ text: "Você é uma assistente literária chamada Aza..." }]
    };

    const chatSession = model.startChat({
        generationConfig,
        history: [
            initialMessage,
            ...this.chatHistory.map(msg => ({
                role: msg.role,
                parts: msg.parts
            }))
        ]
    });

    try {
        const result = await chatSession.sendMessage(this.consulta);
        const respostaTexto = await result.response.text();

        this.chatHistory.push({
            role: 'model',
            parts: [{ text: respostaTexto }]
        });

        this.$nextTick(() => {
            const chatbox = document.getElementById('chatbox');
            chatbox.scrollTop = chatbox.scrollHeight;
        });

        const userId = '12345'; // Exemplo: substituir pelo ID real do usuário
        const action = this.consulta;

        const response = await fetch('http://localhost:3000/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, action })
        });

        if (response.ok) {
            alert('Histórico registrado com sucesso!');
        } else {
            alert('Erro ao registrar histórico.');
        }

        this.consulta = '';
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
    }
},

        async conectarMongo() {
            try {
                const response = await axios.get('http://localhost:3000/api/test-connection');
                if (response.status === 200) {
                    console.log('Conexão com MongoDB estabelecida com sucesso.');
                } else {
                    console.error('Falha ao conectar ao MongoDB.');
                }
            } catch (error) {
                console.error('Erro ao tentar conectar ao MongoDB:', error);
            }
        }
    },
    mounted() {
        this.chatHistory.push({
            role: "model",
            parts: [{ text: "Olá! Sou Aza, sua assistente literária..." }]
        });
    }
};
</script>
<style scoped>
body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 0;
}

hr {
    background-color: #5d005d;
    padding-top: 5px;
    margin: 0;
}

.header {
    background-color: #5d005d;
    color: #fff;
    padding: 0;
}

#sectionAsk {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#chatbox {
    background-color: #f4f2f2;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.554);
    width: 80%;
    max-width: 800px;
    height: 400px;
    overflow-y: scroll;
    padding: 20px;
    margin-top: 20px;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
}

.message.user {
    background-color: #00106b;
    text-align: right;
    color: #f4f2f2;
    margin-bottom: 10px;
    padding: 10px;
    margin-left: 300px;
}

.message.model {
    background-color: #c4d4f7;
    text-align: left;
    margin-right: 300px;
}

form {
    display: flex;
    flex-direction: row;
    width: 80%;
    max-width: 800px;
    margin-top: 20px;
    margin-bottom: 50px;
    text-shadow: 2px 2px 4px rgba(131, 103, 255, 0.5);
}

input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #000283;
    border-radius: 3px;
    margin-right: 10px;
}

button {
    background-color: #1d0053;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

button:hover {
    background-color: #62cdff;
}

.title {
    color: rgb(0, 0, 0);
    font-size: 48px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(255, 211, 146, 0.39);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    border-radius: 10px;
}

.footer {
    text-align: center;
    margin-top: 20px;
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
</style>
