/*
> Recode script give credits to›
Giddy Tennor(Trashcore)

📝 | Created By Trashcore
🖥️ | Base Ori By Trashcore 
📌 |Credits Putrazy Xd
📱 |Chat wa:254104245659
👑 |Github: Tennor-modz 
✉️ |Email: giddytennor@gmail.com
*/

const fs = require('fs');
const pino = require('pino');
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode
} = require('@whiskeysockets/baileys');

const handleCommand = require('./case');
const config = require('./config');
const { loadSettings } = require('./settingsManager');
global.settings = loadSettings();

// 🌈 Console helpers
const log = {
  info: (msg) => console.log(chalk.cyanBright(`[INFO] ${msg}`)),
  success: (msg) => console.log(chalk.greenBright(`[SUCCESS] ${msg}`)),
  error: (msg) => console.log(chalk.redBright(`[ERROR] ${msg}`)),
  warn: (msg) => console.log(chalk.yellowBright(`[WARN] ${msg}`))
};

// 🧠 Readline setup
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// helper to save SESSION_ID (base64) to session/creds.json
async function saveSessionFromConfig() {
  try {
    if (!config.SESSION_ID) return false;
    if (!config.SESSION_ID.includes('trashcore~')) return false;

    const base64Data = config.SESSION_ID.split("trashcore~")[1];
    if (!base64Data) return false;

    const sessionData = Buffer.from(base64Data, 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, sessionData);
    console.log(chalk.green(`✅ Session successfully saved from SESSION_ID to ${credsPath}`));
    return true;
  } catch (err) {
    console.error("❌ Failed to save session from config:", err);
    return false;
  }
}

// ================== WhatsApp socket ==================
async function starttrashcore() {
  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) });
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const trashcore = makeWASocket({
    version,
    keepAliveIntervalMs: 10000,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }).child({ level: 'silent' }))
    },
    browser: ["Ubuntu", "Chrome", "20.0.00"]
  });

  trashcore.ev.on('creds.update', saveCreds);

  // Pairing code if not registered
  if (!trashcore.authState.creds.registered && (!config.SESSION_ID || config.SESSION_ID === "")) {
    try {
      const phoneNumber = await question(chalk.yellowBright("[ = ] Enter the WhatsApp number you want to use as a bot (with country code):\n"));
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      console.clear();

      const pairCode = await trashcore.requestPairingCode(cleanNumber);
      log.info(`Enter this code on your phone to pair: ${chalk.green(pairCode)}`);
      log.info("⏳ Wait a few seconds and approve the pairing on your phone...");
    } catch (err) {
      console.error("❌ Pairing prompt failed:", err);
    }
  }

  // Media download helper
  trashcore.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };

  // Connection handling
  trashcore.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      log.error('Connection closed.');
      if (shouldReconnect) setTimeout(() => starttrashcore(), 5000);
    } else if (connection === 'open') {
      const botNumber = trashcore.user.id.split("@")[0];
      log.success(`Bot connected as ${chalk.green(botNumber)}`);
      try { rl.close(); } catch (e) {}

      // Send DM to paired number
      setTimeout(async () => {
        const ownerJid = `${botNumber}@s.whatsapp.net`;
        const message = `
┏━━✅ * 𝐣𝐚𝐲𝐧𝐞 𝐦𝐝 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝!*━━┓
┣👑 *𝕮𝖗𝖊𝖆𝖙𝖔𝖗:* 𝐣𝐚𝐲𝐧𝐞  
┣⚙️ *𝖁𝖊𝖗𝖘𝖎𝖔𝖓:* 𝟏.𝟎.𝟎
┣📦 *𝕿𝖞𝖕𝖊:* 𝕾𝖈𝖗𝖎𝖕𝖙  
┣📱 *𝕻𝖆𝖎𝖗𝖊𝖉 𝕹𝖚𝖒𝖇𝖊𝖗:* ${botNumber}
┣✨ 𝕿𝖞𝖕𝖊 *𝐦𝐞𝐧𝐮* 𝖙𝖔 𝖘𝖊𝖊 𝖈𝖔𝖒𝖒𝖆𝖓𝖉𝖘!
┕━━━━━━━━━━━━━━━━━━━━━━━━━┛
`;
        try {
          await trashcore.sendMessage(ownerJid, { text: message });
          log.success(`Sent DM to paired number (${botNumber})`);
        } catch (err) {
          log.error(`Failed to send DM: ${err}`);
        }
      }, 2000);
                 try {
     trashcore.groupAcceptInvite('JkHHn6bUFHdCXi4d3ZRiKf');
    console.log(chalk.green('✅ Auto-joined WhatsApp group successfully'));
} catch (e) {
    console.log(chalk.red(`❌ Failed to join WhatsApp group: ${e.message || e}`));
}
                

      trashcore.isPublic = true;
    }
  });


  // ================== Auto read/typing/record ==================
  async function autoReadPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autoread?.enabled || from.endsWith("@g.us")) return;
    await trashcore.readMessages([m.key]).catch(console.error);
  }

  async function autoRecordPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autorecord?.enabled || from.endsWith("@g.us")) return;
    await trashcore.sendPresenceUpdate("recording", from).catch(console.error);
  }

  async function autoTypingPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autotyping?.enabled || from.endsWith("@g.us")) return;
    await trashcore.sendPresenceUpdate("composing", from).catch(console.error);
  }

  trashcore.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    await autoReadPrivate(m);
    await autoRecordPrivate(m);
    await autoTypingPrivate(m);


