// Jawad TechX - KHAN MD 
// Dont Remove Credit From File 

const { cmd } = require("../command");

// Safety Configuration
const SAFETY = {
  MAX_JIDS: 20,
  BASE_DELAY: 2000,  // jawad on top 🔝
  EXTRA_DELAY: 4000,  // huh don't copy mine file 
};

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Bulk forward media to groups or inbox",
  category: "owner",
  filename: __filename
}, async (client, message, match, { isOwner }) => {
  try {
    if (!isOwner) return await message.reply("*📛 Owner Only Command*");
    if (!message.quoted) return await message.reply("*🍁 Please reply to a message*");

    // ===== [JID PROCESSING] ===== //
    let jidInput = "";

    if (typeof match === "string") {
      jidInput = match.trim();
    } else if (Array.isArray(match)) {
      jidInput = match.join(" ").trim();
    } else if (match && typeof match === "object") {
      jidInput = match.text || "";
    }

    const rawJids = jidInput.split(/[\s,]+/).filter(jid => jid.trim().length > 0);

    const validJids = rawJids
      .map(jid => {
        jid = jid.trim();
        if (jid.endsWith("@g.us") || jid.endsWith("@s.whatsapp.net")) {
          return jid;
        }
        if (/^\d{18}$/.test(jid)) return `${jid}@g.us`;
        if (/^\d{10,15}$/.test(jid)) return `${jid}@s.whatsapp.net`;
        return null;
      })
      .filter(jid => jid !== null)
      .slice(0, SAFETY.MAX_JIDS);

    if (validJids.length === 0) {
      return await message.reply(
        "❌ No valid JIDs found\n" +
        "Examples:\n" +
        ".fwd 120363411055156472@g.us,919876543210@s.whatsapp.net\n" +
        ".fwd 120363411055156472 919876543210"
      );
    }

    // ===== [MEDIA HANDLING] ===== //
    let messageContent = {};
    const mtype = message.quoted.mtype;

    if (["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(mtype)) {
      const buffer = await message.quoted.download();

      switch (mtype) {
        case "imageMessage":
          messageContent = {
            image: buffer,
            caption: message.quoted.text || '',
            mimetype: message.quoted.mimetype || "image/jpeg"
          };
          break;
        case "videoMessage":
          messageContent = {
            video: buffer,
            caption: message.quoted.text || '',
            mimetype: message.quoted.mimetype || "video/mp4"
          };
          break;
        case "audioMessage":
          messageContent = {
            audio: buffer,
            mimetype: message.quoted.mimetype || "audio/mp4",
            ptt: message.quoted.ptt || false
          };
          break;
        case "stickerMessage":
          messageContent = {
            sticker: buffer,
            mimetype: message.quoted.mimetype || "image/webp"
          };
          break;
        case "documentMessage":
          messageContent = {
            document: buffer,
            mimetype: message.quoted.mimetype || "application/octet-stream",
            fileName: message.quoted.fileName || "document"
          };
          break;
      }
    } else if (mtype === "extendedTextMessage" || mtype === "conversation") {
      messageContent = {
        text: message.quoted.text
      };
    } else {
      try {
        messageContent = message.quoted;
      } catch (e) {
        return await message.reply("❌ Unsupported message type");
      }
    }

    // ===== [SENDING LOOP] ===== //
    let successCount = 0;
    const failedJids = [];

    for (const [index, jid] of validJids.entries()) {
      try {
        await client.sendMessage(jid, messageContent);
        successCount++;

        if ((index + 1) % 10 === 0) {
          await message.reply(`🔄 Sent to ${index + 1}/${validJids.length} targets...`);
        }

        const delayTime = (index + 1) % 10 === 0 ? SAFETY.EXTRA_DELAY : SAFETY.BASE_DELAY;
        await new Promise(resolve => setTimeout(resolve, delayTime));

      } catch (error) {
        failedJids.push(jid.replace(/@(g\.us|s\.whatsapp\.net)/, ''));
        await new Promise(resolve => setTimeout(resolve, SAFETY.BASE_DELAY));
      }
    }

    // ===== [REPORT] ===== //
    let report = `✅ *Forward Complete*\n\n` +
                 `📤 Success: ${successCount}/${validJids.length}\n` +
                 `📦 Content Type: ${mtype.replace('Message', '') || 'text'}\n`;

    if (failedJids.length > 0) {
      report += `\n❌ Failed (${failedJids.length}): ${failedJids.slice(0, 5).join(', ')}`;
      if (failedJids.length > 5) report += ` +${failedJids.length - 5} more`;
    }

    if (rawJids.length > SAFETY.MAX_JIDS) {
      report += `\n⚠️ Note: Limited to first ${SAFETY.MAX_JIDS} JIDs`;
    }

    report += `\n🧭 Sent to Groups & Inbox (if matched)`;

    await message.reply(report);

  } catch (error) {
    console.error("Forward Error:", error);
    await message.reply(
      `💢 Error: ${error.message.substring(0, 100)}\n\n` +
      `Please try again or check:\n` +
      `1. JID formatting\n` +
      `2. Media type support\n` +
      `3. Bot permissions`
    );
  }
});
