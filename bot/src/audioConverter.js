const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const ffmpegPath = require('ffmpeg-static');

/**
 * Convierte un archivo opus/ogg a WAV usando ffmpeg
 * @param {string} inputPath - Ruta del archivo opus/ogg/pcm
 * @param {string} outputPath - Ruta de salida del archivo WAV
 * @returns {Promise<void>}
 */
async function convertToWAV(inputPath, outputPath) {
  try {
    // Detectar formato por extensión
    const ext = path.extname(inputPath).toLowerCase();
    let command;

    if (ext === '.ogg' || ext === '.opus') {
      // Opus/OGG a WAV
      command = `"${ffmpegPath}" -i "${inputPath}" -ar 48000 -ac 2 -y "${outputPath}"`;
    } else if (ext === '.pcm') {
      // PCM s16le a WAV
      command = `"${ffmpegPath}" -f s16le -ar 48000 -ac 2 -i "${inputPath}" -y "${outputPath}"`;
    } else {
      throw new Error(`Unsupported format: ${ext}`);
    }
    
    const { stdout, stderr } = await execAsync(command);
    
    // Verificar que el archivo WAV se creó
    const stats = fs.statSync(outputPath);
    if (stats.size === 0) {
      throw new Error('WAV file is empty');
    }
  } catch (error) {
    throw new Error(`FFmpeg conversion failed: ${error.message}`);
  }
}

/**
 * Convierte todos los archivos de audio de una sesión a WAV
 * @param {string} sessionDir - Directorio de la sesión
 * @returns {Promise<Array<{userId: string, inputPath: string, wavPath: string, size: number}>>}
 */
async function convertSessionPCMtoWAV(sessionDir) {
  const results = [];
  const files = fs.readdirSync(sessionDir).filter(f => 
    f.endsWith('.pcm') || f.endsWith('.ogg') || f.endsWith('.opus')
  );

  for (const file of files) {
    const inputPath = path.join(sessionDir, file);
    const wavPath = path.join(sessionDir, file.replace(/\.(pcm|ogg|opus)$/, '.wav'));

    try {
      await convertToWAV(inputPath, wavPath);
      
      // Verificar tamaño del WAV
      const stats = fs.statSync(wavPath);
      results.push({ inputPath, wavPath, size: stats.size });
      console.log(`[CONVERT] ${file} → WAV (${stats.size} bytes)`);
    } catch (error) {
      console.error(`[CONVERT] Error al convertir ${file}:`, error.message);
    }
  }

  return results;
}

module.exports = { convertToWAV, convertSessionPCMtoWAV };
