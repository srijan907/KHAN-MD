const { cmd } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

// 2tagall command
cmd({
    pattern: "2tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.2tagall [message]',
    filename: __filename
}, async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
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
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});

// 2tag command
cmd({
    pattern: "2tag",
    react: "🔊",
    desc: "To tag all members with a message",
    category: "group",
    use: '.2tag Hi',
    filename: __filename
}, async (conn, mek, m, { from, senderNumber, participants, q, reply }) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("❌ Only the bot owner can use this command.");
        }

        if (!q) return reply('*Please provide a message to send.* ℹ️');

        conn.sendMessage(from, { text: q, mentions: participants.map(a => a.id), linkPreview: true }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`❌ *Error Occurred !!*\n\n${e}`);
    }
});

// 2tag me command
cmd({
    pattern: "2tag me",
    react: "🔊",
    desc: "To tag me with a message",
    category: "group",
    use: '.2tag me',
    filename: __filename
}, async (conn, mek, m, { from, senderNumber, participants, q, reply }) => {
    try {
        // No need to check for bot owner here, just allow anyone to use it
        if (!q) return reply('*Please provide a message to send.* ℹ️');

        // Check if 'me' is mentioned and only tag the user who used the command
        if (q.toLowerCase() === 'me' || q.toLowerCase() === 'mee') {
            await conn.sendMessage(from, { text: `@${senderNumber.split('@')[0]}`, mentions: [senderNumber + "@s.whatsapp.net"] }, { quoted: mek });
        } else {
            conn.sendMessage(from, { text: q, mentions: participants.map(a => a.id), linkPreview: true }, { quoted: mek });
        }

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`❌ *Error Occurred !!*\n\n${e}`);
    }
});
