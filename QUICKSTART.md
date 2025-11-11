# ⚡ Quick Start Guide

Get Altissia Booster running in under 5 minutes!

## 🚀 Prerequisites

You need:
- **Node.js** (v18+)
- **MongoDB** (running locally)
- **Chromium/Chrome** browser

## 📦 Installation (3 commands)

```bash
# 1. Clone and navigate
git clone https://github.com/yourusername/altissiaBooster.git
cd altissiaBooster

# 2. Install dependencies (both server & client)
cd server && npm install && cd ../client && npm install && cd ..

# 3. Start everything
./start.sh
```

That's it! Open http://localhost:5173 in your browser.

## 🔧 Manual Setup (if script doesn't work)

### Terminal 1 - Start MongoDB
```bash
sudo systemctl start mongodb
```

### Terminal 2 - Start Server
```bash
cd server
npm start
```

### Terminal 3 - Start Client
```bash
cd client
npm run dev
```

## ⚙️ Configuration (Optional)

Only needed if you want custom ports:

### Server `.env`
```bash
cd server
cat > .env << EOF
BACKENDHOST=http://localhost:5000
FRONTENDHOST=http://localhost:5173
EOF
```

### Client `.env`
```bash
cd client
cat > .env << EOF
VITE_BACKENDHOST=http://localhost:5000
VITE_FRONTENDHOST=http://localhost:5173
EOF
```

## 🎮 Usage

1. **Open browser** → http://localhost:5173
2. **Login** with your Altissia credentials
3. **Click "Start Automation"**
4. **Watch it work!** ✨

## 🆘 Troubleshooting

### Port 5000 already in use?
```bash
# Kill existing process
fuser -k 5000/tcp

# Or change port in server/.env
echo "PORT=5001" >> server/.env
```

### MongoDB not running?
```bash
# Start MongoDB
sudo systemctl start mongodb

# Enable on boot
sudo systemctl enable mongodb
```

### Chromium not found?
Update `server/index.js` line 70 with your browser path:
```javascript
executablePath: '/usr/bin/chromium',  // or your path
```

Find it with:
```bash
which chromium chromium-browser google-chrome
```

## 📚 More Info

- **Full Documentation**: [README.md](README.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Advanced Version**: [altissiaBooster-advanced](https://github.com/yourusername/altissiaBooster-advanced)

## 💡 Tips

- Set `headless: false` in `server/index.js` to watch the automation
- Check `http://localhost:5000` to verify server is running
- Use `pm2` for production deployments
- Check MongoDB with: `mongosh`

---

**Need help?** Check the [full README](README.md) or open an issue!
