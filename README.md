# 🚀 Altissia Booster (Basic Version)

[![Status](https://img.shields.io/badge/status-archived-red)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/mongodb-8.x-green)](https://www.mongodb.com)

> **⚠️ This project is now archived.** I don't need it anymore, but hey, feel free to use it on your own!

An automation tool to complete tasks and accumulate learning hours on the Altissia platform - because sometimes you just need to meet those arbitrary requirements.

---

## 📖 Table of Contents

- [Why This Exists](#-why-this-exists)
- [What It Does](#-what-it-does)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Advanced Version](#-advanced-version)
- [Screenshots](#-screenshots)
- [How It Works](#-how-it-works)
- [Disclaimer](#%EF%B8%8F-disclaimer)
- [License](#-license)

---

## 🤔 Why This Exists

### The Story

**TL;DR:** I hate French. My college required us to get **80 hours of learning** and complete **120 tasks** on Altissia (a language learning platform used by multiple colleges and governments). So naturally, I automated it.

### The Problem

- **Altissia Platform**: A language learning platform that tracks your time and completed activities
- **College Requirements**: 
  - Minimum 80 hours of platform usage
  - Completion of 120+ learning tasks
  - Progress tracked for grading
- **Reality**: Sitting through language exercises for 80+ hours is... not ideal
- **Solution**: Automation, obviously

### The Versions

This project comes in **two flavors**:

1. **Basic Version (This Repo)**: 
   - Automatically collects hours
   - Completes tasks automatically
   - **Limitation**: Cannot choose specific tasks (completes whatever it finds)
   - Simple and straightforward

2. **[Advanced Version](https://github.com/yourusername/altissiaBooster-advanced)** ⭐
   - All basic features +
   - **Task Selection**: Choose specific activities and modules
   - **Language Switching**: Automate French or English courses
   - **Dashboard**: Visual interface with real-time progress
   - **Customization**: Fine-grained control over automation

---

## 🎯 What It Does

This tool automates the tedious process of:

- ✅ **Logging in** to Altissia platform via Microsoft Azure AD
- ✅ **Navigating** through the platform automatically
- ✅ **Completing activities** and exercises
- ✅ **Accumulating hours** by keeping the platform active
- ✅ **Tracking progress** in real-time
- ✅ **Storing user data** in a local MongoDB database

### Real-World Impact

- **80 hours** of mindless clicking → **automated**
- **120 tasks** of repetitive exercises → **automated**
- **Your sanity** → **preserved**

---

## ✨ Features

### Core Features

- 🤖 **Full Automation**: Headless browser automation using Puppeteer
- ⚡ **Real-Time Updates**: Socket.IO for live status and progress tracking
- 💾 **Data Persistence**: Local MongoDB for user sessions and progress
- 🔐 **Secure Authentication**: Microsoft Azure AD login handling
- 🎨 **Modern UI**: React + TailwindCSS dashboard
- 📊 **Progress Tracking**: Monitor hours and completed tasks
- 🌐 **Network Ready**: Can run on local network for multiple devices

### Technical Features

- **Stealth Mode**: Uses puppeteer-stealth to avoid detection
- **Error Handling**: Robust error catching and recovery
- **Session Management**: Maintains browser sessions across operations
- **Multi-User Support**: Can handle multiple accounts simultaneously
- **Configurable**: Environment variables for easy setup

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Socket.IO** - Real-time bidirectional communication
- **Puppeteer Extra** - Browser automation with stealth plugins
- **MongoDB** - Database for user data
- **Mongoose** - MongoDB object modeling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS framework
- **Flowbite** - Component library
- **Socket.IO Client** - Real-time client
- **Axios** - HTTP client

### DevOps
- **Chromium** - Browser for automation
- **dotenv** - Environment variable management
- **ESLint** - Code linting
- **nodemon** - Development auto-reload

---

## 📁 Project Structure

```
altissiaBooster/
├── server/                      # Backend Node.js server
│   ├── index.js                 # Main server file with automation logic
│   ├── package.json            # Server dependencies
│   └── .env                    # Environment variables
│
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── main.jsx           # Entry point
│   │   ├── App.jsx            # Basic automation component
│   │   ├── login.jsx          # Login page
│   │   ├── dashboard.jsx      # Main dashboard (advanced version)
│   │   └── index.css          # Global styles
│   ├── package.json           # Client dependencies
│   └── .env                   # Client environment variables
│
├── keypairs/                   # SSL certificates (if needed)
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org))
- **MongoDB** >= 5.0 ([Installation Guide](https://docs.mongodb.com/manual/installation/))
- **Chromium/Chrome** browser installed
- **Git** for cloning

### On Arch Linux (Recommended)

```bash
# Install dependencies
sudo pacman -S nodejs npm chromium

# Install MongoDB from AUR
yay -S mongodb-bin

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### On Ubuntu/Debian

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Chromium
sudo apt-get install -y chromium-browser

# Install MongoDB
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/altissiaBooster.git
cd altissiaBooster

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## ⚙️ Configuration

### 1. Server Configuration

Create `.env` file in `server/` directory:

```env
# Server Configuration
BACKENDHOST=http://localhost:5000
FRONTENDHOST=http://localhost:5173

# MongoDB (optional if using default)
# MONGO_URI=mongodb://localhost:27017/altissiabooster
```

### 2. Client Configuration

Create `.env` file in `client/` directory:

```env
# Backend API URL
VITE_BACKENDHOST=http://localhost:5000
VITE_FRONTENDHOST=http://localhost:5173
```

### 3. Update Browser Path (if needed)

Edit `server/index.js` line 70 if your Chromium is in a different location:

```javascript
executablePath: '/usr/bin/chromium',  // Update this path
```

Common paths:
- **Arch Linux**: `/usr/bin/chromium`
- **Ubuntu**: `/usr/bin/chromium-browser`
- **macOS**: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- **Windows**: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`

---

## 💻 Usage

### Starting the Application

#### Option 1: Using two terminals

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

#### Option 2: Using a process manager (recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start both services
cd server && pm2 start npm --name "altissia-server" -- start
cd ../client && pm2 start npm --name "altissia-client" -- run dev

# View logs
pm2 logs

# Stop services
pm2 stop all
```

### Accessing the Application

Once both services are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Network Access**: http://YOUR_LOCAL_IP:5173

### Using the Automation

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Login** with your Altissia/OFPPT credentials
   - The tool will automatically handle Microsoft Azure AD authentication
   - Wait for the login process to complete (you'll see status updates)

3. **Start Automation**
   - Click "Start Automation" button
   - The backend will launch a Chromium browser (headless or visible based on config)
   - Activities will be completed automatically

4. **Monitor Progress**
   - Real-time status updates on the dashboard
   - Hours accumulated will be displayed
   - Tasks completed counter

5. **Stop When Needed**
   - Click "Stop Automation" to pause
   - Your progress is saved in MongoDB

### Customization

Want to see the browser in action? Edit `server/index.js`:

```javascript
// Line 66 - Set to false to see browser
headless: false,  // true = invisible, false = visible
```

---

## 🎓 Advanced Version

Want more control? Check out the **Advanced Version** with additional features:

### [🔗 Altissia Booster Advanced →](https://github.com/yourusername/altissiaBooster-advanced)

**Additional Features:**
- 🎯 **Specific Task Selection**: Choose exactly which activities to complete
- 🌍 **Language Switcher**: Toggle between French and English courses
- 📊 **Enhanced Dashboard**: Visual progress bars and statistics
- 🎨 **Better UI/UX**: Improved interface with Flowbite components
- ⚙️ **Custom Automation Rules**: Set conditions and priorities
- 📈 **Advanced Analytics**: Detailed progress tracking

---

## 📸 Screenshots

### Login Page
```
┌─────────────────────────────────────┐
│                                     │
│      [Altissia Logo]                │
│                                     │
│      Login                          │
│      ┌─────────────────────┐       │
│      │ Email Address       │       │
│      └─────────────────────┘       │
│      ┌─────────────────────┐       │
│      │ Password            │       │
│      └─────────────────────┘       │
│      [Login Button]                │
│                                     │
└─────────────────────────────────────┘
```

### Automation Dashboard
```
┌─────────────────────────────────────┐
│  Altissia Booster                   │
├─────────────────────────────────────┤
│  Status: Running automation...      │
│  Time Added: +142 seconds           │
├─────────────────────────────────────┤
│  [Stop Automation]                  │
└─────────────────────────────────────┘
```

---

## 🔧 How It Works

### The Automation Process

1. **Authentication Flow**
   ```
   User Input → Socket.IO → Puppeteer Launch → Navigate to Altissia
   → Microsoft Azure AD Login → Enter Credentials → Handle MFA
   → Access Dashboard → Begin Automation
   ```

2. **Activity Completion**
   - **Detection**: Scans for available activities using CSS selectors
   - **Selection**: Clicks on activity modules
   - **Execution**: Simulates user interactions (clicks, typing, waiting)
   - **Completion**: Detects completion indicators
   - **Loop**: Moves to next activity

3. **Hours Accumulation**
   - **Interval Clicking**: Clicks activity buttons every 5 seconds
   - **Session Maintenance**: Keeps browser session alive
   - **Progress Tracking**: Monitors time elapsed
   - **Auto-Stop**: Can be configured to stop after X hours

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React)               │
│  ┌─────────────┐  ┌──────────────┐            │
│  │   Login     │  │  Dashboard   │            │
│  └──────┬──────┘  └──────┬───────┘            │
│         │                 │                     │
│         └────────┬────────┘                     │
│                  │ Socket.IO                    │
└──────────────────┼──────────────────────────────┘
                   │
┌──────────────────┼──────────────────────────────┐
│                  │                               │
│         ┌────────▼────────┐                     │
│         │  Express Server  │                     │
│         └────────┬────────┘                     │
│                  │                               │
│    ┌─────────────┼─────────────┐               │
│    │             │             │               │
│ ┌──▼────┐  ┌────▼─────┐  ┌───▼────┐          │
│ │Socket │  │Puppeteer │  │MongoDB │          │
│ │  IO   │  │  Stealth │  │        │          │
│ └───────┘  └──────────┘  └────────┘          │
│                  Backend (Node.js)             │
└────────────────────────────────────────────────┘
```

---

## ⚠️ Disclaimer

### Legal & Ethical Notice

**IMPORTANT: Read Before Using**

1. **Educational Purpose Only**: This project was created for educational purposes to learn about browser automation, web scraping, and full-stack development.

2. **Terms of Service**: Using automation tools may violate Altissia's Terms of Service. Use at your own risk.

3. **Academic Integrity**: This tool was created out of frustration with arbitrary requirements. Consider whether using it aligns with your institution's academic integrity policies.

4. **No Warranty**: This software is provided "as is" without warranty of any kind. The authors are not responsible for any consequences of using this tool.

5. **Archived Status**: This project is no longer actively maintained. It may not work with current versions of the Altissia platform.

6. **Detection Risk**: While using stealth plugins, there's always a risk of detection. Use responsibly.

### Recommendations

- ✅ Use for understanding automation concepts
- ✅ Fork and modify for learning purposes
- ✅ Use on test accounts when possible
- ❌ Don't use to completely bypass legitimate learning
- ❌ Don't distribute credentials or share automated accounts
- ❌ Don't blame me if you get caught 😅

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Server won't start - Port already in use
```bash
# Find and kill process on port 5000
fuser -k 5000/tcp

# Or use a different port in .env
PORT=5001
```

#### 2. MongoDB connection failed
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check connection
mongosh
```

#### 3. Browser automation fails
```bash
# Install missing dependencies (Ubuntu/Debian)
sudo apt-get install -y libgbm-dev libnss3 libatk-bridge2.0-0

# Check Chromium path
which chromium
which chromium-browser
which google-chrome
```

#### 4. Login keeps failing
- Check your credentials are correct
- Ensure you're using OFPPT email format: `yourcode@ofppt-edu.ma`
- Wait for all authentication steps to complete
- Check if MFA (Multi-Factor Authentication) is required

#### 5. Tasks not completing automatically
- Altissia may have updated their UI (CSS selectors changed)
- Try the advanced version for more robust selectors
- Run with `headless: false` to see what's happening

---

## 🤝 Contributing

This project is **archived**, but you're welcome to:

- 🍴 **Fork it** and make your own version
- 🐛 **Report issues** (though they may not be fixed)
- 💡 **Share improvements** in discussions
- ⭐ **Star it** if you found it useful

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details

**Translation**: Do whatever you want with this code, just don't sue me.

---

## 🙏 Acknowledgments

- **Puppeteer Team** - For the amazing browser automation library
- **Socket.IO** - For real-time communication
- **My College** - For the motivation to build this 😅
- **Coffee** - For keeping me awake during development
- **Everyone who hates French** - You know who you are

---

## 📞 Contact & Links

- **Author**: Your Name
- **Advanced Version**: [altissiaBooster-advanced](https://github.com/yourusername/altissiaBooster-advanced)
- **Issues**: Open an issue (but remember, it's archived!)
- **Discussions**: Feel free to discuss in the repo

---

## 📊 Stats

- **Lines of Code**: ~2,000+
- **Time Saved**: 80+ hours per student
- **Coffee Consumed**: Too much
- **French Learned**: Still hate it
- **Satisfaction**: Priceless

---

<div align="center">

**Made with ☕ and 😤 by someone who had better things to do**

**[⬆ Back to Top](#-altissia-booster-basic-version)**

</div>

---

## 🔄 Version History

- **v1.0.0** (Current) - Initial release with basic automation
- Status: Archived - Project complete, mission accomplished

---

*Remember: The best way to learn a language is still immersion and practice. But when you have arbitrary requirements and limited time... well, there's always automation.* 🤖

---

**P.S.** If you're from my college reading this... I passed French eventually. The automation just helped with the platform hours. Promise. 😇
