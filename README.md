# 🚀 Subash Aryal - DevOps Engineer Portfolio

A modern, minimalist, and interactive portfolio website featuring a unique terminal interface. Built with vanilla JavaScript, HTML5, and CSS3, styled with the Dracula theme.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Version](https://img.shields.io/badge/Version-2.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎨 Design
- **Dracula Theme** - Beautiful dark theme with vibrant accent colors
- **Minimalist Design** - Clean, modern, and eye-catching interface
- **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **Smooth Animations** - Elegant transitions and scroll effects
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation

### 💻 Interactive Terminal
- **Command-Line Interface** - Fully functional terminal at the bottom of the page
- **Command History** - Navigate through previous commands with arrow keys
- **File System Simulation** - Browse files and directories with `ls`, `cat`, `cd`
- **Multiple Commands** - Help, clear, whoami, contact, and more
- **Persistent History** - Command history saved in localStorage
- **Keyboard Shortcuts** - Press `` ` `` or `~` to reopen terminal

### 📱 Sections
- **Hero/Intro** - Unique YAML code block design showcasing profile
- **About** - Personal information and background
- **Skills** - Technical skills with icons
- **Experience** - Professional experience timeline
- **Projects** - Portfolio projects with descriptions
- **Contact** - Social links and contact information

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, Flexbox, Grid
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Fonts** - JetBrains Mono, Ubuntu Mono
- **Icons** - SVG icons and emoji

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryalsubash07/portfolio.git
   cd portfolio
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access the site**
   - Navigate to `http://localhost:8000` (or the port you specified)

## 🎮 Usage

### Terminal Commands

The interactive terminal supports the following commands:

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `clear` | Clear terminal history |
| `whoami` | Display user information |
| `ls` | List files and directories |
| `cat <file>` | Display file contents (e.g., `cat about.txt`) |
| `contact` | Show contact information |
| `github` | Open GitHub profile |
| `linkedin` | Open LinkedIn profile |
| `email` | Open email client |
| `cv` or `resume` | Download CV/Resume |
| `:q` | Close terminal |

### Keyboard Shortcuts

- **Arrow Up/Down** - Navigate command history
- **Enter** - Execute command
- **`** or **~** - Reopen terminal if closed

### Available Files

- `about.txt` - Personal information
- `experience.log` - Professional experience
- `README.md` - Project documentation
- `skills/` - Skills directory
- `projects/` - Projects directory
- `contact.sh` - Contact script

## 📁 Project Structure

```
portfolio/
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   └── script.js           # Main JavaScript file
│   ├── cv/
│   │   └── Subash_Aryal_CV.pdf # CV/Resume PDF file
│   └── img/                    # Images directory
├── index.html                  # Main HTML file
└── README.md                   # This file
```

## 📄 CV/Resume Download

The portfolio includes CV download functionality:

1. **Download Button** - Available in the About section
2. **Contact Section** - CV download link alongside other contact methods
3. **Terminal Command** - Type `cv` or `resume` in the terminal to download

**To add your CV:**
- Place your PDF file at `assets/cv/Subash_Aryal_CV.pdf`
- Or update the file path in `index.html` if using a different filename

## 🎯 Key Features Explained

### Terminal System
The terminal is a fully functional command-line interface built with vanilla JavaScript. It includes:
- Command parsing and execution
- History management with localStorage
- File system simulation
- Error handling
- Output formatting with syntax highlighting

### Responsive Design
The portfolio is fully responsive with breakpoints for:
- Mobile devices (< 768px)
- Tablets (768px - 968px)
- Desktop (> 968px)

### Performance Optimizations
- Throttled scroll events
- Intersection Observer for animations
- CSS will-change for smooth animations
- Font display swap for faster loading
- Preconnect for external resources

## 🔧 Customization

### Changing Colors
Edit CSS variables in `assets/css/style.css`:
```css
:root {
    --bg-primary: #282a36;
    --accent: var(--purple);
    /* ... more variables */
}
```

### Adding Commands
Edit `CommandSystem.commands` in `assets/js/script.js`:
```javascript
commands: {
    yourCommand: (args) => {
        return {
            type: 'info',
            content: 'Your command output'
        };
    }
}
```

### Modifying Content
- **Personal Info**: Edit the HTML sections in `index.html`
- **Terminal Files**: Update `FILE_CONTENT` constant in `script.js`
- **Links**: Update `LINKS` constant in `script.js`

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (not supported)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Subash Aryal**
- Email: aryalsubash07@gmail.com
- GitHub: [@aryalsubash07](https://github.com/aryalsubash07)
- LinkedIn: [aryalsubash07](https://linkedin.com/in/aryalsubash07)

## 🙏 Acknowledgments

- [Dracula Theme](https://draculatheme.com/) - Color palette inspiration
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Beautiful monospace font
- All the open-source tools and libraries that made this possible

## 📈 Future Enhancements

- [ ] Add more terminal commands
- [ ] Implement command autocomplete
- [ ] Add theme switcher
- [ ] Add blog section
- [ ] Implement dark/light mode toggle
- [ ] Add animations library
- [ ] Add more interactive elements

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/aryalsubash07/portfolio/issues).

## 📞 Contact

For inquiries, please reach out via:
- **Email**: aryalsubash07@gmail.com
- **GitHub**: [aryalsubash07](https://github.com/aryalsubash07)
- **LinkedIn**: [aryalsubash07](https://linkedin.com/in/aryalsubash07)

---

⭐ If you like this project, give it a star on GitHub!

**Built with ❤️ by Subash Aryal**

