const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
      origin: "http://10.200.74.46:8080",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(bodyParser.json());
app.use(requestIp.mw());
app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://10.200.74.46:8080");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      next();
});

//const MONGO_URI = "mongodb+srv://tainadreissig14:<tainadreissig14>@cluster0.z0h59xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URI =
      "mongodb+srv://tainadreissig14:tainadreissig14@cluster0.z0h59xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
      
mongoose
      .connect(MONGO_URI)
      .then(() => console.log("Conectado ao MongoDB"))
      .catch((error) => {
            console.error("Erro ao conectar ao MongoDB:", error.message, error.stack);
            process.exit(1);
      });

const historySchema = new mongoose.Schema({
      userId: { type: String, required: true },
      action: { type: String, required: true },
      ipAddress: { type: String, required: false },
      city: { type: String, default: "Cidade não encontrada" },
      state: { type: String, default: "Estado não encontrado" },
      country: { type: String, default: "País não encontrado" },
      timestamp: { type: Date, default: Date.now },
});
const History = mongoose.model("History", historySchema);

async function obterIPeLocalizacao(ipAddress) {
      if (!ipAddress || ipAddress === "127.0.0.1" || ipAddress.startsWith("::")) {
            return {
                  ipAddress: "127.0.0.1",
                  city: "Localhost",
                  state: "Desconhecido",
                  country: "Desconhecido",
            };
      }

      try {
            const response = await axios.get(`https://ipwhois.app/json/${ipAddress}`);
            const ipData = response.data;
            console.log("Dados da API de geolocalização:", ipData);
            if (ipData.success) {
                  return {
                        ipAddress: ipData.ip,
                        city: ipData.city || "Cidade não encontrada",
                        state: ipData.region || "Estado não encontrado",
                        country: ipData.country || "País não encontrado",
                  };
            } else {
                  console.warn("Erro na API de IP:", ipData.message);
                  return {
                        ipAddress,
                        city: "Desconhecida",
                        state: "Desconhecido",
                        country: "Desconhecido",
                  };
            }
      } catch (error) {
            console.error("Erro ao obter IP ou localização:", error.message);
            return {
                  ipAddress,
                  city: "Desconhecida",
                  state: "Desconhecido",
                  country: "Desconhecido",
            };
      }
}

app.get("/api/test-connection", (req, res) =>
      res.send("Conexão bem-sucedida!")
);

app.post("/api/history", async (req, res) => {
      const { userId, action } = req.body;
      console.log("Dados recebidos:", req.body);
      if (!userId || !action) {
            return res.status(400).send("Os campos userId e action são obrigatórios.");
      }
      const ipAddress = req.clientIp || "127.0.0.1";
      const locationData = await obterIPeLocalizacao(ipAddress);
      const newHistory = new History({
            userId,
            action,
            ipAddress: locationData.ipAddress,
            city: locationData.city,
            state: locationData.state,
            country: locationData.country,
      });
      try {
            await newHistory.save();
            res.status(201).send("Histórico registrado com sucesso!");
      } catch (error) {
            console.error("Erro ao registrar histórico:", error);
            res.status(500).send("Erro ao registrar histórico.");
      }
});

app.listen(port, () =>
      console.log(`Servidor rodando em http://localhost:${port}`)
);
