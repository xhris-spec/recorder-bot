require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const prism = require('prism-media');
const { convertSessionPCMtoWAV } = require('./audioConverter');

// Necesitamos MessageContent para leer mensajes con prefijo
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

// Directorio para almacenar audios
const AUDIO_DIR = path.join(__dirname, '..', 'recordings');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Map para rastrear sesiones de grabación por guild
const recordingSessions = new Map();

client.once('clientReady', () => {
  console.log(`Bot listo: ${client.user?.tag}`);
});

// Manejo de comandos por prefijo
const PREFIX = 'r!';
client.on('messageCreate', async (message) => {
  if (message.author?.bot) return;
  if (!message.content || !message.content.startsWith(PREFIX)) return;
  
  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (cmd === 'record') {
    // Verificar que el usuario está en un canal de voz
    if (!message.member?.voice.channel) {
      await message.reply('❌ Debes estar en un canal de voz para usar este comando.');
      return;
    }

    const isRecording = recordingSessions.has(message.guildId);

    // Crear botones
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('record_start')
          .setLabel('▶️ Start')
          .setStyle(ButtonStyle.Success)
          .setDisabled(isRecording), // Deshabilitar si ya está grabando
        new ButtonBuilder()
          .setCustomId('record_stop')
          .setLabel('⏹️ Stop')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(!isRecording) // Deshabilitar si no está grabando
      );

    const status = isRecording ? '🔴 **Grabación activa**' : '⚫ **Sin grabar**';
    await message.reply({
      content: `${status}\n\nPulsa los botones para controlar la grabación:`,
      components: [row]
    });
  }
  else if (cmd === 'recordings') {
    // Listar grabaciones disponibles
    if (!fs.existsSync(AUDIO_DIR)) {
      await message.reply('📁 No hay grabaciones disponibles.');
      return;
    }

    const sessions = fs.readdirSync(AUDIO_DIR).filter(f => {
      return fs.statSync(path.join(AUDIO_DIR, f)).isDirectory();
    });

    if (sessions.length === 0) {
      await message.reply('📁 No hay grabaciones disponibles.');
      return;
    }

    const list = sessions.slice(-10).map((session, idx) => {
      const sessionPath = path.join(AUDIO_DIR, session);
      const wavFiles = fs.readdirSync(sessionPath).filter(f => f.endsWith('.wav')).length;
      return `${idx + 1}. \`${session}\` (${wavFiles} archivos)`;
    }).join('\n');

    // Crear botones de descarga para las últimas 5 sesiones
    const recentSessions = sessions.slice(-5);
    const rows = [];
    
    for (let i = 0; i < recentSessions.length; i += 5) {
      const buttons = recentSessions.slice(i, i + 5).map((session) => 
        new ButtonBuilder()
          .setCustomId(`download_${session}`)
          .setLabel(`📥 ${session.substring(0, 15)}...`)
          .setStyle(ButtonStyle.Primary)
      );
      rows.push(new ActionRowBuilder().addComponents(buttons));
    }

    await message.reply({
      content: `📁 **Últimas grabaciones:**\n${list}\n\n**Pulsa un botón para descargar:**`,
      components: rows
    });
  }
  else if (cmd === 'hello') {
    await message.reply(`Hola, ${message.author.username}!`);
  }
  else if (cmd === 'help' || cmd === 'commands') {
    const helpMessage = `
📋 **Comandos disponibles:**

🎙️ **Grabación:**
\`r!record\` - Mostrar controles de grabación (Start/Stop)

📁 **Gestión de archivos:**
\`r!recordings\` - Listar y descargar grabaciones anteriores

💬 **Otros:**
\`r!hello\` - Saludo
\`r!help\` - Mostrar este mensaje

**Nota:** Debes estar en un canal de voz para usar \`r!record\`
    `;
    await message.reply(helpMessage);
  }
  else {
    // Comando desconocido
    await message.reply(`❌ Comando \`${cmd}\` no reconocido.\n\nUsa \`r!help\` para ver los comandos disponibles.`);
  }
});

