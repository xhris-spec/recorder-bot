# Discord Voice Recorder Bot

A Discord bot that records voice channel conversations, with planned features for AI-powered transcription, translation, and summarization.

## 🚀 Current Features

### ✅ Voice Recording System
- **Real-time voice capture** from Discord voice channels
- **Multi-user recording** - captures all participants in a single mixed audio file
- **Opus to PCM decoding** using `opusscript` (pure JavaScript, no native compilation)
- **Automatic WAV conversion** via FFmpeg for universal playback compatibility
- **Interactive controls** - Start/Stop recording with Discord button components
- **Session management** - Browse and download past recordings

### 📝 Available Commands
- `r!record` - Display recording controls (Start/Stop buttons)
- `r!recordings` - List all available recording sessions
- `r!download <sessionId>` - Download a WAV file from a specific session

## 🏗️ Architecture

The project uses a microservices architecture with Docker containers:

```
recorder-bot/
├── bot/              # Discord bot service (Node.js)
│   ├── src/
│   │   ├── index.js           # Main bot logic & voice recording
│   │   └── audioConverter.js  # FFmpeg audio processing
│   ├── recordings/            # Stored audio sessions
│   └── package.json
├── asr/              # ASR worker (Python/Whisper) [Planned]
├── translate/        # Translation service (LibreTranslate) [Planned]
├── summarizer/       # Summarization worker (T5/BART) [Planned]
└── docker-compose.yml
```

## 🔧 How It Works

### Recording Pipeline

1. **Voice Connection**: Bot joins the voice channel when user clicks "Start"
2. **Stream Subscription**: Subscribes to each user's audio stream via `@discordjs/voice`
3. **Opus Decoding**: Decodes Opus packets to PCM using `opusscript` (48kHz, stereo)
4. **Mixed Recording**: Writes all users' audio to a single PCM file (`call-mixed.pcm`)
5. **WAV Conversion**: FFmpeg converts PCM to WAV format when recording stops
6. **Storage**: Audio files saved in `recordings/<sessionId>/` directory

### Tech Stack

**Bot Service:**
- `discord.js v14` - Discord API client
- `@discordjs/voice` - Voice channel connection & audio streaming
- `opusscript` - Pure JavaScript Opus decoder (no native dependencies)
- `prism-media` - Audio stream processing
- `ffmpeg-static` - Audio format conversion
- Node.js 18+

**Container Platform:**
- Docker & Docker Compose for local development
- Azure Container Instances for production deployment (planned)

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+ or Docker
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))
- FFmpeg (bundled with `ffmpeg-static`)

### Local Development (Node.js)

```bash
# Install dependencies
cd bot
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your DISCORD_TOKEN

# Start the bot
npm start
```

### Docker Deployment

```bash
# Build all services
docker-compose build

# Start bot service
docker-compose up bot
```

## 🔮 Future Implementations

### 🎯 Phase 1: Transcription (ASR)
- **Technology**: OpenAI Whisper (small model)
- **Command**: `r!transcribe <sessionId>`
- **Features**:
  - Automatic speech recognition from WAV files
  - Multi-language support (auto-detection)
  - Timestamp generation for speaker diarization
  - REST API endpoint for bot integration

**Architecture:**
```python
# asr/src/worker.py
- Load Whisper model (whisper-small or quantized whisper.cpp)
- FastAPI endpoint: POST /transcribe (accepts WAV file)
- Returns JSON with transcript + timestamps
```

### 🌍 Phase 2: Translation
- **Technology**: LibreTranslate (self-hosted) or NLLB model
- **Command**: `r!translate <sessionId> <target_language>`
- **Features**:
  - Translate transcripts to 100+ languages
  - Preserve formatting and timestamps
  - Support for multiple target languages in batch

**Options:**
- LibreTranslate Docker container (open-source, API-compatible)
- Meta's NLLB-200 (200 languages, self-hosted)
- Azure Translator API (low-cost tier for production)

### 📊 Phase 3: Summarization
- **Technology**: T5-base or BART model
- **Command**: `r!summary <sessionId>`
- **Features**:
  - Generate concise summaries of conversations
  - Extract key points and action items
  - Multi-paragraph support for long transcripts
  - Configurable summary length

**Implementation:**
```python
# summarizer/src/worker.py
- HuggingFace transformers (T5-base or facebook/bart-large-cnn)
- POST /summarize endpoint
- Returns JSON with summary + key points
```

### 🚀 Phase 4: Azure Deployment
- **Platform**: Azure Container Instances (ACI)
- **Cost Optimization**:
  - Use CPU-only instances for Whisper-small (~$0.08/hour)
  - Spot instances for batch processing
  - Auto-scaling based on command usage
  - Shared storage with Azure Files

## 📋 Roadmap

- [x] Voice recording system with mixed audio output
- [x] Interactive Discord UI with button controls
- [x] Session management & download commands
- [ ] Whisper ASR integration (Python worker)
- [ ] LibreTranslate integration
- [ ] T5/BART summarization worker
- [ ] Azure Container Instances deployment
- [ ] Model comparison docs (whisper-small vs medium, quantization benchmarks)
- [ ] Cost analysis & optimization guide

## ⚖️ Legal Notice

**Important**: Always notify participants and obtain consent before recording voice conversations. Recording without consent may violate privacy laws in your jurisdiction (GDPR, CCPA, etc.).

This bot is intended for:
- Meeting documentation with participant consent
- Educational purposes
- Personal use in private servers

**The developers are not responsible for misuse of this software.**

## 📄 License

MIT License - See LICENSE file for details
