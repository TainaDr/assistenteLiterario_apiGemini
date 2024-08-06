<script>
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCZLjOX4zpSgW1J21SEFeSuYdaTR7SdUPc"; //chave oculta para segurança do desenvolvedor
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
                                    parts: [{ text: "Você é uma assistente literária chamada Aza, vai apenas dar respostas sobre livros, autores, gêneros literários, indicação de livros e autores, poemas, etc. Não responda nada fora deste assunto!" }]
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