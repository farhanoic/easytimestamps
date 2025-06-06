# Easy Timestamps

A modern, responsive web application for creating and managing timestamps for YouTube videos. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Video Integration**: Load YouTube videos directly with URL support
- **Timestamp Creation**: Add timestamps manually or capture from current video time
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Real-time Editing**: Edit and delete timestamps with instant feedback
- **Automatic Sorting**: Timestamps are automatically sorted chronologically
- **Clean Export**: Copy formatted timestamps for YouTube descriptions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

[View Live Application](your-deployment-url-here) <!-- Replace with your deployed URL -->

## 📸 Screenshots

### Light Mode
![Light Mode Screenshot](screenshots/light-mode.png)

### Dark Mode
![Dark Mode Screenshot](screenshots/dark-mode.png)

## 🛠️ Technologies Used

- **Frontend Framework**: React 18
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS
- **Video Player**: React Player
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Code Quality**: ESLint

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farhanoic/easytimestamps.git
   cd easytimestamps
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📖 Usage Guide

### Adding a Video

1. **YouTube URL**: Paste a YouTube video URL in the input field
2. **Local Video**: Upload a video file from your device
3. The video player will load and display your content

### Creating Timestamps

#### Method 1: Manual Entry
1. Enter start time (e.g., "2:30" or "1:25:30")
2. Optionally enter end time
3. Add a description
4. Click "Add Timestamp"

#### Method 2: Current Time Capture
1. Play the video to your desired timestamp
2. Click "Add Timestamp at Current Time"
3. Enter a description in the prompt
4. The timestamp will be automatically captured

### Managing Timestamps

- **Edit**: Click the edit icon next to any timestamp
- **Delete**: Click the delete icon to remove a timestamp
- **Copy**: Use the copy button to get formatted text for YouTube descriptions

### Theme Switching

Click the sun/moon icon in the top-right corner to toggle between light and dark modes.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navigation.tsx          # App navigation (if applicable)
│   ├── TimestampExtractor.tsx  # Main timestamp functionality
│   ├── TimestampForm.tsx       # Form for adding timestamps
│   ├── TimestampInput.tsx      # Input components
│   ├── TimestampList.tsx       # Display list of timestamps
│   └── VideoPlayer.tsx         # Video player component
├── contexts/
│   └── ThemeContext.tsx        # Theme management
├── App.tsx                     # Main app component
├── main.tsx                    # App entry point
└── index.css                   # Global styles
```

## 🎯 Use Cases

- **Content Creators**: Organize video chapters and key moments
- **Students**: Mark important sections in educational videos
- **Researchers**: Catalog specific timestamps in interview or documentary footage
- **Podcasters**: Create episode navigation timestamps

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with default settings

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to [Netlify](https://netlify.com)

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run build && npm run deploy`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@farhanoic](https://github.com/farhanoic)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- React Player for video integration

---

⭐ Star this repository if you found it helpful!