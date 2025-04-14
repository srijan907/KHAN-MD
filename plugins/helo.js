const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: 'mee',
  alias: ['Mee'],
  desc: 'Mention user and send voice note',
  category: 'fun',
  react: '🎙️'
}, async (conn, m, { reply }) => {
  const voiceClips = [
    "https://cdn.ironman.my.id/i/4sgzva.mp4",
    "https://cdn.ironman.my.id/i/ove23f.mp4",
    "https://cdn.ironman.my.id/i/w221l8.mp4",
    "https://cdn.ironman.my.id/i/m9gwk0.mp4",
    "https://cdn.ironman.my.id/i/1bacpt.mp4",
    "https://cdn.ironman.my.id/i/lbr8of.mp4",
    "https://cdn.ironman.my.id/i/j8r3ux.mp4",
    "https://cdn.ironman.my.id/i/hqcehi.mp4",
    "https://cdn.ironman.my.id/i/hqcehi.mp4"
  ];

  const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
  const mentionedUser = m.sender;

  // 🧷 Mention user with text first
  await conn.sendMessage(m.chat, {
    text: `@${mentionedUser.split('@')[0]}`,
    mentions: [mentionedUser]
  });

  // 🎙️ Send Voice Note with Audio Type and Waveform + ExternalAdReply
  await conn.sendMessage(m.chat, {
    audio: { url: randomClip },
    mimetype: 'audio/mp4',
    ptt: true,
    waveform: [99, 0, 99, 0, 99],
    contextInfo: {
      forwardingScore: 55555,
      isForwarded: false,
      externalAdReply: {
        title: "〆͎ＭＲ－Ｒａｂｂｉｔ",
        body: "Pᴏᴡᴇʀᴇᴅ Bʏ 〆͎ＭＲ－Ｒａｂｂｉｔ",
        mediaType: 4,
        thumbnailUrl: "https://files.catbox.moe/4nmdaq.jpg",
        mediaUrl: "https://wa.me/917439382677?text=〆͎𝐀𝐥𝐨𝐧𝐞-𝐬𝐫𝐞𝐞𝐣𝐚𝐧👀🦋",
        sourceUrl: "https://wa.me/917439382677?text=〆͎𝐀𝐥𝐨𝐧𝐞-𝐬𝐫𝐞𝐞𝐣𝐚𝐧👀🦋",
        showAdAttribution: true
      }
    },
    mentions: [mentionedUser]
  });
});
//
