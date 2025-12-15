// Traducciones para el bot
const translations = {
  es: {
    // Comandos
    mustBeInVoice: '❌ Debes estar en un canal de voz para usar este comando.',
    recordingActive: '🔴 **Grabación activa**',
    notRecording: '⚫ **Sin grabar**',
    controlButtons: 'Pulsa los botones para controlar la grabación:',
    
    // Grabación
    connectingToVoice: 'Conectando a',
    waitingMic: 'Esperando micrófono listo...',
    recordingStarted: '🔴 **Grabación activa**\n\nPulsa los botones para controlar la grabación:',
    alreadyRecording: '⚠️ Ya hay una grabación activa en este servidor.',
    noActiveRecording: '❌ No hay grabación activa en este servidor.',
    convertingAudio: '⏳ Convirtiendo PCM a WAV...',
    recordingFinished: '✅ Grabación finalizada.',
    duration: 'Duración',
    usersRecorded: 'Usuarios grabados',
    filesConverted: 'archivos convertidos a WAV',
    downloadButton: 'Pulsa el botón para descargar:',
    
    // Listado
    noRecordings: '📁 No hay grabaciones disponibles.',
    latestRecordings: '📁 **Últimas grabaciones:**',
    clickToDownload: '**Pulsa un botón para descargar:**',
    files: 'archivos',
    
    // Descarga
    recordingNotFound: '❌ Grabación no encontrada.',
    noWavFiles: '❌ No hay archivos WAV en esta grabación.',
    fileTooLarge: 'El archivo es demasiado grande para Discord',
    downloadLabel: 'Descargar grabación',
    download: 'Descarga',
    file: 'Archivo',
    downloadError: '❌ Error al descargar el archivo.',
    
    // Help
    helpTitle: '📋 **Comandos disponibles:**',
    helpRecording: '🎙️ **Grabación:**',
    helpRecord: 'Mostrar controles de grabación (Start/Stop)',
    helpFiles: '📁 **Gestión de archivos:**',
    helpRecordings: 'Listar y descargar grabaciones anteriores',
    helpOthers: '💬 **Otros:**',
    helpHello: 'Saludo',
    helpHelp: 'Mostrar este mensaje',
    helpNote: '**Nota:** Debes estar en un canal de voz para usar',
    
    // General
    hello: 'Hola',
    unknownCommand: 'Comando',
    unknownCommandHelp: 'no reconocido.\n\nUsa `r!help` para ver los comandos disponibles.',
    errorJoiningVoice: '❌ Error al unirse al canal de voz.',
    errorFinishing: '❌ Error al finalizar grabación.',
    
    // Botones
    buttonStart: '▶️ Start',
    buttonStop: '⏹️ Stop'
  },
  en: {
    // Commands
    mustBeInVoice: '❌ You must be in a voice channel to use this command.',
    recordingActive: '🔴 **Recording active**',
    notRecording: '⚫ **Not recording**',
    controlButtons: 'Click the buttons to control the recording:',
    
    // Recording
    connectingToVoice: 'Connecting to',
    waitingMic: 'Waiting for microphone ready...',
    recordingStarted: '🔴 **Recording active**\n\nClick the buttons to control the recording:',
    alreadyRecording: '⚠️ There is already an active recording on this server.',
    noActiveRecording: '❌ No active recording on this server.',
    convertingAudio: '⏳ Converting PCM to WAV...',
    recordingFinished: '✅ Recording finished.',
    duration: 'Duration',
    usersRecorded: 'Users recorded',
    filesConverted: 'files converted to WAV',
    downloadButton: 'Click the button to download:',
    
    // List
    noRecordings: '📁 No recordings available.',
    latestRecordings: '📁 **Latest recordings:**',
    clickToDownload: '**Click a button to download:**',
    files: 'files',
    
    // Download
    recordingNotFound: '❌ Recording not found.',
    noWavFiles: '❌ No WAV files in this recording.',
    fileTooLarge: 'File is too large for Discord',
    downloadLabel: 'Download recording',
    download: 'Download',
    file: 'File',
    downloadError: '❌ Error downloading file.',
    
    // Help
    helpTitle: '📋 **Available commands:**',
    helpRecording: '🎙️ **Recording:**',
    helpRecord: 'Show recording controls (Start/Stop)',
    helpFiles: '📁 **File management:**',
    helpRecordings: 'List and download previous recordings',
    helpOthers: '💬 **Other:**',
    helpHello: 'Greeting',
    helpHelp: 'Show this message',
    helpNote: '**Note:** You must be in a voice channel to use',
    
    // General
    hello: 'Hello',
    unknownCommand: 'Command',
    unknownCommandHelp: 'not recognized.\n\nUse `r!help` to see available commands.',
    errorJoiningVoice: '❌ Error joining voice channel.',
    errorFinishing: '❌ Error finishing recording.',
    
    // Buttons
    buttonStart: '▶️ Start',
    buttonStop: '⏹️ Stop'
  }
};

// Detectar idioma del usuario (por defecto español)
function getUserLocale(interaction) {
  if (!interaction) return 'es';
  
  // Discord locale: 'es-ES', 'en-US', 'en-GB', etc.
  const locale = interaction.locale || interaction.guildLocale || 'es-ES';
  const lang = locale.split('-')[0]; // Extraer 'es' de 'es-ES'
  
  // Soportar solo español e inglés por ahora
  return ['es', 'en'].includes(lang) ? lang : 'es';
}

// Obtener traducción
function t(key, locale = 'es') {
  return translations[locale]?.[key] || translations['es'][key] || key;
}

module.exports = { translations, getUserLocale, t };
