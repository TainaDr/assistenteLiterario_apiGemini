//cc4r4ccVdOAZx4dh
//tainadreissig
//200.150.64.234

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

// Configurações
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurações do MongoDB
const uri =
      "mongodb+srv://tainadreissig:cc4r4ccVdOAZx4dh@cluster0.eji0zrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
});

// Conectar ao MongoDB com Mongoose
mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
});

// Verificar a conexão com Mongoose
app.post("/api/test-connection", async (req, res) => {
      try {
            await mongoose.connection.db.admin().ping();
            res.status(200).send("Conexão com MongoDB estabelecida com sucesso.");
      } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
            res.status(500).send("Erro ao se conectar ao MongoDB");
      }
});

// Modelo para o histórico
const historySchema = new mongoose.Schema({
      userId: String,
      action: String,
      timestamp: { type: Date, default: Date.now },
});
const History = mongoose.model("History", historySchema);

// Rota para registrar histórico
app.post("/api/history", async (req, res) => {
      try {
            const { userId, action } = req.body;
            const newHistory = new History({ userId, action });
            await newHistory.save();
            res.status(201).send("Histórico registrado com sucesso!");
      } catch (error) {
            console.error("Erro ao registrar histórico:", error);
            res.status(500).send("Erro ao registrar histórico.");
      }
});

// Rota de chat com MongoClient
app.post("/api/chat", async (req, res) => {
      const userMessage = req.body.message;

      try {
            await client.connect();
            const database = client.db("testDB");
            const collection = database.collection("testCol");

            const docCount = await collection.countDocuments({});
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

// Iniciar o servidor
app.listen(port, () => {
      console.log(`Servidor rodando na porta http://localhost:${port}`);
});
