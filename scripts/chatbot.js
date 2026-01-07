// Cyber Ranger Chatbot
class CyberRangerChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messageCount = 0;
        this.conversationHistory = [];
        
        this.initializeElements();
        this.bindEvents();
        this.hideBadge();
    }

    initializeElements() {
        this.container = document.getElementById('chatbot-container');
        this.toggle = document.getElementById('chatbot-toggle');
        this.window = document.getElementById('chatbot-window');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.badge = document.getElementById('chatbot-badge');
        this.minimizeBtn = document.getElementById('chatbot-minimize');
        this.closeBtn = document.getElementById('chatbot-close');
        this.quickActions = document.querySelectorAll('.quick-action-btn');
    }

    bindEvents() {
        // Toggle chatbot
        this.toggle.addEventListener('click', () => this.toggleChatbot());
        
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Window controls
        this.minimizeBtn.addEventListener('click', () => this.minimizeChatbot());
        this.closeBtn.addEventListener('click', () => this.closeChatbot());
        
        // Quick actions
        this.quickActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                this.input.value = message;
                this.sendMessage();
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && this.isOpen) {
                this.closeChatbot();
            }
        });
        
        // Mobile keyboard handling to keep input visible
        this.input.addEventListener('focus', () => this.handleKeyboardOpen());
        this.input.addEventListener('blur', () => this.handleKeyboardClose());
        
        // Handle visual viewport changes (for mobile browsers that support it)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                if (this.isOpen && document.activeElement === this.input) {
                    this.handleKeyboardOpen();
                }
            });
        }
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        this.window.classList.add('active');
        this.isOpen = true;
        this.hideBadge();
        this.input.focus();
        // Ensure content is visible and scrollable
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }

    closeChatbot() {
        this.window.classList.remove('active');
        this.isOpen = false;
    }

    minimizeChatbot() {
        this.window.style.height = '60px';
        this.isMinimized = true;
        this.minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';
        this.sendBtn.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message after delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getResponse(message);
            this.addMessage(response, 'bot');
            this.sendBtn.disabled = false;
        }, 1000 + Math.random() * 1000);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (typeof content === 'string') {
            messageContent.innerHTML = this.formatMessage(content);
        } else {
            messageContent.appendChild(content);
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        this.messages.appendChild(messageDiv);
        
        this.scrollToBottom();
        
        this.conversationHistory.push({ content, sender, timestamp: Date.now() });
    }

    formatMessage(message) {
        // Convert URLs to links
        message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Convert phone numbers
        message = message.replace(/(\d{3,4}\s?\d{3,4}\s?\d{3,4})/g, '<a href="tel:$1">$1</a>');
        
        // Convert email addresses
        message = message.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
        
        return message;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'typing-dots';
        typingContent.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        this.messages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting responses
        if (this.containsAny(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            return "Hello! I'm your Cyber Ranger Assistant. How can I help you stay safe online today?";
        }
        
        // Password security
        if (this.containsAny(lowerMessage, ['password', 'strong password', 'password tips', 'create password'])) {
            return `Here are some password security tips:
            <ul>
                <li>Use at least 12 characters with a mix of letters, numbers, and symbols</li>
                <li>Avoid common words, personal information, or patterns</li>
                <li>Use unique passwords for each account</li>
                <li>Consider using a password manager</li>
                <li>Enable two-factor authentication when available</li>
            </ul>
            You can also use our <a href="../Webpages/password-checker.html">Password Checker Tool</a>  to test your password strength!`;
        }
        
        // Cyber threats
        if (this.containsAny(lowerMessage, ['threats', 'cyber threats', 'malware', 'virus', 'phishing', 'scam'])) {
            return `Common cyber threats include:
            <ul>
                <li><strong>Phishing:</strong> Fake emails/messages trying to steal your information</li>
                <li><strong>Malware:</strong> Malicious software that can damage your device</li>
                <li><strong>Ransomware:</strong> Software that locks your files until you pay</li>
                <li><strong>Social Engineering:</strong> Manipulation to trick you into revealing information</li>
                <li><strong>Identity Theft:</strong> Using your personal information fraudulently</li>
            </ul>
            Check out our<a href="../Webpages/password-checker.html" target="_blank">Password Checker Tool</a> 
                   to test your password strength!`;
        }
        
        // Reporting cybercrime
        if (this.containsAny(lowerMessage, ['report', 'cybercrime', 'fraud', 'scam', 'helpline', 'police'])) {
            return `To report cybercrime in Goa:
            <ul>
                <li><strong>Emergency:</strong> Dial 1930 (National Cyber Crime Helpline)</li>
                <li><strong>Goa Police Cyber Cell:</strong> 0832 244 3201</li>
                <li><strong>Email:</strong> picyber@goapolice.gov.in</li>
                <li><strong>Location:</strong> Cyber Crime Police Station, Ribandar, Goa</li>
                <li><strong>Online:</strong> Visit <a href="https://cybercrime.gov.in/" target="_blank">cybercrime.gov.in</a></li>
            </ul>
            Remember to save evidence like screenshots, emails, or messages before reporting!`;
        }
        
        // Events
        if (this.containsAny(lowerMessage, ['events', 'workshop', 'training', 'seminar', 'show me events'])) {
            return `We have several cybersecurity events coming up! Check out our <a href="Webpages/events.html">Events page</a> for:
            <ul>
                <li>Cybersecurity workshops across Goa</li>
                <li>Digital banking security seminars</li>
                <li>Senior citizen cyber safety programs</li>
                <li>Student awareness workshops</li>
                <li>Small business training sessions</li>
            </ul>
            All events are free and open to the public. Register early as spaces are limited!`;
        }
        
        // Resources
        if (this.containsAny(lowerMessage, ['resources', 'learn', 'education', 'courses', 'tools'])) {
            return `We offer various cybersecurity resources:
            <ul>
                <li><a href="Webpages/courses.html">Learning Center</a> - Free cybersecurity courses</li>
                <li><a href="Webpages/Sanchar_saathi.html">Sanchar Saathi</a> - Mobile security app</li>
                <li><a href="Webpages/cyber-news.html">Cyber News</a> - Latest threat updates</li>
                <li><a href="Webpages/cyber-myths.html">Cyber Myths</a> - Debunking false information</li>
                <li><a href="Webpages/password-checker.html">Password Checker</a> - Test your password strength</li>
            </ul>
            All resources are free and designed to help you stay safe online!`;
        }
        
        // Sanchar Saathi
        if (this.containsAny(lowerMessage, ['sanchar saathi', 'mobile app', 'phone security', 'sim card'])) {
            return `Sanchar Saathi is a mobile security app by the Department of Telecommunications:
            <ul>
                <li>Block lost or stolen phones</li>
                <li>Verify mobile connections</li>
                <li>Report suspicious activities</li>
                <li>Get security alerts</li>
            </ul>
            Learn more about it on our <a href="Webpages/Sanchar_saathi.html">Sanchar Saathi page</a>!`;
        }
        
        // Help/Support
        if (this.containsAny(lowerMessage, ['help', 'support', 'what can you do', 'assist'])) {
            return `I can help you with:
            <ul>
                <li>Cybersecurity questions and advice</li>
                <li>Password security tips</li>
                <li>How to report cybercrimes</li>
                <li>Finding educational resources</li>
                <li>Information about our events</li>
                <li>General online safety guidance</li>
            </ul>
            Just ask me anything about cybersecurity!`;
        }
        
        // Default response
        return `I understand you're asking about "${message}". While I'm still learning, I can help you with:
        <ul>
            <li>Password security tips</li>
            <li>Common cyber threats</li>
            <li>How to report cybercrimes</li>
            <li>Our educational resources</li>
            <li>Upcoming events</li>
        </ul>
        Could you rephrase your question or try one of the quick action buttons above?`;
    }

    containsAny(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    }

    handleKeyboardOpen() {
        // Ensure input container is visible when keyboard opens
        if (window.innerWidth <= 768) {
            const inputContainer = this.input.closest('.chatbot-input-container');
            if (inputContainer) {
                // Scroll input into view
                setTimeout(() => {
                    inputContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    this.input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
                
                // Add class for CSS adjustments if needed
                this.window.classList.add('keyboard-open');
            }
        }
    }

    handleKeyboardClose() {
        // Remove keyboard-open class when keyboard closes
        if (window.innerWidth <= 768) {
            this.window.classList.remove('keyboard-open');
        }
    }

    scrollToBottom() {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 50);
    }

    hideBadge() {
        if (this.badge) {
            this.badge.style.display = 'none';
        }
    }

    showBadge() {
        if (this.badge) {
            this.badge.style.display = 'flex';
            this.messageCount++;
            this.badge.textContent = this.messageCount;
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if chatbot elements exist before initializing
    if (document.getElementById('chatbot-container')) {
        new CyberRangerChatbot();
    }
});

// Add chatbot to other pages that don't have it yet
function addChatbotToPage() {
    // This function can be called to add chatbot to pages that don't have it
    const chatbotHTML = `
    <div id="chatbot-container">
        <div id="chatbot-toggle" class="chatbot-toggle">
            <i class="fas fa-robot"></i>
            <span class="chatbot-badge" id="chatbot-badge">1</span>
        </div>
        <div id="chatbot-window" class="chatbot-window">
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <i class="fas fa-shield-alt"></i>
                    <span>Cyber Ranger Assistant</span>
                </div>
                <div class="chatbot-controls">
                    <button id="chatbot-minimize" class="chatbot-btn">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button id="chatbot-close" class="chatbot-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="chatbot-body">
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="chatbot-message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Hello! I'm your Cyber Ranger Assistant. I can help you with:</p>
                            <ul>
                                <li>Cybersecurity questions</li>
                                <li>Password security tips</li>
                                <li>Reporting cybercrimes</li>
                                <li>Finding resources</li>
                            </ul>
                            <p>How can I assist you today?</p>
                        </div>
                    </div>
                </div>
                <div class="chatbot-input-container">
                    <div class="chatbot-quick-actions">
                        <button class="quick-action-btn" data-message="How do I create a strong password?">Password Tips</button>
                        <button class="quick-action-btn" data-message="How to report cybercrime?">Report Crime</button>
                        <button class="quick-action-btn" data-message="What are common cyber threats?">Cyber Threats</button>
                        <button class="quick-action-btn" data-message="Show me events">Events</button>
                    </div>
                    <div class="chatbot-input-wrapper">
                        <input type="text" id="chatbot-input" placeholder="Ask me anything about cybersecurity..." maxlength="500">
                        <button id="chatbot-send" class="chatbot-send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    // Add to body if not already present
    if (!document.getElementById('chatbot-container')) {
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        new CyberRangerChatbot();
    }
}
