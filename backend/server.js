//cc4r4ccVdOAZx4dh
//tainadreissig
//200.150.64.234

const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const requestIp = require("request-ip"); // Nova biblioteca para capturar IPs

// Configurações
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(requestIp.mw()); // Middleware para capturar o IP do usuário

// Configurações do MongoDB
const uri =
      "mongodb+srv://tainadreissig14:cc4r4ccVdOAZx4dh@cluster0.z0h59xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
      // mongodb+srv://tainadreissig:cc4r4ccVdOAZx4dh@cluster0.eji0zrv.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
});

// Modelo para o histórico
const historySchema = new mongoose.Schema({
      userId: String,
      action: String,
      ipAddress: String,
      timestamp: { type: Date, default: Date.now }, 
});

const History = mongoose.model("History", historySchema);

// Verificar a conexão com MongoDB
app.get("/api/test-connection", async (req, res) => {
      try {
            await mongoose.connection.db.admin().ping();
            res.status(200).send("Conexão com MongoDB estabelecida com sucesso.");
      } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
            res.status(500).send("Erro ao se conectar ao MongoDB");
      }
});

// Rota para registrar histórico
app.post("/api/history", async (req, res) => {
      try {
            const { userId, action } = req.body;
            const ipAddress = req.clientIp; // Captura o IP do usuário

            const newHistory = new History({ userId, action, ipAddress });
            await newHistory.save();

            res.status(201).send("Histórico registrado com sucesso!");
      } catch (error) {
            console.error("Erro ao registrar histórico:", error);
            res.status(500).send("Erro ao registrar histórico.");
      }
});

// Iniciar o servidor
app.listen(port, () => {
      console.log(`Servidor rodando na porta http://localhost:${port}`);
});
