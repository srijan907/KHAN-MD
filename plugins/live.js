const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "live",
    react: "✅",
    desc: "Check if the bot is online.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG || "https://files.catbox.moe/4nmdaq.jpg" }, //
            caption: `*Hello there RABBIT-XMD User!* 👋🏻

> Simple, Clean & Packed With Features — Say hello to **RABBIT-XMD** WhatsApp Bot!

*Thanks for choosing RABBIT-XMD!*  

──────────────
*Channel:*  
⤷ https://whatsapp.com/channel/0029Vb3NN9cGk1FpTI1rH31Z

*GitHub Repo:*  
⤷ https://github.com/Mr-Rabbit-XMD

*Prefix:* \`${config.PREFIX || '.'}\`

──────────────  
© Powered by *〆͎ＭＲ－Ｒａｂｂｉｔ* 🤍`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply("Error: " + e);
    }
});
