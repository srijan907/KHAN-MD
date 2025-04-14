const { cmd } = require('../command');

cmd({
  pattern: "2tagall",
  react: "🔊",
  alias: ["2gc_tagall"],
  desc: "To Tag all Members",
  category: "group",
  use: '.2tagall [message]',
  filename: __filename
}, async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, body }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const botOwner = conn.user.id.split(":")[0];
    const senderJid = senderNumber + "@s.whatsapp.net";

    if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
      return reply("❌ Only group admins or the bot owner can use this command.");
    }

    let groupInfo = await conn.groupMetadata(from).catch(() => null);
    if (!groupInfo) return reply("❌ Failed to fetch group information.");

    let groupName = groupInfo.subject || "Unknown Group";
    let totalMembers = participants ? participants.length : 0;
    if (totalMembers === 0) return reply("❌ No members found in this group.");

    let emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
    let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    let message = body.slice(body.indexOf(command) + command.length).trim();
    if (!message) message = "Attention Everyone"; // Default message

    let teks = `▢ Group : *${groupName}*\n▢ Members : *${totalMembers}*\n▢ Message: *${message}*\n\n┌───⊷ *MENTIONS*\n`;

    for (let mem of participants) {
      if (!mem.id) continue; // Prevent undefined errors
      teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
    }

    teks += "└──✪ 〆͎ＭＲ－Ｒａｂｂｉｔ ✪──";

    conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

  } catch (e) {
    console.error("2TagAll Error:", e);
    reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
  }
});

cmd({
  pattern: "2tag",
  react: "🔊",
  desc: "To tag all members with a message",
  category: "group",
  use: '.2tag Hi',
  filename: __filename
}, async (conn, mek, m, { from, senderNumber, participants, q, reply }) => {
  try {
    const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
    if (senderNumber !== botOwner) {
      return reply("Only the bot owner can use this command.");
    }

    if (!q) return reply('*Please provide a message to send.* ℹ️');

    conn.sendMessage(from, { text: q, mentions: participants.map(a => a.id), linkPreview: true }, { quoted: mek });

  } catch (e) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    console.log(e);
    reply(`❌ *Error Occurred !!*\n\n${e}`);
  }
});

cmd({
  pattern: "2tagme",
  desc: "Tag yourself in a group",
  category: "group",
  react: "🔊",
  filename: __filename,
}, async (conn, m, store, { from, senderNumber, participants, reply }) => {
  try {
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
      return reply("❌ Only the bot owner can use this command.");
    }

    const senderJid = senderNumber + "@s.whatsapp.net";
    if (!participants.some(p => p.id === senderJid)) {
      return reply("❌ You are not in this group.");
    }

    conn.sendMessage(from, { text: `@${senderNumber}`, mentions: [senderJid] }, { quoted: m });
  } catch (e) {
    console.error("2TagMe Error:", e);
    reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
  }
});
