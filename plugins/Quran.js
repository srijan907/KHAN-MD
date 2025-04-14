const { cmd } = require('../command');

let stopBomb = {};

cmd({
    pattern: "bomb ?(.*)",
    alias: [],
    desc: "Bomb text messages with optional mention",
    react: "💣",
    category: "fun",
    filename: __filename
}, async (conn, mek, store, { reply, mentionedJid, sender, isGroup, args, q }) => {
    const match = q;
    const chatId = mek.chat;

    const parts = match.trim().split(" ");
    const count = parseInt(parts[0]);
    const text = parts.slice(1).join(" ");

    const mentionJid = mentionedJid?.[0] || mek.quoted?.sender;

    if (!count || !text) {
        return reply("⚠️ Usage: .bomb [count] [text]\nExample: .bomb 50 hi\nMention or reply to include tag.");
    }

    if (count > 150) {
        return reply("❌ Limit exceeded! Max 150 messages allowed.");
    }

    stopBomb[chatId] = false;

    for (let i = 0; i < count; i++) {
        if (stopBomb[chatId]) {
            await reply("⛔ Bombing Stopped!");
            break;
        }

        await conn.sendMessage(chatId, {
            text: mentionJid ? `${text}` : text,
            mentions: mentionJid ? [mentionJid] : []
        });

        await new Promise(res => setTimeout(res, 200));
    }

    if (!stopBomb[chatId]) {
        await reply("✅ Text Bombing complete!");
    }

    delete stopBomb[chatId];
});


cmd({
    pattern: "bombimage ?(.*)",
    alias: ["bombmedia"],
    desc: "Bomb media messages by replying to an image/video/document",
    react: "📤",
    category: "fun",
    filename: __filename
}, async (conn, mek, store, { reply, quoted, q }) => {
    const count = parseInt(q.trim());
    const chatId = mek.chat;

    if (!quoted || !quoted.message) {
        return reply("⚠️ Please reply to a media message (image, video, document).");
    }

    if (!count || isNaN(count)) {
        return reply("⚠️ Usage: .bombimage [count]\nExample: .bombimage 20");
    }

    if (count > 150) {
        return reply("❌ Limit exceeded! Max 150 allowed.");
    }

    const msgType = Object.keys(quoted.message)[0];
    const mediaMsg = quoted.message[msgType];

    if (!["imageMessage", "videoMessage", "documentMessage", "stickerMessage"].includes(msgType)) {
        return reply("❌ Only media (image/video/document/sticker) bombing is supported.");
    }

    stopBomb[chatId] = false;

    for (let i = 0; i < count; i++) {
        if (stopBomb[chatId]) {
            await reply("⛔ Bombing stopped!");
            break;
        }

        await conn.sendMessage(chatId, { [msgType.replace("Message", "").toLowerCase()]: mediaMsg }, { quoted: mek });
        await new Promise(res => setTimeout(res, 300));
    }

    if (!stopBomb[chatId]) {
        await reply("✅ Media bombing complete!");
    }

    delete stopBomb[chatId];
});


cmd({
    pattern: "stopbomb",
    alias: [],
    desc: "Stop ongoing bombing",
    react: "🛑",
    category: "fun",
    filename: __filename
}, async (conn, mek, store, { reply }) => {
    const chatId = mek.chat;
    stopBomb[chatId] = true;
    await reply("🛑 Bombing will be stopped shortly...");
});