trashcore.ev.on('messages.upsert', async chatUpdate => {
        	if (config.STATUS_VIEW){
          let  mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            	await trashcore.readMessages([mek.key]) }
            }
    })
trashcore.ev.on('group-participants.update', async (update) => {
  try {
    const { id, participants, action } = update;
    const chatId = id;
    const botNumber = trashcore.user.id.split(":")[0] + "@s.whatsapp.net";

    // Load Settings
    const settings = loadSettings();

    // 🧩 Handle AntiPromote
    if (action === 'promote' && settings.antipromote?.[chatId]?.enabled) {
      const groupSettings = settings.antipromote[chatId];

      for (const user of participants) {
        if (user !== botNumber) {
          await trashcore.sendMessage(chatId, {
            text: `🚫 *Promotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
            mentions: [user],
          });

          if (groupSettings.mode === "revert") {
            await trashcore.groupParticipantsUpdate(chatId, [user], "demote");
          } else if (groupSettings.mode === "kick") {
            await trashcore.groupParticipantsUpdate(chatId, [user], "remove");
          }
        }
      }
    }

    // 🧩 Handle AntiDemote
    if (action === 'demote' && settings.antidemote?.[chatId]?.enabled) {
      const groupSettings = settings.antidemote[chatId];

      for (const user of participants) {
        if (user !== botNumber) {
          await trashcore.sendMessage(chatId, {
            text: `🚫 *Demotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
            mentions: [user],
          });

          if (groupSettings.mode === "revert") {
            await trashcore.groupParticipantsUpdate(chatId, [user], "promote");
          } else if (groupSettings.mode === "kick") {
            await trashcore.groupParticipantsUpdate(chatId, [user], "remove");
          }
        }
      }
    }

  } catch (err) {
    console.error("AntiPromote/AntiDemote error:", err);
  }
});
    // Pass to command handler
const prefixSettingsPath = './library/prefixSettings.json';

// Load prefix dynamically
let prefixSettings = fs.existsSync(prefixSettingsPath)
  ? JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'))
  : { prefix: '.', defaultPrefix: '.' };

let prefix = prefixSettings.prefix || ''; // fallback to '' if no prefix

const from = m.key.remoteJid;
const sender = m.key.participant || from;
const isGroup = from.endsWith('@g.us');
const botNumber = trashcore.user.id.split(":")[0] + "@s.whatsapp.net";

// Extract message body
let body =
  m.message.conversation ||
  m.message.extendedTextMessage?.text ||
  m.message.imageMessage?.caption ||
  m.message.videoMessage?.caption ||
  m.message.documentMessage?.caption || '';
body = body.trim();
if (!body) return;

// Skip if prefix is required and message doesn't start with it
if (prefix !== '' && !body.startsWith(prefix)) return;

// Remove prefix if present
const bodyWithoutPrefix = prefix === '' ? body : body.slice(prefix.length);

// Split command and arguments
const args = bodyWithoutPrefix.trim().split(/ +/);
const command = args.shift().toLowerCase();
    const groupMeta = isGroup ? await trashcore.groupMetadata(from).catch(() => null) : null;
    const groupAdmins = groupMeta ? groupMeta.participants.filter(p => p.admin).map(p => p.id) : [];
    const isAdmin = isGroup ? groupAdmins.includes(sender) : false;

    const wrappedMsg = {
      ...m,
      chat: from,
      sender,
      isGroup,
      body,
      type: Object.keys(m.message)[0],
      quoted: m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null,
      reply: (text) => trashcore.sendMessage(from, { text }, { quoted: m })
    };

    await handleCommand(trashcore, wrappedMsg, command, args, isGroup, isAdmin, groupAdmins, groupMeta, jidDecode, config);
  });

  return trashcore;
}

// ================== Startup orchestration ==================
async function tylor() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (fs.existsSync(credsPath)) {
      console.log(chalk.yellowBright("✅ Existing session found. Starting bot without pairing..."));
      await starttrashcore();
      return;
    }

    if (config.SESSION_ID && config.SESSION_ID.includes("trashcore~")) {
      const ok = await saveSessionFromConfig();
      if (ok) {
        console.log(chalk.greenBright("✅ Session ID loaded and saved successfully. Starting bot..."));
        await starttrashcore();
        return;
      } else {
        console.log(chalk.redBright("⚠️ SESSION_ID found but failed to save it. Falling back to pairing..."));
      }
    }

    console.log(chalk.redBright("⚠️ No valid session found! You’ll need to pair a new number."));
    await starttrashcore();

  } catch (error) {
    console.error(chalk.red("❌ Error initializing session:"), error);
  }
}

tylor();