// Cyber Action Hub JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const toolsGrid = document.getElementById('toolsGrid');
    const searchInput = document.getElementById('toolSearch');
    
    // Action-oriented tools directory
    const hubTools = [
        // Financial Safety Tools
        {
            id: 'sebi-broker',
            action: 'Verify My Broker',
            category: 'Financial Safety',
            categoryTag: 'Financial Tool',
            categoryColor: 'gold',
            icon: 'fa-landmark',
            description: 'Verify the authenticity of your stock broker or investment advisor through SEBI\'s official registry.',
            link: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=26&smid=0',
            keywords: ['broker', 'sebi', 'stock', 'investment', 'financial', 'verify']
        },
        {
            id: 'rbi-bank',
            action: 'Check Bank Authenticity',
            category: 'Financial Safety',
            categoryTag: 'Financial Tool',
            categoryColor: 'gold',
            icon: 'fa-university',
            description: 'Verify if a bank is authorized by the Reserve Bank of India (RBI) and check its license status.',
            link: 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx',
            keywords: ['bank', 'rbi', 'financial', 'authenticity', 'verify', 'license']
        },
        
        // Telecom Hub Tools
        {
            id: 'ceir-block',
            action: 'Block Stolen Phone',
            category: 'Telecom Hub',
            categoryTag: 'Government Official',
            categoryColor: 'cyan',
            icon: 'fa-mobile-alt',
            description: 'Block your lost or stolen mobile phone through CEIR (Central Equipment Identity Register) to prevent misuse.',
            link: 'https://www.ceir.gov.in/Home/index.jsp',
            keywords: ['phone', 'mobile', 'stolen', 'lost', 'block', 'ceir', 'sim']
        },
        {
            id: 'tafcop-sims',
            action: 'See SIMs in My Name',
            category: 'Telecom Hub',
            categoryTag: 'Identity Security',
            categoryColor: 'cyan',
            icon: 'fa-sim-card',
            description: 'Check all mobile connections registered in your name through TAFCOP (Telecom Analytics for Fraud Management and Consumer Protection).',
            link: 'https://www.tafcop.sancharsaathi.gov.in/',
            keywords: ['sim', 'mobile', 'connection', 'name', 'tafcop', 'identity']
        },
        {
            id: 'sancharsaathi',
            action: 'Access Sanchar Saathi Portal',
            category: 'Telecom Hub',
            categoryTag: 'Government Official',
            categoryColor: 'cyan',
            icon: 'fa-shield-alt',
            description: 'Comprehensive portal by DoT for mobile security, blocking lost phones, verifying connections, and reporting fraud communications.',
            link: 'https://sancharsaathi.gov.in/',
            keywords: ['sanchar', 'saathi', 'mobile', 'security', 'telecom', 'chakshu', 'sim']
        },
        
        // Reporting Tools
        {
            id: 'cybercrime-report',
            action: 'File Cyber Complaint',
            category: 'Reporting',
            categoryTag: 'Government Official',
            categoryColor: 'red',
            icon: 'fa-exclamation-triangle',
            description: 'Report cybercrimes, online fraud, and digital security incidents through the official National Cyber Crime Reporting Portal.',
            link: 'https://cybercrime.gov.in/',
            keywords: ['report', 'complaint', 'cybercrime', 'fraud', 'crime', 'file']
        },
        {
            id: 'helpline-1930',
            action: 'Call Cyber Crime Helpline',
            category: 'Reporting',
            categoryTag: 'Emergency',
            categoryColor: 'red',
            icon: 'fa-phone-alt',
            description: 'Immediate assistance for cybercrime victims. Dial 1930 for the National Cyber Crime Helpline (available 24/7).',
            link: 'tel:1930',
            keywords: ['helpline', '1930', 'phone', 'call', 'emergency', 'help']
        },
        
        // Additional Security Tools
        {
            id: 'cert-in',
            action: 'View Security Alerts',
            category: 'Security',
            categoryTag: 'Government Official',
            categoryColor: 'blue',
            icon: 'fa-bell',
            description: 'Stay updated with the latest cybersecurity alerts and advisories from CERT-In (Indian Computer Emergency Response Team).',
            link: 'https://www.cert-in.org.in/',
            keywords: ['alert', 'security', 'cert', 'advisory', 'threat']
        },
        {
            id: 'digilocker',
            action: 'Access DigiLocker',
            category: 'Identity Security',
            categoryTag: 'Government Official',
            categoryColor: 'blue',
            icon: 'fa-cloud',
            description: 'Secure digital document storage platform by the Government of India. Store important documents safely in the cloud.',
            link: 'https://www.digilocker.gov.in/',
            keywords: ['digilocker', 'document', 'identity', 'storage', 'cloud']
        }
    ];
    
    // Render tools function
    function renderTools(toolList = hubTools) {
        if (!toolsGrid) return;
        
        if (!toolList || toolList.length === 0) {
            toolsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No tools found matching your search.</p>
                </div>
            `;
            return;
        }
        
        toolsGrid.innerHTML = toolList.map(tool => {
            // Determine icon color class based on category
            let iconColorClass = '';
            if (tool.categoryColor === 'gold') {
                iconColorClass = 'icon-gold';
            } else if (tool.categoryColor === 'cyan') {
                iconColorClass = 'icon-cyan';
            } else if (tool.categoryColor === 'red') {
                iconColorClass = 'icon-red';
            } else {
                iconColorClass = 'icon-blue';
            }
            
            return `
                <div class="tool-card">
                    <div class="tool-header">
                        <div class="tool-icon ${iconColorClass}">
                            <i class="fas ${tool.icon}"></i>
                        </div>
                        <div class="tool-meta">
                            <span class="category-tag category-${tool.categoryColor}">${tool.categoryTag}</span>
                        </div>
                    </div>
                    <div class="tool-content">
                        <h3 class="tool-action">${escapeHtml(tool.action)}</h3>
                        <p class="tool-description">${escapeHtml(tool.description)}</p>
                        <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="tool-cta">
                            <span>Take Action</span>
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Search functionality
    function searchTools(searchTerm) {
        if (!searchTerm.trim()) {
            renderTools(hubTools);
            return;
        }
        
        const term = searchTerm.toLowerCase();
        const filteredTools = hubTools.filter(tool => {
            return tool.action.toLowerCase().includes(term) ||
                   tool.description.toLowerCase().includes(term) ||
                   tool.category.toLowerCase().includes(term) ||
                   tool.keywords.some(keyword => keyword.toLowerCase().includes(term));
        });
        
        renderTools(filteredTools);
    }
    
    // Escape HTML function
    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTools(e.target.value);
        });
    }
    
    // Initialize
    renderTools();
});
