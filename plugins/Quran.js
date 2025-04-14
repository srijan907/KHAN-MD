const { cmd } = require("../command");

let stopBomb = {};

// TEXT BOMB
cmd({
  pattern: "bomb ?(.*)",
  desc: "Send repeated text messages",
  category: "fun",
  react: "💣",
  filename: __filename,
}, async (conn, m, store, { reply, q, mentionedJid, isGroup }) => {
  const chatId = m.chat;
  const args = q.trim().split(" ");
  const count = parseInt(args[0]);
  const text = args.slice(1).join(" ");

  if (!count || !text) return reply("⚠️ Example: .bomb 30 hello");
  if (count > 150) return reply("❌ Limit 150 messages only.");

  stopBomb[chatId] = false;

  for (let i = 0; i < count; i++) {
    if (stopBomb[chatId]) {
      await reply("⛔ Bombing stopped!");
      break;
    }

    await conn.sendMessage(chatId, {
      text: text,
      mentions: mentionedJid,
    });

    await new Promise(res => setTimeout(res, 300));
  }

  delete stopBomb[chatId];
});


// MEDIA BOMB
cmd({
  pattern: "bombimage ?(.*)",
  alias: ["bombmedia"],
  desc: "Send repeated media messages (image/video/document/sticker)",
  category: "fun",
  react: "📤",
  filename: __filename,
}, async (conn, m, store, { reply, quoted, q }) => {
  const chatId = m.chat;
  const count = parseInt(q.trim());

  if (!quoted || !quoted.message) return reply("⚠️ Reply to a media message.");
  if (!count) return reply("⚠️ Example: .bombimage 10");
  if (count > 150) return reply("❌ Limit 150 allowed.");

  const msgType = Object.keys(quoted.message)[0];
  const mediaMsg = quoted.message[msgType];

  if (!["imageMessage", "videoMessage", "documentMessage", "stickerMessage"].includes(msgType)) {
    return reply("❌ Only media (image/video/document/sticker) allowed.");
  }

  stopBomb[chatId] = false;

  for (let i = 0; i < count; i++) {
    if (stopBomb[chatId]) {
      await reply("⛔ Bombing stopped!");
      break;
    }

    await conn.sendMessage(chatId, {
      [msgType.replace("Message", "").toLowerCase()]: mediaMsg,
    }, { quoted: m });

    await new Promise(res => setTimeout(res, 400));
  }

  delete stopBomb[chatId];
});


// STOP BOMB
cmd({
  pattern: "stopbomb",
  desc: "Stop ongoing bombing",
  category: "fun",
  react: "🛑",
  filename: __filename,
}, async (conn, m, store, { reply }) => {
  const chatId = m.chat;
  stopBomb[chatId] = true;
  reply("🛑 Bombing will stop shortly...");
});
