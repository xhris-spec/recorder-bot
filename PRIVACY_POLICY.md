# Privacy Policy - Discord Voice Recorder Bot

**Effective Date:** December 15, 2025  
**Last Updated:** December 15, 2025

## 1. Introduction

This Privacy Policy describes how the Discord Voice Recorder Bot ("the Bot", "we", "our") collects, uses, stores, and protects information when you use our service.

**Important:** By using this Bot, you acknowledge that you are responsible for obtaining consent from all participants before recording any voice conversation.

## 2. Information We Collect

### 2.1 Audio Data
- **Voice recordings** from Discord voice channels in WAV format
- Recordings include mixed audio from all participants in the voice channel
- Audio is captured in real-time during active recording sessions

### 2.2 Discord User Information
- **User IDs**: Unique Discord user identifiers
- **Usernames**: Discord display names and tags
- **Server (Guild) IDs**: Identifiers for Discord servers where the Bot is used
- **Voice Channel IDs**: Identifiers for voice channels being recorded

### 2.3 Session Metadata
- **Timestamps**: Start and end times of recording sessions
- **Session IDs**: Unique identifiers for each recording session
- **Recording duration**: Length of recorded audio
- **Participant count**: Number of users recorded in each session

### 2.4 Command Usage Data
- **Bot commands** executed by users (e.g., `r!record`, `r!recordings`)
- **Interaction data**: Button clicks and command responses

## 3. How We Use Your Information

### 3.1 Primary Uses
- **Recording**: Capture and store voice audio from Discord channels
- **Conversion**: Process audio from Opus format to WAV for playback
- **Storage**: Maintain recordings for later download and access
- **Retrieval**: Enable users to list and download past recordings

### 3.2 Future Features (Planned)
- **Transcription**: Convert audio to text using AI models
- **Translation**: Translate transcripts to multiple languages
- **Summarization**: Generate summaries of recorded conversations

## 4. Data Storage and Security

### 4.1 Storage Location
- All recordings are stored on the **host server's file system**
- Files are stored in: `/app/recordings/<sessionId>/` directory
- Recordings are organized by unique session identifiers

### 4.2 Access Control
- Recordings are accessible to:
  - Members of the Discord server where the recording was made
  - Bot administrators with server access
  - Anyone with the session ID (if shared)

### 4.3 Security Measures
- Files are stored in a private directory not exposed to the internet
- Access requires authentication through Discord
- Bot token and credentials are stored securely in environment variables

### 4.4 Data Retention
- **Recordings are stored indefinitely** until manually deleted
- We do not automatically delete recordings
- Server administrators are responsible for managing recording retention
- Users can request deletion by contacting server administrators

## 5. Data Sharing and Disclosure

### 5.1 Third-Party Sharing
We **do not sell or share** your data with third parties, except:

- **Discord**: Audio is transmitted through Discord's infrastructure
- **Azure (Hosting)**: If deployed on Azure, data may be stored on Azure servers
- **Future AI Services**: Planned integrations (Whisper, LibreTranslate) will process audio/text data

### 5.2 Legal Disclosure
We may disclose information if required by law, court order, or government request.

## 6. Your Rights and Choices

### 6.1 Access
- You can access your recordings using `r!recordings` command
- Download recordings via download buttons or commands

### 6.2 Deletion
- Contact your server administrator to request deletion of recordings
- Server administrators can manually delete recording files from the host server

### 6.3 Consent Withdrawal
- You may stop using the Bot at any time
- Remove the Bot from your server to prevent future recordings
- Request deletion of existing recordings

### 6.4 Opt-Out
- Leave the voice channel before recording starts
- Request that the recording session be terminated

## 7. Children's Privacy

The Bot does not knowingly collect information from users under 13 years of age. Discord's Terms of Service require users to be at least 13 years old.

## 8. International Users

### 8.1 Data Transfers
- Data may be processed and stored on servers in various locations
- By using the Bot, you consent to international data transfers

### 8.2 GDPR Compliance (EU Users)
If you are located in the European Union:
- You have the right to access, rectify, or delete your data
- You have the right to restrict or object to processing
- You have the right to data portability
- You may file a complaint with a supervisory authority

## 9. Cookies and Tracking

The Bot does **not** use cookies or tracking technologies. All interactions occur through Discord's platform.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be:
- Posted in the project repository
- Announced in servers where the Bot is used (when feasible)
- Effective immediately upon posting

## 11. Data Breach Notification

In the event of a data breach affecting your recordings or personal information, we will:
- Notify affected users as soon as reasonably possible
- Describe the nature of the breach
- Provide guidance on protective measures

## 12. Open Source

This Bot is open-source software. The source code is publicly available, allowing you to:
- Review how data is collected and processed
- Verify security measures
- Contribute improvements

## 13. Contact Information

For privacy concerns, data deletion requests, or questions:

- **GitHub Repository**: [Project repository URL]
- **Email**: [Your contact email]
- **Discord**: Contact the server administrator where the Bot is deployed

## 14. Consent

By using the Discord Voice Recorder Bot, you consent to:
- The collection and processing of data as described in this policy
- The storage of voice recordings
- The use of Discord's infrastructure for data transmission

**IMPORTANT REMINDER:** You must obtain explicit consent from all participants before recording any conversation. Failure to do so may violate privacy laws and Discord's Terms of Service.

---

**Last Reviewed:** December 15, 2025
