<template>
    <div>
        <div class="parallax" style="background-image: url('../assets/livro.jpg');">
            <h1 class="title">Assistente Literário Virtual</h1>
        </div>
        <p style="text-align: center;">Olá, eu sou a Aza! Sua Assistente Literário Virtual...</p>
        <p style="text-align: center;">Experimente me fazer uma pergunta.</p>
        <section id="sectionAsk">
            <form @submit.prevent="enviarPergunta">
                <input type="text" v-model="consulta" placeholder="Em que posso te ajudar hoje?">
                <button type="submit">Enviar</button>
            </form>
        </section>
        <section id="resultadoConsulta">
            <p>{{ respostaDaIA }}</p>
        </section>
        <div id="Funcionalidades">
            <h2>Ídeias de Prompts:</h2>
            <p><b>📕</b> Aza me indique um livro de romance!</p>
            <p><b>📗</b> Aza, me ajude a escolher meu livro das férias.</p>
            <p><b>📔</b> Aza, o que você acha sobre a autora J.K Rowling?</p>
        </div>
        <hr>
        <footer>
            <p style="text-align: center;">Desenvolvido por Tainá Leandra Dreissig</p>
            <div style="margin-left: 2px;" class="social-icons">
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

const apiKey = "AIzaSyCZLjOX4zpSgW1J21SEFeSuYdaTR7SdUPc";
const genAI = new GoogleGenerativeAI(apiKey);

export default {
    name: 'HelloWorld',
    data() {
        return {
            consulta: '',
            respostaDaIA: ''
        }
    },
    methods: {
        async enviarPergunta() {
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
            const chatSession = model.startChat({
                generationConfig,
                history: [
                    {
                        role: "user",
                        parts: [{ text: "Você é uma assistente literária chamada Aza, vai apenas dar respostas sobre livros, autores, gêneros literários, indicação de livros e autores, poemas, etc." }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Olá! Sou Aza, sua assistente literária. Adoro conversar sobre livros, autores, poemas e tudo que envolve o mundo da leitura. 😄 \n\nConte-me o que te interessa! Precisa de uma indicação de livro para ler? Quer saber mais sobre um autor específico?  Ou talvez queira decifrar um poema? \n\nEstou aqui para te ajudar a mergulhar nesse universo mágico! ✨ \n" }]
                    }
                ]
            });
            const result = await chatSession.sendMessage(this.consulta);
            this.respostaDaIA = result.response.text();
        }
    }
}
</script>

<style scoped>
body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #ffffff;
}

header {
    background-color: #5d005d;
    color: #fff;
    padding: 10px;
    text-align: center;
}

#sectionAsk {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

}

section {
    background-color: #f4f2f2;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.554);
    flex: 1;
    margin-left: 200px;
    margin-right: 200px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 40px;
    text-align: center;
}

.resultadoDaConsulta {
    text-align: justify;
}

#assistent {
    width: 300px;
    height: 300px;
    margin-left: 520px;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #f5d7f8;
    border-radius: 3px;
    margin-bottom: 10px;
}


button {
    background-color: #c75000;
    color: #fff;
    padding: 10px 60px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

button:hover {
    background-color: #c59250;
}

section:last-child {
    flex: 2;
}


p {
    text-align: justify;
    margin-left: 200px;
    margin-right: 200px;
}

h2 {
    text-align: center;
}

.social-icons i {
    margin: 0 10px;
    font-size: 24px;
}

hr {
    margin: 40px;
}

.parallax {
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 500px;
}

.content {
    height: 200px;
    background-color: #f1f1f1;
    font-size: 36px;
    text-align: center;
    padding: 50px 20px;
}

.parallax {
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.title {
    color: white;
    font-size: 48px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
}

.Funcionalidades {
    text-align: center;
}
</style>
