const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping2",
    alias: ["speed","pong"],use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply, }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        const text = `> *Ｒａｂｂｉｔ-MD SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406899332269@newsletter',
                    newsletterName: "〆͎ＭＲ－Ｒａｂｂｉｔ",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

// ping2 

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "🍂",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '*PINGING...*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        await conn.sendMessage(from, { text: `*𝕻𝖔𝖓𝖌 : ${ping}ms*` }, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

// ping3 

cmd({
  pattern: "ping3",
  desc: "Ping with voice response",
  category: "main",
  react: "🏓",
  filename: __filename
},
async (conn, m, { from, reply }) => {
  try {
    const start = Date.now()
    const temp = await conn.sendMessage(from, { text: '*Pinging...*' })
    const ping = Date.now() - start

    const audioUrl = "https://cdn.ironman.my.id/i/44ado5.mp4"; // 

    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: true,
      waveform: [99, 0, 99, 0, 99],
      contextInfo: {
        forwardingScore: 9999,
        isForwarded: false,
        externalAdReply: {
          title: `Ping: ${ping}ms`,
          body: "Voice Ping by Rabbit",
          mediaType: 4,
          thumbnailUrl: "https://files.catbox.moe/4nmdaq.jpg",
          mediaUrl: "https://wa.me/917439382677?text=Hi",
          sourceUrl: "https://wa.me/917439382677?text=Hi",
          showAdAttribution: true
        }
      }
    }, { quoted: temp })

  } catch (err) {
    console.error(err)
    reply("Something went wrong.")
  }
})
