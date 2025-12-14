# Recorder-Bot (esqueleto)

Proyecto esqueleto para un bot de Discord que graba llamadas, transcribe, traduce y resume.

Estructura básica creada para desarrollo local con contenedores:

- `bot/` — servicio del bot (Node.js)
- `asr/` — worker de transcripción (Python / Whisper)
- `translate/` — servicio de traducción (FastAPI / LibreTranslate proxy)
- `summarizer/` — worker de resumen (Python)

Comandos rápidos (requiere Docker + Docker Compose):

```bash
docker-compose build
docker-compose up --build
```

Siguientes pasos recomendados:
- Implementar el `bot` para unirse a canales de voz y guardar audio por participante.
- Implementar `asr` usando `whisper` (modelo small o whisper.cpp para CPU).
- Añadir `translate` con LibreTranslate o modelo self-hosted.
- Añadir `summarizer` con un modelo small (T5/BART) o servicio LLM.

Notas legales: asegúrate de avisar y recabar consentimiento de los participantes antes de grabar.
