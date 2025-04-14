cmd({
    pattern: "mee",
    desc: "Tag only the sender without any message.",
    react: "❤️",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { from, isGroup, groupMetadata, reply, sender }) => {
    try {
        // Mention only the sender (User 1) in both group and inbox
        await conn.sendMessage(from, {
            text: `@${sender.split("@")[0]}`,  // Only mention the sender
            mentions: [sender] // Only mention User 1 (sender)
        }, { quoted: m });
    } catch (error) {
        console.error("❌ Error in mee command:", error);
        reply("⚠️ An error occurred while processing the command. Please try again.");
    }
});
