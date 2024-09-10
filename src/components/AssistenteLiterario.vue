<template>
    <div>
        <div class="header">
            <menu>
                <li> <b>MENU</b> </li>
                <li><b>SOBRE</b> </li>
                <li><b>CONTATO</b></li>
            </menu>
            <div class="header2"> <img class="logo" src="../assets/1.png" alt="">
                <h1 class="title">Assistente Literário Virtual</h1>
            </div>

        </div>
        <article class="textos">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad accusantium molestiae beatae tempore nemo
                maxime necessitatibus earum iure, deserunt, atque, fugiat impedit nisi voluptatem esse consectetur dicta Voluptates, maiores numquam! Quibusdam, deserunt? Qui magni laudantium iusto recusandae labore
                consectetur repellat beatae repellendus aspernatur atque?
                Vero modi expedita, animi magnam vitae eius esse, placeat delectus cupiditate fugiat reiciendis quam
                adipisci vel doloremque.</p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur eum consequatur illo voluptatum.
                Voluptates, maiores numquam! Quibusdam, deserunt? Qui magni laudantium iusto recusandae labore
                consectetur repellat beatae repellendus aspernatur atque?
                Vero modi expedita, animi magnam vitae eius esse, placeat delectus cupiditate fugiat reiciendis quam
                necessitatibus repellat, ratione officiis? Blanditiis, aliquam quos! Dolor illo tempora aut aperiam
                dolore doloribus non ea.
                provident soluta dolorum tempora eveniet possimus tempore veritatis reiciendis mollitia, eum velit
                repudiandae autem ducimus? Vitae, eos.
                
            </p>
        </article>
        <!-- <img class="imagemlivro" src="../assets/books-8594725_1280.jpg" alt="imagem livros"> -->

        <!-- <p style="text-align: center;">Olá, eu sou a Aza! Sua Assistente Literário Virtual... Experimente me fazer uma
            pergunta.</p> -->
        <section id="sectionAsk">
            <div id="chatbox">
                <div v-for="(message, index) in chatHistory" :key="index" :class="['message', message.role]">
                    <p>{{ message.parts[0].text }}</p>
                </div>
            </div>
            <form id="historyForm" @submit.prevent="enviarPergunta">
                <input type="text" v-model="consulta" placeholder="Em que posso te ajudar hoje?" required>
                <button style="margin-right: 20px" type="submit">Enviar</button>
                <button style="margin-right: 20px" type="button" @click="conectarMongo">Conectar com Mongo</button>
                <button type="submit">Registrar Histórico</button>
            </form>
        </section>
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

                // Envia a ação e o histórico para o backend
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
.header2 {
    padding-top: 40px;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
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

.logo {
    width: 150px;
    height: 150px;
    /* margin-top: 100px;
    margin-left: 100px; */
    text-align: left;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    padding: 0;
    margin: 0 auto;
}

hr {
    background-color: #6a6f;
    padding-top: 5px;
    margin: 0;
}

.header {
    background-color: #ffffff;
    color: #fff;
    padding-bottom: 100px;

}

#sectionAsk {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#chatbox {
    background-color: #EDE1D2;
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
    color: #EDE1D2;
    margin-right: 400px;
}

form {
    display: flex;
    flex-direction: row;
    width: 80%;
    max-width: 800px;
    margin-top: 20px;
    margin-bottom: 50px;
    text-shadow: 2px 2px 4px rgba(255, 164, 103, 0.5);
}

input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #6a6f;
    border-radius: 3px;
    margin-right: 10px;
}

button {
    background-color: #6a6f;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

button:hover {
    background-color: #6a6f4C;
}

.title {
    color: #806044;
    font-size: 48px;
    font-weight: bold;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    padding: 20px;
    border-radius: 10px;
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
</style>
