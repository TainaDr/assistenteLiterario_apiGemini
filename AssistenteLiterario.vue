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
            <form @submit.prevent="enviarPergunta">
                <input type="text" v-model="consulta" placeholder="Em que posso te ajudar hoje?">
                <button type="submit">Enviar</button>
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
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCZLjOX4zpSgW1J21SEFeSuYdaTR7SdUPc"; //chave oculta para segurança do desenvolvedor
const genAI = new GoogleGenerativeAI(apiKey);

export default {
    name: 'HelloWorld',
    data() {
        return {
            consulta: '',
            chatHistory: []
        }
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
                parts: [{ text: "Você é uma assistente literária chamada Aza, vai apenas dar respostas sobre livros, autores, gêneros literários, indicação de livros e autores, poemas, etc. Não responda nada fora deste assunto!! Apenas sobre livros." }]
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

                this.consulta = '';
            } catch (error) {
                console.error('Erro ao enviar a mensagem:', error);
            }
        }
    },
    mounted() {
        this.chatHistory.push({
            role: "model",
            parts: [{ text: "Olá! Sou Aza, sua assistente literária. Adoro conversar sobre livros, autores, poemas e tudo que envolve o mundo da leitura. 😄 \n\nConte-me o que te interessa! Precisa de uma indicação de livro para ler? Quer saber mais sobre um autor específico? Ou talvez queira decifrar um poema? \n\nEstou aqui para te ajudar a mergulhar nesse universo mágico! ✨ \n" }]
        });
    }
}

//fyAbR05x8Fpy4H2l
//tainadreissig
//200.150.64.234

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://tainadreissig:fyAbR05x8Fpy4H2l@cluster0.eji0zrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

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
