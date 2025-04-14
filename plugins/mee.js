const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");
const config = require("../config");
cmd({
    pattern: "mee",
    desc: "Tag only the sender without any message.",
    react: "❤️",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { from, isGroup, groupMetadata, reply, sender }) => {
    try {
        // Only mention User 1 (sender) in both group and inbox
        await conn.sendMessage(from, {
            text: `@${sender.split("@")[0]}`,  // Only mention the sender
            mentions: [sender] // Only mention User 1 (sender)
        });
    } catch (error) {
        console.error("❌ Error in mee command:", error);
        reply("⚠️ An error occurred while processing the command. Please try again.");
    }
});
