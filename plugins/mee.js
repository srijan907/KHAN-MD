const { cmd } = require('../command'); // Command handler
const fs = require('fs');
const path = require('path');
cmd({
    pattern: 'mee', // Command trigger
    alias: ['me', 'myself'], // Other aliases
    desc: 'Mention yourself', // Command description
    category: 'utility', // Command category
    react: '👤', // Emoji reaction
    filename: __filename // Filename
}, async (client, match, message, { from, sender }) => {
    try {
        // Only mention the user
        const mentionMessage = `@${sender.split('@')[0]}`; // Just mention the user

        // Send the response with the user mention
        await client.sendMessage(from, {
            text: mentionMessage,
            mentions: [sender] // Mention the user
        }, { quoted: message });
    } catch (error) {
        console.error("Error:", error);
        await client.sendMessage(from, {
            text: "❌ Something went wrong, please try again later."
        }, { quoted: message });
    }
});
