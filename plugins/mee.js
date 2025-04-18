const config = require('../config');
const { cmd } = require('../command');


cmd({
  pattern: 'mee',
  alias: ['Mee'],
  desc: 'Mention user only',
  category: 'fun',
  react: '👤'
}, async (conn, m) => {
  const mentionedUser = m.quoted ? m.quoted.sender : m.sender;

  await conn.sendMessage(m.chat, {
    text: `@${mentionedUser.split('@')[0]}`,
    mentions: [mentionedUser]
  });
});
