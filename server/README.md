# Altissia Booster - Server

Backend Node.js server with Puppeteer automation for the Altissia platform.

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **Puppeteer Extra** - Browser automation with stealth
- **MongoDB** - Database (via Mongoose)

## Features

- Automated login through Microsoft Azure AD
- Activity completion automation
- Hours accumulation system
- Language switching (French/English)
- Real-time progress updates via WebSocket

## Running

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode (with auto-reload)
npm run dev
```

## Configuration

Create a `.env` file:

```env
BACKENDHOST=http://localhost:5000
FRONTENDHOST=http://localhost:5173
```

## MongoDB

The server connects to MongoDB at `mongodb://localhost:27017/altissiabooster`

Make sure MongoDB is running:
```bash
sudo systemctl start mongodb
```

## Browser Configuration

The server uses Chromium for automation. Update the path in `index.js` if needed:

```javascript
executablePath: '/usr/bin/chromium',  // Line 70
```

## Socket.IO Events

### Client → Server
- `login` - User authentication
- `runActv` - Start activity automation
- `runHours` - Start hours accumulation
- `stopHours` - Stop hours accumulation
- `switchLang` - Change language
- `clearSession` - Clear browser session

### Server → Client
- `loginStatus` - Login progress updates
- `loginResponse` - Login result
- `actvStatus` - Activity progress
- `hoursStatus` - Hours tracking status
- `switchStatus` - Language switch confirmation

For more information, see the [main README](../README.md).
