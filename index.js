require('dotenv').config()
const express = require("express");
const TelegramBot = require("./libs/TelegramBot")

const MainRoutes = require("./router/MainRoutes");
const whatsapp = require("wa-multi-session");

const WEBHOOK_URL = process.env.WEBHOOK_URL || false
const SECRET_PATH = process.env.SECRET_PATH || false
const PORT = Number(process.env.PORT || 8080)

const app = express();

app.use(express.json());
app.use(MainRoutes);

// if (process.env.NODE_ENV == "production") {
//     TelegramBot.telegram.setWebhook(WEBHOOK_URL)
//     app.use(TelegramBot.webhookCallback(SECRET_PATH))
// }


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
});

whatsapp.loadSessionsFromStorage()

TelegramBot.launch();
