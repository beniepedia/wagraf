const { Router } = require("express");
const whatsapp = require("wa-multi-session");
const { formatNumber } = require("../Helpers");

const MainRoutes = Router();

MainRoutes.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

MainRoutes.post("/send-message", async (req, res, next) => {

  try {
    const { text, to } = req.body
    const sessionId = req.headers.session

    if (!to || !text || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Parameter",
      });
    }

    if (!whatsapp.getSession(sessionId)) {
      return res.status(404).json({
        success: false,
        message: "Session not Found!",
      });
    }

    const send = await whatsapp.sendTextMessage({
      sessionId,
      to: formatNumber(to),
      text: text,
    });

    res.status(200).json({
      success: true,
      message: "Message send successfully",
      data: {
        id: send?.key?.id,
        status: send?.status,
        message: send?.message?.extendedTextMessage?.text || "Not Text",
        remoteJid: send?.key?.remoteJid,
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upps... Error send message to whatsapp, please try again."
    })
  }
  res.end()
})

MainRoutes.post("/send-media", async (req, res) => {

  try {
    const { text, to, media } = req.body
    const sessionId = req.headers.session

    if (!to || !media || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Parameter",
      });
    }

    if (!whatsapp.getSession(sessionId)) {
      return res.status(404).json({
        success: false,
        message: "Session not Found!",
      });
    }

    const send = await whatsapp.sendImage({
      sessionId, // session ID
      to: formatNumber(to), // always add country code (ex: 62)
      text: text || '', // message you want to send,
      media: media
    });

    res.status(200).json({
      success: true,
      message: "Message send successfully",
      data: {
        id: send?.key?.id,
        status: send?.status,
        message: send?.message?.extendedTextMessage?.text || "Not Text",
        remoteJid: send?.key?.remoteJid,
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upps... Error send message to whatsapp, please try again."
    })
  }

  res.end()
})
module.exports = MainRoutes;
