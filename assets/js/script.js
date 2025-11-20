/**
 * Terminal Portfolio - Refactored
 * Clean, Modular, Maintainable Code
 * 
 * @author Subash Aryal
 * @version 2.0.0
 */

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    const CONFIG = {
        maxHistoryItems: 50,
        storageKey: 'terminal-history',
        terminalCloseDelay: 300,
        scrollOffset: 200,
        scrollThreshold: 100,
        animationDuration: 300
    };

    // ============================================================================
    // CONSTANTS
    // ============================================================================
    const SELECTORS = {
        commandInput: '#commandInput',
        commandHistory: '#commandHistory',
        closeTerminal: '#closeTerminal',
        terminalContainer: '.terminal-container',
        heroIntro: '.hero-intro',
        sections: '.section',
        scrollProgress: '.scroll-progress',
        scrollProgressBar: '.scroll-progress-bar',
        navLinks: '.nav-link',
        header: '.header'
    };

    const KEYS = {
        ENTER: 'Enter',
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        BACKTICK: '`',
        TILDE: '~'
    };

    const FILE_CONTENT = {
        'about.txt': `NAME:        Subash Aryal
ROLE:        DevOps Engineer
LOCATION:    Nepal
EMAIL:       aryalsubash07@gmail.com

DESCRIPTION:
Dedicated DevOps engineer with strong hands-on skills in automation,
cloud, and container orchestration. Passionate about designing stable,
scalable systems and simplifying complex infrastructure.`,
        'experience.log': `[2024-Present] DevOps Engineer
Infrastructure & Automation

Responsibilities:
  • Design and implement scalable containerized infrastructure
  • Automate CI/CD pipelines to streamline workflows
  • Manage cloud infrastructure on AWS
  • Implement monitoring solutions (Prometheus, Grafana)
  • Configure infrastructure as code using Ansible`,
        'README.md': `# Subash Aryal - DevOps Engineer Portfolio

Welcome to my terminal portfolio!

Quick Navigation:
- Scroll down to explore sections
- Use the command input at the bottom
- Try typing 'help' for available commands

Contact:
Email: aryalsubash07@gmail.com
GitHub: https://github.com/aryalsubash07
LinkedIn: https://linkedin.com/in/aryalsubash07`
    };

    const FILE_LIST = ['about.txt', 'experience.log', 'skills/', 'projects/', 'contact.sh', 'README.md'];

    const LINKS = {
        github: 'https://github.com/aryalsubash07',
        linkedin: 'https://linkedin.com/in/aryalsubash07',
        email: 'aryalsubash07@gmail.com'
    };

    // ============================================================================
    // UTILITIES
    // ============================================================================
    const Utils = {
        /**
         * Query selector shorthand
         * @param {string} selector - CSS selector
         * @returns {Element|null}
         */
        $(selector) {
            return document.querySelector(selector);
        },

        /**
         * Query selector all shorthand
         * @param {string} selector - CSS selector
         * @returns {Array<Element>}
         */
        $$(selector) {
            return Array.from(document.querySelectorAll(selector));
        },

        /**
         * Escape HTML to prevent XSS
         * @param {string} text - Text to escape
         * @returns {string} - Escaped HTML
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        /**
         * Throttle function execution
         * @param {Function} func - Function to throttle
         * @param {number} limit - Time limit in ms
         * @returns {Function} - Throttled function
         */
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // ============================================================================
    // COMMAND SYSTEM
    // ============================================================================
    const CommandSystem = {
        history: [],
        historyIndex: -1,

        /**
         * Initialize command system
         */
        init() {
            this.loadHistory();
            this.historyIndex = this.history.length;
        },

        /**
         * Load command history from localStorage
         */
        loadHistory() {
            try {
                const saved = localStorage.getItem(CONFIG.storageKey);
                if (saved) {
                    this.history = JSON.parse(saved).slice(-CONFIG.maxHistoryItems);
                }
            } catch (error) {
                console.error('Error loading command history:', error);
                this.history = [];
            }
        },

        /**
         * Save command history to localStorage
         */
        saveHistory() {
            try {
                localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.history));
            } catch (error) {
                console.error('Error saving command history:', error);
            }
        },

        /**
         * Add command to history
         * @param {string} command - Command to add
         */
        addToHistory(command) {
            const trimmed = command.trim();
            if (!trimmed) return;

            this.history.push(trimmed);
            if (this.history.length > CONFIG.maxHistoryItems) {
                this.history.shift();
            }
            this.historyIndex = this.history.length;
            this.saveHistory();
        },

        /**
         * Get previous command from history
         * @returns {string}
         */
        getPrevious() {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                return this.history[this.historyIndex];
            }
            return '';
        },

        /**
         * Get next command from history
         * @returns {string}
         */
        getNext() {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                return this.history[this.historyIndex];
            }
            this.historyIndex = this.history.length;
            return '';
        },

        /**
         * Format command for help display
         * @param {string} cmd - Command name
         * @param {string} desc - Command description
         * @returns {string}
         */
        formatCommand(cmd, desc) {
            return `  ${cmd.padEnd(18)} ${desc}`;
        },

        /**
         * Command definitions
         */
        commands: {
            help: () => ({
                type: 'help',
                content: `Available commands:

${CommandSystem.formatCommand('help', 'Show this help')}
${CommandSystem.formatCommand('clear', 'Clear terminal')}
${CommandSystem.formatCommand('whoami', 'User information')}
${CommandSystem.formatCommand('ls', 'List files')}
${CommandSystem.formatCommand('cat <file>', 'Read file')}
${CommandSystem.formatCommand('contact', 'Contact info')}
${CommandSystem.formatCommand('github', 'Open GitHub')}
${CommandSystem.formatCommand('linkedin', 'Open LinkedIn')}
${CommandSystem.formatCommand('email', 'Send email')}
${CommandSystem.formatCommand('cv', 'Download CV/Resume')}
${CommandSystem.formatCommand(':q', 'Close terminal')}`
            }),

            clear: () => {
                const historyEl = Utils.$(SELECTORS.commandHistory);
                if (historyEl) {
                    historyEl.innerHTML = '';
                }
                return { type: 'success', content: 'Terminal cleared.' };
            },

            whoami: () => ({
                type: 'info',
                content: `subash aryal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
role:     DevOps Engineer
location: Nepal
email:    ${LINKS.email}`
            }),

            ls: () => {
                const output = FILE_LIST
                    .map(file => {
                        const icon = file.endsWith('/') ? '📁' : '📄';
                        return `${icon}  ${file}`;
                    })
                    .join('\n');
                return { type: 'list', content: output };
            },

            cat: (args) => {
                const file = args.trim();
                if (FILE_CONTENT[file]) {
                    return { type: 'info', content: FILE_CONTENT[file] };
                }
                return { type: 'error', content: `cat: ${file}: No such file or directory` };
            },

            contact: () => ({
                type: 'info',
                content: `CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email:    ${LINKS.email}
GitHub:   ${LINKS.github}
LinkedIn: ${LINKS.linkedin}
Location: Nepal

I'm always open to discussing new opportunities, interesting projects,
or conversations about DevOps, cloud infrastructure, and automation.`
            }),

            github: () => {
                window.open(LINKS.github, '_blank', 'noopener,noreferrer');
                return { type: 'success', content: 'Opening GitHub profile...' };
            },

            linkedin: () => {
                window.open(LINKS.linkedin, '_blank', 'noopener,noreferrer');
                return { type: 'success', content: 'Opening LinkedIn profile...' };
            },

            email: () => {
                window.location.href = `mailto:${LINKS.email}?subject=Portfolio%20Inquiry`;
                return { type: 'success', content: 'Opening email client...' };
            },

            cv: () => {
                const link = document.createElement('a');
                link.href = 'assets/cv/Subash_Aryal_CV.pdf';
                link.download = 'Subash_Aryal_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return { type: 'success', content: 'Downloading CV...' };
            },

            resume: () => {
                // Alias for cv command
                return CommandSystem.commands.cv();
            },

            ':q': () => {
                TerminalUI.closeTerminal();
                return { type: 'info', content: 'Terminal closed. Press ` or ~ to reopen.' };
            }
        },

        /**
         * Execute a command
         * @param {string} input - User input
         * @returns {Object|null} - Command result or null
         */
        execute(input) {
            const trimmed = input.trim();
            if (!trimmed) return null;

            const parts = trimmed.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1).join(' ');

            // Handle vi-style quit
            if (trimmed === ':q' || cmd === ':q') {
                return this.commands[':q']();
            }

            // Execute command
            if (this.commands[cmd]) {
                try {
                    const result = this.commands[cmd](args);
                    return result || { type: 'info', content: '' };
                } catch (error) {
                    console.error(`Error executing command: ${cmd}`, error);
                    return { type: 'error', content: `Error: ${error.message}` };
                }
            }

            return { type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` };
        }
    };

    // ============================================================================
    // TERMINAL UI
    // ============================================================================
    const TerminalUI = {
        /**
         * Initialize terminal UI
         */
        init() {
            this.setupCloseButton();
            this.setupReopenShortcut();
        },

        /**
         * Setup close button handler
         */
        setupCloseButton() {
            const closeBtn = Utils.$(SELECTORS.closeTerminal);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeTerminal());
            }
        },

        /**
         * Setup keyboard shortcut to reopen terminal
         */
        setupReopenShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.key === KEYS.BACKTICK || e.key === KEYS.TILDE) {
                    this.reopenTerminal();
                }
            });
        },

        /**
         * Reopen terminal if closed
         */
        reopenTerminal() {
            const container = Utils.$(SELECTORS.terminalContainer);
            if (container && container.style.display === 'none') {
                container.style.display = 'block';
                container.style.transform = 'translateY(0)';
                container.style.opacity = '1';
                
                const input = Utils.$(SELECTORS.commandInput);
                if (input) input.focus();
            }
        },

        /**
         * Close terminal with animation
         */
        closeTerminal() {
            const container = Utils.$(SELECTORS.terminalContainer);
            if (!container) return;

            container.style.transform = 'translateY(100%)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                container.style.display = 'none';
            }, CONFIG.terminalCloseDelay);
        }
    };

    // ============================================================================
    // COMMAND INPUT HANDLER
    // ============================================================================
    const CommandInput = {
        input: null,
        historyContainer: null,

        /**
         * Initialize command input
         */
        init() {
            this.input = Utils.$(SELECTORS.commandInput);
            this.historyContainer = Utils.$(SELECTORS.commandHistory);
            
            if (!this.input) return;

            this.setupEventListeners();
            this.setupFocusHandler();
        },

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        },

        /**
         * Setup focus handler
         */
        setupFocusHandler() {
            document.addEventListener('click', (e) => {
                if (!e.target.closest(SELECTORS.terminalContainer.replace('.', ''))) {
                    this.input.focus();
                }
            });
        },

        /**
         * Handle keyboard input
         * @param {KeyboardEvent} e - Keyboard event
         */
        handleKeyDown(e) {
            switch (e.key) {
                case KEYS.ENTER:
                    e.preventDefault();
                    this.executeCommand();
                    break;
                case KEYS.ARROW_UP:
                    e.preventDefault();
                    this.input.value = CommandSystem.getPrevious();
                    break;
                case KEYS.ARROW_DOWN:
                    e.preventDefault();
                    this.input.value = CommandSystem.getNext();
                    break;
            }
        },

        /**
         * Execute command from input
         */
        executeCommand() {
            const command = this.input.value.trim();
            if (!command) return;

            CommandSystem.addToHistory(command);
            const result = CommandSystem.execute(command);
            
            if (result) {
                this.addToHistoryDisplay(command, result);
            }
            
            this.input.value = '';
            CommandSystem.historyIndex = CommandSystem.history.length;
            this.scrollToBottom();
        },

        /**
         * Scroll history to bottom
         */
        scrollToBottom() {
            if (this.historyContainer) {
                this.historyContainer.scrollTop = this.historyContainer.scrollHeight;
            }
        },

        /**
         * Add command and output to history display
         * @param {string} command - Command text
         * @param {Object} result - Command result
         */
        addToHistoryDisplay(command, result) {
            if (!this.historyContainer) return;

            const item = this.createHistoryItem(command, result);
            this.historyContainer.appendChild(item);
            this.limitHistoryItems();
        },

        /**
         * Create history item element
         * @param {string} command - Command text
         * @param {Object} result - Command result
         * @returns {HTMLElement}
         */
        createHistoryItem(command, result) {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            // Command line
            const commandLine = document.createElement('div');
            commandLine.className = 'history-command';
            commandLine.innerHTML = `
                <span class="prompt-symbol">❯</span> 
                <span class="command-text">${Utils.escapeHtml(command)}</span>
            `;
            item.appendChild(commandLine);
            
            // Output
            if (result?.content) {
                const outputDiv = document.createElement('div');
                outputDiv.className = `history-output output-${result.type}`;
                outputDiv.innerHTML = `<pre>${Utils.escapeHtml(result.content)}</pre>`;
                item.appendChild(outputDiv);
            }
            
            return item;
        },

        /**
         * Limit number of displayed history items
         */
        limitHistoryItems() {
            const items = this.historyContainer.querySelectorAll('.history-item');
            if (items.length > CONFIG.maxHistoryItems) {
                items[0].remove();
            }
        }
    };

    // ============================================================================
    // SCROLL MANAGER
    // ============================================================================
    const ScrollManager = {
        /**
         * Initialize scroll manager
         */
        init() {
            this.setupIntersectionObserver();
            this.initScrollProgress();
            this.updateActiveNav();
        },

        /**
         * Setup intersection observer for sections
         */
        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { 
                threshold: 0.1, 
                rootMargin: '0px 0px -100px 0px' 
            });

            Utils.$$(SELECTORS.sections).forEach(section => {
                observer.observe(section);
            });
        },

        /**
         * Initialize scroll progress indicator
         */
        initScrollProgress() {
            const progressBar = Utils.$(SELECTORS.scrollProgressBar);
            const progressContainer = Utils.$(SELECTORS.scrollProgress);
            
            if (!progressBar || !progressContainer) return;

            const updateProgress = Utils.throttle(() => {
                const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                
                progressBar.style.width = `${scrolled}%`;
                progressContainer.setAttribute('aria-valuenow', Math.round(scrolled));
                
                if (window.scrollY > CONFIG.scrollThreshold) {
                    progressContainer.classList.add('visible');
                } else {
                    progressContainer.classList.remove('visible');
                }
            }, 10);

            window.addEventListener('scroll', updateProgress, { passive: true });
            updateProgress();
        },

        /**
         * Update active navigation link based on scroll position
         */
        updateActiveNav() {
            const sections = Utils.$$(`${SELECTORS.sections}[id]`);
            const navLinks = Utils.$$(SELECTORS.navLinks);

            const updateActive = Utils.throttle(() => {
                const scrollPos = window.scrollY + CONFIG.scrollOffset;
                let current = '';

                sections.forEach(section => {
                    const { offsetTop, offsetHeight } = section;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        current = section.id;
                    }
                });

                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === `#${current}`);
                });
            }, 100);

            window.addEventListener('scroll', updateActive, { passive: true });
            updateActive();
            this.setupSmoothScroll(navLinks);
        },

        /**
         * Setup smooth scroll for navigation links
         * @param {Array<Element>} navLinks - Navigation links
         */
        setupSmoothScroll(navLinks) {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    const target = Utils.$(href);
                    
                    if (target) {
                        const header = Utils.$(SELECTORS.header);
                        const offset = header ? header.offsetHeight : 0;
                        const targetPosition = target.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ============================================================================
    // APPLICATION INITIALIZER
    // ============================================================================
    const App = {
        /**
         * Initialize application
         */
        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        },

        /**
         * Start application
         */
        start() {
            CommandSystem.init();
            CommandInput.init();
            TerminalUI.init();
            ScrollManager.init();
            this.initHeroAnimation();
        },

        /**
         * Initialize hero section animation
         */
        initHeroAnimation() {
            const hero = Utils.$(SELECTORS.heroIntro);
            if (hero) {
                hero.style.opacity = '1';
                hero.style.transform = 'none';
            }
        }
    };

    // ============================================================================
    // START APPLICATION
    // ============================================================================
    App.init();
})();
