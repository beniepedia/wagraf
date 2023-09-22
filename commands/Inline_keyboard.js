const { Markup } = require("telegraf");

const MainMenu = Markup.inlineKeyboard([
    [Markup.callbackButton("✅ Tambah Session", "create_session")],
    [Markup.callbackButton("📒 List Session", "list_session")]
]).extra()


const BackButton = (text = "Back") => {
    return Markup.inlineKeyboard([
        Markup.callbackButton(text, "main_menu")
    ]).extra()
}


module.exports = { MainMenu, BackButton }