// Password Strength Checker JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleVisibility = document.getElementById('toggleVisibility');
    const strengthText = document.getElementById('strengthText');
    const strengthFill = document.getElementById('strengthFill');
    const securityAnalysis = document.getElementById('securityAnalysis');
    const analysisGrid = document.getElementById('analysisGrid');
    const recommendations = document.getElementById('recommendations');
    const recommendationsList = document.getElementById('recommendationsList');
    const contentGrid = document.getElementById('contentGrid');

    let isPasswordVisible = false;

    // Toggle password visibility
    toggleVisibility.addEventListener('click', function() {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? 'text' : 'password';
        toggleVisibility.innerHTML = isPasswordVisible ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    // Password strength analysis
    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        if (password.length === 0) {
            resetDisplay();
            return;
        }

        const analysis = analyzePassword(password);
        updateStrengthDisplay(analysis);
        updateSecurityAnalysis(analysis);
        updateRecommendations(analysis);
    });

    function analyzePassword(password) {
        const analysis = {
            length: password.length,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSymbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            hasCommonPatterns: checkCommonPatterns(password),
            hasRepeatedChars: /(.)\1{2,}/.test(password),
            hasSequentialChars: checkSequentialChars(password),
            hasCommonWords: checkCommonWords(password),
            score: 0,
            strength: 'very-weak'
        };

        // Calculate score
        if (analysis.length >= 8) analysis.score += 20;
        if (analysis.length >= 12) analysis.score += 10;
        if (analysis.length >= 16) analysis.score += 10;
        if (analysis.hasUppercase) analysis.score += 15;
        if (analysis.hasLowercase) analysis.score += 15;
        if (analysis.hasNumbers) analysis.score += 15;
        if (analysis.hasSymbols) analysis.score += 15;
        if (!analysis.hasCommonPatterns) analysis.score += 10;
        if (!analysis.hasRepeatedChars) analysis.score += 10;
        if (!analysis.hasSequentialChars) analysis.score += 10;
        if (!analysis.hasCommonWords) analysis.score += 10;

        // Determine strength
        if (analysis.score >= 90) analysis.strength = 'strong';
        else if (analysis.score >= 70) analysis.strength = 'good';
        else if (analysis.score >= 50) analysis.strength = 'fair';
        else if (analysis.score >= 30) analysis.strength = 'weak';
        else analysis.strength = 'very-weak';

        return analysis;
    }

    function checkCommonPatterns(password) {
        const commonPatterns = [
            /123456/,
            /password/i,
            /qwerty/i,
            /abc123/i,
            /admin/i,
            /letmein/i,
            /welcome/i,
            /monkey/i,
            /dragon/i,
            /master/i
        ];
        return commonPatterns.some(pattern => pattern.test(password));
    }

    function checkSequentialChars(password) {
        const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop', 'asdfghjkl'];
        return sequences.some(seq => {
            for (let i = 0; i <= seq.length - 3; i++) {
                if (password.toLowerCase().includes(seq.substring(i, i + 3))) {
                    return true;
                }
            }
            return false;
        });
    }

    function checkCommonWords(password) {
        const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'hello', 'test', 'demo'];
        return commonWords.some(word => password.toLowerCase().includes(word));
    }

    function updateStrengthDisplay(analysis) {
        const strengthLabels = {
            'very-weak': 'Very Weak',
            'weak': 'Weak',
            'fair': 'Fair',
            'good': 'Good',
            'strong': 'Strong'
        };

        strengthText.textContent = strengthLabels[analysis.strength];
        strengthFill.className = `strength-fill ${analysis.strength}`;
    }

    function updateSecurityAnalysis(analysis) {
        const analysisItems = [
            {
                label: 'Length (8+ chars)',
                valid: analysis.length >= 8,
                icon: analysis.length >= 8 ? 'fas fa-check' : 'fas fa-times'
            },
            {
                label: 'Uppercase Letters',
                valid: analysis.hasUppercase,
                icon: analysis.hasUppercase ? 'fas fa-check' : 'fas fa-times'
            },
            {
                label: 'Lowercase Letters',
                valid: analysis.hasLowercase,
                icon: analysis.hasLowercase ? 'fas fa-check' : 'fas fa-times'
            },
            {
                label: 'Numbers',
                valid: analysis.hasNumbers,
                icon: analysis.hasNumbers ? 'fas fa-check' : 'fas fa-times'
            },
            {
                label: 'Special Characters',
                valid: analysis.hasSymbols,
                icon: analysis.hasSymbols ? 'fas fa-check' : 'fas fa-times'
            },
            {
                label: 'No Common Patterns',
                valid: !analysis.hasCommonPatterns,
                icon: !analysis.hasCommonPatterns ? 'fas fa-check' : 'fas fa-times'
            }
        ];

        analysisGrid.innerHTML = analysisItems.map(item => `
            <div class="analysis-item ${item.valid ? 'valid' : 'invalid'}">
                <i class="${item.icon}"></i>
                <span>${item.label}</span>
            </div>
        `).join('');

        securityAnalysis.style.display = 'block';
    }

    function updateRecommendations(analysis) {
        const recs = [];
        
        if (analysis.length < 8) {
            recs.push('Use at least 8 characters for better security');
        }
        if (analysis.length < 12) {
            recs.push('Consider using 12+ characters for maximum security');
        }
        if (!analysis.hasUppercase) {
            recs.push('Include uppercase letters (A-Z)');
        }
        if (!analysis.hasLowercase) {
            recs.push('Include lowercase letters (a-z)');
        }
        if (!analysis.hasNumbers) {
            recs.push('Add numbers (0-9) to your password');
        }
        if (!analysis.hasSymbols) {
            recs.push('Include special characters (!@#$%^&*)');
        }
        if (analysis.hasCommonPatterns) {
            recs.push('Avoid common patterns like "123456" or "password"');
        }
        if (analysis.hasRepeatedChars) {
            recs.push('Avoid repeating characters (aaa, 111)');
        }
        if (analysis.hasSequentialChars) {
            recs.push('Avoid sequential characters (abc, 123)');
        }
        if (analysis.hasCommonWords) {
            recs.push('Avoid common dictionary words');
        }

        if (recs.length === 0) {
            recs.push('Excellent! Your password meets all security requirements');
        }

        recommendationsList.innerHTML = recs.map(rec => `
            <div class="recommendation-item">
                <i class="fas fa-lightbulb"></i>
                <span>${rec}</span>
            </div>
        `).join('');

        recommendations.style.display = 'block';
    }

    function resetDisplay() {
        strengthText.textContent = 'Enter a password';
        strengthFill.className = 'strength-fill';
        strengthFill.style.width = '0%';
        securityAnalysis.style.display = 'none';
        recommendations.style.display = 'none';
    }

    // Educational content
    function loadEducationalContent() {
        const educationalContent = [
            {
                title: "Password Best Practices",
                items: [
                    "Use a unique password for each account",
                    "Create passwords with 12+ characters",
                    "Combine letters, numbers, and symbols",
                    "Avoid personal information in passwords",
                    "Use a password manager for security"
                ]
            },
            {
                title: "Common Password Mistakes",
                items: [
                    "Using the same password everywhere",
                    "Including personal information",
                    "Using dictionary words",
                    "Creating predictable patterns",
                    "Not changing default passwords"
                ]
            },
            {
                title: "Password Security Tips",
                items: [
                    "Enable two-factor authentication",
                    "Regularly update your passwords",
                    "Never share passwords with others",
                    "Use passphrases for better security",
                    "Monitor for data breaches"
                ]
            }
        ];

        contentGrid.innerHTML = educationalContent.map(content => `
            <div class="education-card">
                <h3>${content.title}</h3>
                <ul>
                    ${content.items.map(item => `<li><i class="fas fa-shield-alt"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // Initialize
    loadEducationalContent();
});
