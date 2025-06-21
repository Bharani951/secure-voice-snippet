# SecureVoice Snippet

A secure voice recording and sharing application with end-to-end encryption.

## Features

- Record or upload voice notes (max 5 minutes)
- Client-side encryption with AES-256-GCM
- Automatic transcription via Web Speech API
- File storage using MongoDB GridFS
- Self-destructing share links
- User authentication with JWT

## Technical Stack

- Frontend: React, Vite, Tailwind CSS, WaveSurfer.js
- Backend: Node.js, Express
- Database: MongoDB with GridFS for file storage
- Authentication: JWT with optional magic links

## Structure

- \`/client\`: React frontend
- \`/server\`: Express backend

## Setup

See the README.md files in the client and server directories for setup instructions.
