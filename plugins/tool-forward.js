
const { cmd } = require("../command");
const _0x5b3f=["MAX_JIDS","BASE_DELAY","EXTRA_DELAY"];const SAFETY={[ _0x5b3f[0]]:20,[ _0x5b3f[1]]:2000,[ _0x5b3f[2]]:4000};

cmd({
pattern:"forward",alias:["fwd"],desc:"Bulk forward media to groups",category:"owner",filename:__filename
},async(client,message,match,{isOwner})=>{
 try{
 if(!isOwner)return await message.reply("*📛 Owner Only Command*");
 if(!message.quoted)return await message.reply("*🍁 Please reply to a message*");
 let jidInput="";
 if(typeof match==="string"){jidInput=match.trim();}
 else if(Array.isArray(match)){jidInput=match.join(" ").trim();}
 else if(match&&typeof match==="object"){jidInput=match.text||"";}
 const rawJids=jidInput.split(/[\s,]+/).filter(jid=>jid.trim().length>0);
 const validJids=rawJids.map(jid=>{
 const cleanJid=jid.replace(/@g\.us$/i,"").replace(/@s\.whatsapp\.net$/i,"");
 return /^\d+$/.test(cleanJid)?`${cleanJid}${jid.includes("@s.whatsapp.net")?"@s.whatsapp.net":"@g.us"}`:null;
 }).filter(jid=>jid!==null).slice(0,SAFETY.MAX_JIDS);

 if(validJids.length===0){
 return await message.reply("❌ No valid JIDs found\nExamples:\n.fwd 1203xxx@g.us\n.fwd 8801xxxx@s.whatsapp.net");
 }

 let messageContent={};
 const mtype=message.quoted.mtype;

 if(["imageMessage","videoMessage","audioMessage","stickerMessage","documentMessage"].includes(mtype)){
 const buffer=await message.quoted.download();
 switch(mtype){
 case "imageMessage":messageContent={image:buffer,caption:message.quoted.text||'',mimetype:message.quoted.mimetype||"image/jpeg"};break;
 case "videoMessage":messageContent={video:buffer,caption:message.quoted.text||'',mimetype:message.quoted.mimetype||"video/mp4"};break;
 case "audioMessage":messageContent={audio:buffer,mimetype:message.quoted.mimetype||"audio/mp4",ptt:message.quoted.ptt||false};break;
 case "stickerMessage":messageContent={sticker:buffer,mimetype:message.quoted.mimetype||"image/webp"};break;
 case "documentMessage":messageContent={document:buffer,mimetype:message.quoted.mimetype||"application/octet-stream",fileName:message.quoted.fileName||"document"};break;
 }
 }else if(mtype==="extendedTextMessage"||mtype==="conversation"){
 messageContent={text:message.quoted.text};
 }else{
 try{messageContent=message.quoted;}catch(e){return await message.reply("❌ Unsupported message type");}
 }

 let successCount=0;
 const failedJids=[];

 for(const[index,jid]of validJids.entries()){
 try{
 await client.sendMessage(jid,messageContent);
 successCount++;
 if((index+1)%10===0){await message.reply(`🔄 Sent to ${index+1}/${validJids.length}...`);}
 const delayTime=(index+1)%10===0?SAFETY.EXTRA_DELAY:SAFETY.BASE_DELAY;
 await new Promise(resolve=>setTimeout(resolve,delayTime));
 }catch(error){
 failedJids.push(jid.replace(/@.+$/,""));
 await new Promise(resolve=>setTimeout(resolve,SAFETY.BASE_DELAY));
 }
 }

 let report=`✅ *Forward Complete*\n\n📤 Success: ${successCount}/${validJids.length}\n📦 Content Type: ${mtype.replace("Message","")||"text"}\n`;
 if(failedJids.length>0){
 report+=`\n❌ Failed (${failedJids.length}): ${failedJids.slice(0,5).join(", ")}`;
 if(failedJids.length>5)report+=` +${failedJids.length-5} more`;
 }
 if(rawJids.length>SAFETY.MAX_JIDS){report+=`\n⚠️ Note: Limited to first ${SAFETY.MAX_JIDS} JIDs`;}

 await message.reply(report);

 }catch(error){
 console.error("Forward Error:",error);
 await message.reply(`💢 Error: ${error.message.substring(0,100)}\n\nPlease check:\n1. JID formatting\n2. Media type\n3. Bot permissions`);
 }
});
