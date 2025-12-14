require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Necesitamos MessageContent para leer mensajes con prefijo
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

client.once('clientReady', () => {
  console.log(`Bot listo: ${client.user?.tag}`);
});

// Manejo simple de comandos por prefijo: r!hello
const PREFIX = 'r!';
client.on('messageCreate', async (message) => {
  if (message.author?.bot) return;
  if (!message.content || !message.content.startsWith(PREFIX)) return;
  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();
  if (cmd === 'hello') {
    await message.reply(`Hola, ${message.author.username}!`);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;
  if (commandName === 'ping') {
    await interaction.reply('Pong');
  }
});

client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('Error al iniciar sesión del bot:', err);
  process.exit(1);
});
