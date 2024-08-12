//cc4r4ccVdOAZx4dh
//tainadreissig
//200.150.64.234

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://tainadreissig:cc4r4ccVdOAZx4dh@cluster0.eji0zrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
});

app.post("/api/chat", async (req, res) => {
      const userMessage = req.body.message;

      try {
            await client.connect();
            // const database = client.db('testDB');
            // const collection = database.collection('testCol');

            // const docCount = await collection.countDocuments({});
            console.log(`Número de documentos na coleção: ${docCount}`);

            const botReply = `Resposta gerada pelo bot para a mensagem: ${userMessage}`;
            res.json({ reply: botReply });
      } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
            res.status(500).send("Erro ao se conectar ao MongoDB");
      } finally {
            await client.close();
      }
});

app.get("/api/test-connection", async (req, res) => {
      try {
            await client.connect();
            // Verifica a conexão ao banco de dados
            await client.db("admin").command({ ping: 1 });
            res.status(200).send("Conexão com MongoDB estabelecida com sucesso.");
      } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
            res.status(500).send("Erro ao se conectar ao MongoDB");
      } finally {
            await client.close();
      }
});

app.listen(port, () => {
      console.log(`Servidor rodando na porta http://localhost:${port}`);
});