// Manejo de botones
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId, guildId, member } = interaction;

  // Handler para botones de descarga
  if (customId.startsWith('download_')) {
    const sessionId = customId.replace('download_', '');
    const sessionPath = path.join(AUDIO_DIR, sessionId);

    if (!fs.existsSync(sessionPath)) {
      await interaction.reply({
        content: '❌ Grabación no encontrada.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const wavFiles = fs.readdirSync(sessionPath).filter(f => f.endsWith('.wav'));
    if (wavFiles.length === 0) {
      await interaction.reply({
        content: '❌ No hay archivos WAV en esta grabación.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const wavFile = path.join(sessionPath, wavFiles[0]);
    const fileSize = fs.statSync(wavFile).size;

    if (fileSize > 8 * 1024 * 1024) {
      await interaction.reply({
        content: `❌ El archivo es demasiado grande para Discord (${(fileSize / 1024 / 1024).toFixed(2)}MB > 8MB).\n\nUsa \`r!download ${sessionId}\` en el servidor donde está alojado el bot.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    try {
      await interaction.reply({
        files: [wavFile],
        content: `📥 **Descarga:** \`${sessionId}\`\n📄 Archivo: \`${wavFiles[0]}\` (${(fileSize / 1024 / 1024).toFixed(2)}MB)`,
        flags: MessageFlags.Ephemeral
      });
    } catch (error) {
      console.error('Error al descargar:', error);
      await interaction.reply({
        content: '❌ Error al descargar el archivo.',
        flags: MessageFlags.Ephemeral
      });
    }
    return;
  }

  // Verificar que el usuario está en un canal de voz
  if (!member?.voice.channel) {
    await interaction.reply({
      content: '❌ Debes estar en un canal de voz para usar este comando.',
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  if (customId === 'record_start') {
    // Evitar grabar si ya hay una sesión activa
    if (recordingSessions.has(guildId)) {
      await interaction.reply({
        content: '⚠️ Ya hay una grabación activa en este servidor.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    try {
      const voiceChannel = member.voice.channel;

      // Unirse al canal de voz
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const sessionId = `${guildId}-${Date.now()}`;
      const sessionDir = path.join(AUDIO_DIR, sessionId);
      
      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      const userStreams = new Map();
      let isReady = false;

      // Esperar a que la conexión esté lista
      connection.on('stateChange', (oldState, newState) => {
        console.log(`[VOICE] Estado: ${oldState.status} → ${newState.status}`);
        if (newState.status === 'ready' && !isReady) {
          isReady = true;
          console.log('[VOICE] Conexión lista, suscribiendo a usuarios...');
          setupReceiver();
        }
      });

      // Configurar receiver cuando esté listo
      const setupReceiver = () => {
        const receiver = connection.receiver;
        if (!receiver) {
          console.error('[VOICE] Receiver no disponible');
          return;
        }

        // Crear archivo único para toda la llamada (PCM)
        const mixedFilePath = path.join(sessionDir, 'call-mixed.pcm');
        const mixedWriteStream = fs.createWriteStream(mixedFilePath);
        let totalBytesWritten = 0;

        // Obtener lista de usuarios en el canal
        const voiceChannel = member.voice.channel;
        const members = voiceChannel.members;

        console.log(`[RECORD] Grabando ${members.size} usuarios`);

        members.forEach((channelMember) => {
          if (channelMember.user.bot) return; // No grabar bots
          
          const userId = channelMember.user.id;
          if (!userStreams.has(userId)) {
            try {
              // Suscribirse al audio opus
              const opusStream = receiver.subscribe(userId, {
                end: {
                  behavior: 0 // Manual
                }
              });

              // Decodificar opus → PCM usando prism-media con opusscript
              const decoder = new prism.opus.Decoder({
                rate: 48000,
                channels: 2,
                frameSize: 960
              });

              let userBytesWritten = 0;

              // Pipe: opus → decoder → PCM
              opusStream.pipe(decoder);

              decoder.on('data', (pcmChunk) => {
                mixedWriteStream.write(pcmChunk);
                userBytesWritten += pcmChunk.length;
                totalBytesWritten += pcmChunk.length;
              });

              decoder.on('error', (error) => {
                console.error(`[RECORD] Error decodificando ${channelMember.user.username}:`, error.message);
              });

              opusStream.on('error', (error) => {
                console.error(`[RECORD] Error opus ${channelMember.user.username}:`, error.message);
              });

              userStreams.set(userId, { 
                opusStream,
                decoder,
                username: channelMember.user.username,
                bytesWritten: userBytesWritten
              });
              
              console.log(`[RECORD] Suscrito a ${channelMember.user.username} (${userId})`);
            } catch (error) {
              console.error(`[RECORD] Error grabando ${userId}:`, error.message);
            }
          }
        });

        // Log de progreso
        const progressInterval = setInterval(() => {
          console.log(`[RECORD] Total PCM grabado: ${totalBytesWritten} bytes`);
        }, 5000);

        // Guardar referencias en sesión
        const session = recordingSessions.get(guildId);
        session.mixedWriteStream = mixedWriteStream;
        session.progressInterval = progressInterval;
        session.mixedFilePath = mixedFilePath;
        session.totalBytesWritten = () => totalBytesWritten;
      };

      // Manejo de errores de conexión
      connection.on('error', (error) => {
        console.error('[VOICE] Error de conexión:', error.message);
      });

      recordingSessions.set(guildId, {
        connection,
        userStreams,
        sessionId,
        sessionDir,
        startTime: new Date(),
        messageId: interaction.message.id
      });

      await interaction.reply({
        content: `✅ Conectando a <#${voiceChannel.id}>...\n⏳ Esperando micrófono listo...`,
        flags: MessageFlags.Ephemeral
      });

      // Actualizar el mensaje de control con botones
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('record_start')
            .setLabel('▶️ Start')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('record_stop')
            .setLabel('⏹️ Stop')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false)
        );

      await interaction.message.edit({
        content: '🔴 **Grabación activa**\n\nPulsa los botones para controlar la grabación:',
        components: [row]
      });

    } catch (error) {
      console.error('Error al unirse al canal:', error);
      await interaction.reply({
        content: '❌ Error al unirse al canal de voz.',
        flags: MessageFlags.Ephemeral
      });
    }
  }

  if (customId === 'record_stop') {
    const session = recordingSessions.get(guildId);
    
    if (!session) {
      await interaction.reply({
        content: '❌ No hay grabación activa en este servidor.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    try {
      // Detener intervalo de progreso
      if (session.progressInterval) {
        clearInterval(session.progressInterval);
      }

      // Cerrar streams opus
      for (const [userId, userData] of session.userStreams) {
        if (userData.opusStream) userData.opusStream.destroy();
        if (userData.decoder) userData.decoder.destroy();
        console.log(`[RECORD] Stream ${userData.username} cerrado`);
      }

      // Cerrar el archivo mezclado
      await new Promise((resolve) => {
        session.mixedWriteStream.end(() => {
          const totalBytes = session.totalBytesWritten ? session.totalBytesWritten() : 0;
          console.log(`[RECORD] Archivo PCM cerrado - ${totalBytes} bytes`);
          resolve();
        });
      });

      // Delay para asegurar flush
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Desconectarse del canal
      session.connection.destroy();
      recordingSessions.delete(guildId);

      const duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
      const userCount = session.userStreams.size;
      
      // Convertir PCM a WAV con ffmpeg
      await interaction.reply({
        content: '⏳ Convirtiendo PCM a WAV...',
        flags: MessageFlags.Ephemeral
      });

      const converted = await convertSessionPCMtoWAV(session.sessionDir);

      // Crear botón de descarga
      const downloadButton = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`download_${session.sessionId}`)
            .setLabel('📥 Descargar grabación')
            .setStyle(ButtonStyle.Success)
        );

      await interaction.editReply({
        content: 
          `✅ Grabación finalizada.\n` +
          `📊 Duración: ${duration}s | Usuarios grabados: ${userCount}\n` +
          `📁 ID: \`${session.sessionId}\`\n` +
          `✔️ ${converted.length} archivos convertidos a WAV\n\n` +
          `**Pulsa el botón para descargar:**`,
        components: [downloadButton]
      });

      console.log(`[RECORD] Grabación finalizada: ${session.sessionId} (${userCount} usuarios, ${duration}s)`);
    } catch (error) {
      console.error('Error al finalizar grabación:', error);
      await interaction.reply({
        content: '❌ Error al finalizar grabación.',
        flags: MessageFlags.Ephemeral
      });
    }
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
