const { Markup } = require("telegraf");
const { MainMenu } = require("./Inline_keyboard");

module.exports = (bot) => {
  bot.start(async (ctx) => {
    await ctx.replyWithChatAction("typing")

    await ctx.reply("Selamat datang di whatsapp Bot ...")

    ctx.reply('-- Daftar Menu --',
      // Markup.inlineKeyboard([
      //   Markup.callbackButton('Buat Session', 'create_session'),
      //   Markup.callbackButton('List Session', 'list_session')
      // ]).extra()
      MainMenu
    )
  });


};
