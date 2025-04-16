const { cmd } = require('../command');
const axios = require('axios');

cmd({
  on: "body"
}, async (conn, m, { isGroup }) => {
  try {
    const MENTION_REPLY = true;
    const BOT_NAME = "〆͎ＭＲ－Ｒａｂｂｉｔ";
    const DESCRIPTION = "POWERED BY 〆͎ＭＲ－Ｒａｂｂｉｔ 🤌💗";
    const MENU_IMAGE_URL = "https://files.catbox.moe/4nmdaq.jpg";

    if (!MENTION_REPLY || !isGroup) return;
    if (!m.mentionedJid || m.mentionedJid.length === 0) return;

    const voiceClips = [
      "https://cdn.ironman.my.id/i/w221l8.mp4",
      "https://cdn.ironman.my.id/i/ove23f.mp4",
      "https://cdn.ironman.my.id/i/4z93dg.mp4"
    ];

    const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
    const botNumber = conn.user.id.split(":")[0] + '@s.whatsapp.net';

    if (m.mentionedJid.includes(botNumber)) {
      const thumbnailRes = await axios.get(MENU_IMAGE_URL, {
        responseType: 'arraybuffer'
      });
      const thumbnailBuffer = Buffer.from(thumbnailRes.data, 'binary');

      await conn.sendMessage(m.chat, {
        audio: { url: randomClip },
        mimetype: 'audio/mp4',
        ptt: true,
        waveform: [99, 0, 99, 0, 99],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: BOT_NAME,
            body: DESCRIPTION,
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: thumbnailBuffer,
            mediaUrl: MENU_IMAGE_URL,
            sourceUrl: "https://wa.me/917439382677?text=〆͎𝐀𝐥𝐨𝐧𝐞-𝐬𝐫𝐞𝐞𝐣𝐚𝐧👀🦋",
            showAdAttribution: false
          }
        }
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    const ownerJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerJid, {
      text: `*Bot Error in Mention Handler:*\n${e.message}`
    });
  }
});
