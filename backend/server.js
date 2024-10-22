//cc4r4ccVdOAZx4dh
//tainadreissig
//200.150.64.234

const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const requestIp = require("request-ip"); 

// Configurações
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(requestIp.mw()); 
// Configurações do MongoDB
const uri =
      "mongodb+srv://tainadreissig14:cc4r4ccVdOAZx4dh@cluster0.z0h59xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// mongodb+srv://tainadreissig:cc4r4ccVdOAZx4dh@cluster0.eji0zrv.mongodb.net/?retryWrites=true&w=majority";
//mongodb+srv://tainadreissig14:<db_password>@cluster0.z0h59xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

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
app.get('/api/test-connection', async (req, res) => {
      try {
            // Código para testar a conexão com o MongoDB
            res.status(200).send('Conexão bem-sucedida');
      } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            res.status(500).send('Erro ao conectar ao MongoDB');
      }
});


// Rota para registrar histórico
app.post("/api/history", async (req, res) => {
      try {
            const { userId, action } = req.body;
            const ipAddress = req.clientIp; 

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
