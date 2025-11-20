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
            // Initialize background animation first
            this.initSiteCanvas();
            CommandSystem.init();
            CommandInput.init();
            TerminalUI.init();
            ScrollManager.init();
            this.initHeroAnimation();
            this.initAnimationToggle();
            this.initTerminalHint();
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
            this.initTypingAnimation();
        },

        /**
         * Initialize site-wide network node animation (infrastructure connections)
         */
        initSiteCanvas() {
            const canvas = Utils.$('#siteCanvas');
            if (!canvas) {
                console.warn('Site canvas not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.warn('Canvas context not available');
                return;
            }
            
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();

            // Network nodes (representing infrastructure/services/pods)
            const nodes = [];
            const nodeCount = 30; // More nodes for better mesh representation
            const connectionDistance = 220; // Increased distance for better connections

            // Create nodes in a more distributed pattern (like service mesh)
            const cols = Math.ceil(Math.sqrt(nodeCount));
            const rows = Math.ceil(nodeCount / cols);
            const cellWidth = canvas.width / cols;
            const cellHeight = canvas.height / rows;

            for (let i = 0; i < nodeCount; i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                nodes.push({
                    x: (col + 0.5) * cellWidth + (Math.random() - 0.5) * cellWidth * 0.4,
                    y: (row + 0.5) * cellHeight + (Math.random() - 0.5) * cellHeight * 0.4,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.15,
                    radius: Math.random() * 1.5 + 2,
                    pulse: Math.random() * Math.PI * 2,
                    connections: [] // Track connections for service mesh visualization
                });
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Update node positions (subtle movement)
                nodes.forEach(node => {
                    node.x += node.vx;
                    node.y += node.vy;
                    node.pulse += 0.02;

                    // Bounce off edges
                    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                    // Keep nodes within bounds
                    node.x = Math.max(0, Math.min(canvas.width, node.x));
                    node.y = Math.max(0, Math.min(canvas.height, node.y));
                });

                // Draw service mesh connections (more visible, represents infrastructure)
                nodes.forEach((node, i) => {
                    node.connections = [];
                    nodes.slice(i + 1).forEach((otherNode, j) => {
                        const dx = node.x - otherNode.x;
                        const dy = node.y - otherNode.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < connectionDistance) {
                            // Stronger connections for service mesh visualization
                            const distanceRatio = dist / connectionDistance;
                            const opacity = (1 - distanceRatio) * 0.3; // Increased opacity
                            const lineWidth = (1 - distanceRatio) * 1 + 0.3; // Thicker lines for closer nodes
                            
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(otherNode.x, otherNode.y);
                            
                            // Gradient for connection lines (service mesh style)
                            const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
                            gradient.addColorStop(0, `rgba(189, 147, 249, ${opacity})`);
                            gradient.addColorStop(0.5, `rgba(139, 233, 253, ${opacity * 0.8})`);
                            gradient.addColorStop(1, `rgba(189, 147, 249, ${opacity})`);
                            
                            ctx.strokeStyle = gradient;
                            ctx.lineWidth = lineWidth;
                            ctx.stroke();
                            
                            node.connections.push(otherNode);
                        }
                    });
                });

                // Draw service nodes (pods/services in mesh)
                nodes.forEach(node => {
                    // Pulsing effect (represents active services)
                    const pulseSize = node.radius + Math.sin(node.pulse) * 0.8;
                    const baseOpacity = 0.5;
                    const opacity = baseOpacity + Math.sin(node.pulse) * 0.3;
                    
                    // Outer ring (service boundary)
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(139, 233, 253, ${opacity * 0.3})`;
                    ctx.fill();
                    
                    // Main node (service/pod)
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, pulseSize * 0.7, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(139, 233, 253, ${opacity})`;
                    ctx.fill();
                    
                    // Inner core (active service indicator)
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, pulseSize * 0.3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(189, 147, 249, ${opacity * 0.8})`;
                    ctx.fill();
                    
                    // Connection count indicator (more connections = brighter)
                    if (node.connections.length > 2) {
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, pulseSize * 1.2, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(80, 250, 123, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });

                requestAnimationFrame(animate);
            }

            animate();

            window.addEventListener('resize', () => {
                resizeCanvas();
                // Reposition nodes on resize
                const cols = Math.ceil(Math.sqrt(nodeCount));
                const rows = Math.ceil(nodeCount / cols);
                const cellWidth = canvas.width / cols;
                const cellHeight = canvas.height / rows;
                
                nodes.forEach((node, i) => {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    node.x = (col + 0.5) * cellWidth;
                    node.y = (row + 0.5) * cellHeight;
                });
            });
        },

        /**
         * Initialize typing animation for code
         */
        initTypingAnimation() {
            const codeEl = Utils.$('#typedCode');
            if (!codeEl) return;

            const originalHTML = codeEl.innerHTML;
            codeEl.innerHTML = '';
            codeEl.style.opacity = '0';

            setTimeout(() => {
                codeEl.style.transition = 'opacity 0.5s';
                codeEl.innerHTML = originalHTML;
                codeEl.style.opacity = '1';
            }, 300);
        },

        /**
         * Initialize animation toggle
         */
        initAnimationToggle() {
            const toggle = Utils.$('#animToggle');
            if (!toggle) return;

            const STORAGE_KEY = 'animations-enabled';
            const isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';
            
            // Check for system preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (prefersReducedMotion || !isEnabled) {
                document.documentElement.classList.add('reduced-motion');
                toggle.classList.add('active');
            }

            toggle.addEventListener('click', () => {
                const isReduced = document.documentElement.classList.contains('reduced-motion');
                
                if (isReduced) {
                    document.documentElement.classList.remove('reduced-motion');
                    toggle.classList.remove('active');
                    localStorage.setItem(STORAGE_KEY, 'true');
                    // Restart canvas animation
                    this.initSiteCanvas();
                } else {
                    document.documentElement.classList.add('reduced-motion');
                    toggle.classList.add('active');
                    localStorage.setItem(STORAGE_KEY, 'false');
                }
            });
        },

        /**
         * Initialize terminal hint for first-time visitors
         */
        initTerminalHint() {
            const hint = Utils.$('#terminalHint');
            const closeBtn = Utils.$('#closeHint');
            if (!hint || !closeBtn) return;

            const STORAGE_KEY = 'terminal-hint-seen';
            const hasSeenHint = localStorage.getItem(STORAGE_KEY) === 'true';

            if (!hasSeenHint) {
                // Show hint after a short delay
                setTimeout(() => {
                    hint.classList.add('visible');
                    hint.setAttribute('aria-hidden', 'false');
                }, 2000);
            }

            const hideHint = () => {
                hint.classList.remove('visible');
                hint.setAttribute('aria-hidden', 'true');
                localStorage.setItem(STORAGE_KEY, 'true');
            };

            closeBtn.addEventListener('click', hideHint);

            // Also hide when user starts typing in terminal
            const commandInput = Utils.$(SELECTORS.commandInput);
            if (commandInput) {
                commandInput.addEventListener('focus', () => {
                    if (hint.classList.contains('visible')) {
                        hideHint();
                    }
                }, { once: true });
            }
        }
    };

    // ============================================================================
    // START APPLICATION
    // ============================================================================
    App.init();
})();
