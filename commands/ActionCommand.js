const whatsapp = require("wa-multi-session")
const { BackButton } = require("./Inline_keyboard")


const Create = (bot, sessions, isWaitingUser) => {
    bot.action("create_session", async (ctx) => {
        try {
            await ctx.reply('Masukkan nama session : ',
                BackButton("⏪ Kembali ke menu")
            )

            ctx.deleteMessage()
            isWaitingUser = true
            // Menunggu input dari pengguna
            bot.on('text', async (ctx) => {
                if (isWaitingUser) {
                    const userInput = await ctx.message.text;
                    const inputFilter = userInput.replace(/[^A-Za-z]/g, "")
                    await whatsapp.startSession(inputFilter)
                    sessions.set(inputFilter, { ...ctx, retries: 0 })
                    isWaitingUser = false
                }
            });
        } catch (err) {
            ctx.reply("Adalah kesalahan...")
        }

    })
}

const ListSession = (bot) => {
    const list_session = whatsapp.getAllSession();
    bot.action("list_session", (ctx) => {
        ctx.reply(list_session)
    })
}

module.exports = { Create, ListSession }