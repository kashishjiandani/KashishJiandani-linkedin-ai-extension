# LinkedIn AI Reply Chrome Extension

A powerful Chrome extension built with the WXT framework that revolutionizes how you handle LinkedIn messages. Generate intelligent, context-aware responses with just a few clicks, making your professional communication more efficient and consistent.

<div align="center">
  
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WXT Framework](https://img.shields.io/badge/WXT-Framework-blue)](https://wxt.dev)

</div>

## 🎥 Demo

![Demo Video](https://somup.com/cZ6tbkH71X)

## ✨ Features

- 🤖 **Smart Response Generator**
  - AI-powered response suggestions based on conversation context
  - Quick access through an intuitive edit icon in LinkedIn's message interface
  
- 🎯 **Custom Prompting**
  - Input your own prompts to generate personalized responses
  - Perfect for tailoring messages to specific professional scenarios
  
- 🎨 **Seamless UI Integration**
  - Clean, modern modal interface that matches LinkedIn's design language
  - Smooth transitions and responsive interactions
  
- ⚡ **Quick Insert**
  - One-click message insertion into LinkedIn's input field
  - Maintains formatting and professional appearance

## 🛠️ Technical Stack

- **WXT Framework** - Modern Chrome extension development
- **TypeScript** - Type-safe code with enhanced developer experience
- **Tailwind CSS** - Utility-first styling for responsive design
- **HTML/CSS/JavaScript** - Core web technologies

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/kashishjiandani/KashishJiandani-linkedin-ai-extension.git
cd linkedin-ai-reply
```

2. Install dependencies
```bash
npm install
```

### Development Mode

Run the extension in development mode with hot reload:
```bash
npm run dev
```
This will open a new Chrome window with the extension already installed and ready for development. The extension will automatically reload when you make changes to the code.

### Production Mode

To build and run the extension in production mode:

1. Build the extension
```bash
npm run build
```

2. Load the built extension in Chrome
- Open Chrome and navigate to `chrome://extensions/`
- Enable "Developer mode" in the top right
- Click "Load unpacked"
- Select the `.output/chrome-mv3` folder from the project directory

The extension will now run in production mode with optimized performance.

## 💡 How It Works

1. **Initialization**
   - Extension adds an AI icon to LinkedIn's message input field
   - Click the icon to open the response generation modal

2. **Generate Response**
   - Enter your prompt in the modal
   - Click "Generate" to create a response
   - Preview the response before inserting

3. **Insert & Send**
   - Review the generated response
   - Click "Insert" to add it to LinkedIn's message field
   - Send your message through LinkedIn's interface