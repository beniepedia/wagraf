const { Telegraf, Markup, Extra } = require("telegraf");
const startCommand = require("../commands/Start");
const whatsapp = require("wa-multi-session");
const qrcode = require("qrcode");
const { parseImageData } = require("../Helpers");
const { MainMenu, BackButton } = require("../commands/Inline_keyboard");
const { Create, ListSession } = require("../commands/ActionCommand");

const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = new Telegraf(TOKEN);

startCommand(TelegramBot);

const sessions = new Map()

let isWaitingUser = false

TelegramBot.action('main_menu', (ctx) => {
  isWaitingUser = false
  ctx.deleteMessage()
  ctx.reply('-- Daftar Menu --', MainMenu)

});


// buat session whatsapp
Create(TelegramBot, sessions, isWaitingUser)

ListSession(TelegramBot)

let message_id = undefined
whatsapp.onQRUpdated(async ({ sessionId, qr }) => {

  const ctx = await sessions.get(sessionId)
  const from = await ctx.getChat()

  ctx.retries++

  if (ctx.retries > 1) {
    TelegramBot.telegram.deleteMessage(from.id, message_id)
  }


  if (ctx.retries >= 3) {
    TelegramBot.telegram.sendMessage(from.id, "Session has been deleted, please create again!", BackButton("⏪ MENU"))

    whatsapp.deleteSession(sessionId)
    sessions.delete(sessionId)
    message_id = undefined
    return;
  }

  const qrCode = await qrcode.toDataURL(qr);
  const base64 = parseImageData(qrCode);

  const sendQR = await ctx.replyWithPhoto({ source: Buffer.from(base64.data, "base64") }, {
    caption: "* SCAN QR CODE INI *",
    parse_mode: "MarkdownV2"
  });

  message_id = sendQR.message_id

})


whatsapp.onConnected(async (sessionId) => {
  const ctx = await sessions.get(sessionId)
  const from = (await ctx?.getChat()) || undefined

  if (!ctx == undefined) {
    TelegramBot.telegram.deleteMessage(from.id, message_id)
    ctx.reply(`${sessionId} : Connected`)
  }
  message_id = undefined
})

whatsapp.onDisconnected((sessionId) => {
  whatsapp.deleteSession(sessionId)
})



module.exports = TelegramBot;
