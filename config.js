// Configuration state
let config = {
    network: 'mainnet',
    tokenAddress: '',
    feeCollectorAddress: '',
    feeCollectorPrivateKey: '',
    slerfTokenAddress: '',
    slerfRoyaltyAddress: '',
    slerfRoyaltyPrivateKey: '',
    minimumHolding: 0,
    distributionInterval: 5,
    taxThreshold: 0.1,
    enableAutoCollection: false,
    distributionCurrency: 'token',
    excludeTopHolders: false,
    excludedWallets: [],
    // Network settings
    customRpcUrl: '',
    jupiterApiKey: '' // Jupiter API key is now required for optimal usage (2025 update)
};

// Ultra-simple tab implementation with direct DOM manipulation
function setupTabs() {
    console.log("Setting up tabs with ultra-simple approach...");
    
    // Get all tab buttons and content elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabButtons || tabButtons.length === 0) {
        console.error("No tab buttons found!");
        return;
    }
    
    if (!tabContents || tabContents.length === 0) {
        console.error("No tab contents found!");
        return;
    }
    
    console.log(`Found ${tabButtons.length} tab buttons and ${tabContents.length} tab contents`);
    
    // Hide all tab contents initially
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
        tabContents[i].classList.remove('active');
    }
    
    // Add click handlers to tab buttons
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            console.log(`Tab button clicked: ${tabId}`);
            
            // Remove active class from all buttons
            for (let j = 0; j < tabButtons.length; j++) {
                tabButtons[j].classList.remove('active');
            }
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            for (let j = 0; j < tabContents.length; j++) {
                tabContents[j].style.display = 'none';
                tabContents[j].classList.remove('active');
            }
            
            // Show the selected tab content
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.style.display = 'block';
                tabContent.classList.add('active');
                console.log(`Activated tab content: ${tabId}-tab`);
            } else {
                console.error(`Tab content not found: ${tabId}-tab`);
            }
        });
    }
    
    // Activate the first tab by default
    if (tabButtons.length > 0) {
        // Force a click event on the first tab button
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        tabButtons[0].dispatchEvent(event);
    }
}

// Function to switch to a specific tab programmatically
function switchToTab(tabId) {
    console.log(`Switching to tab: ${tabId}`);
    const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    
    if (tabButton) {
        // Force a click event
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        tabButton.dispatchEvent(event);
        return true;
    } else {
        console.error(`Tab button not found for tab: ${tabId}`);
        return false;
    }
}

// Setup checkbox toggles for showing/hiding related form groups
function setupCheckboxToggles() {
    // Custom RPC toggle
    const useCustomRpc = document.getElementById('useCustomRpc');
    const customRpcGroup = document.getElementById('customRpcGroup');
    
    if (useCustomRpc && customRpcGroup) {
        useCustomRpc.addEventListener('change', function() {
            if (this.checked) {
                customRpcGroup.style.display = 'block';
                
                // If custom RPC is enabled, disable Helius
                const useHelius = document.getElementById('useHelius');
                if (useHelius) {
                    useHelius.checked = false;
                    const heliusGroup = document.getElementById('heliusGroup');
                    if (heliusGroup) {
                        heliusGroup.style.display = 'none';
                    }
                }
            } else {
                customRpcGroup.style.display = 'none';
            }
        });
    }
    
    // Helius RPC toggle
    const useHelius = document.getElementById('useHelius');
    const heliusGroup = document.getElementById('heliusGroup');
    
    if (useHelius && heliusGroup) {
        useHelius.addEventListener('change', function() {
            if (this.checked) {
                heliusGroup.style.display = 'block';
                
                // If Helius is enabled, disable custom RPC
                const useCustomRpc = document.getElementById('useCustomRpc');
                if (useCustomRpc) {
                    useCustomRpc.checked = false;
                    const customRpcGroup = document.getElementById('customRpcGroup');
                    if (customRpcGroup) {
                        customRpcGroup.style.display = 'none';
                    }
                }
            } else {
                heliusGroup.style.display = 'none';
            }
        });
    }
    
    // Excluded wallets toggle
    const excludeTopHolders = document.getElementById('excludeTopHolders');
    const excludedWalletsGroup = document.getElementById('excludedWalletsGroup');
    
    if (excludeTopHolders && excludedWalletsGroup) {
        excludeTopHolders.addEventListener('change', function() {
            excludedWalletsGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// Initialize configuration page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing configuration page...');
    
    // Initialize tabs
    initTabs();
    
    // Load configuration
    loadConfig();
    
    // Set up event listeners
    document.getElementById('saveConfig').addEventListener('click', saveConfig);
    document.getElementById('saveNetworkSettings').addEventListener('click', saveNetworkSettings);
    document.getElementById('saveSlerfConfig').addEventListener('click', saveSlerfConfig);
    
    // Set up validation for private keys
            const privateKeyInput = document.getElementById('feeCollectorPrivateKey');
            if (privateKeyInput) {
        privateKeyInput.addEventListener('blur', function() {
            validatePrivateKeyAgainstAddress(
                this.value,
                'base58',
                document.getElementById('walletAddress')
            );
        });
    }
    
    // Set up validation for Slerf private key
    const slerfPrivateKeyInput = document.getElementById('slerfPrivateKey');
    if (slerfPrivateKeyInput) {
        slerfPrivateKeyInput.addEventListener('blur', function() {
            validatePrivateKeyAgainstAddress(
                this.value,
                'base58',
                document.getElementById('slerfFeeCollectorAddress')
            );
        });
    }
    
    console.log('Configuration page initialized');
});

// Initialize tabs
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Set first tab as active by default
    if (tabs.length > 0 && tabContents.length > 0) {
        tabs[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
        });
    }
    
    // Load configuration
function loadConfig() {
    try {
        console.log('Loading configuration...');
        
        // Check for configuration in both tokenConfig and taxDistributorConfig (for backward compatibility)
        let config = {};
        
        const tokenConfig = localStorage.getItem('tokenConfig');
        const taxDistributorConfig = localStorage.getItem('taxDistributorConfig');
        
        if (tokenConfig) {
            console.log('Loading configuration from tokenConfig');
            config = JSON.parse(tokenConfig);
        } else if (taxDistributorConfig) {
            console.log('Loading configuration from taxDistributorConfig');
            config = JSON.parse(taxDistributorConfig);
        }
        
        // Load network settings
        const networkSettings = localStorage.getItem('networkSettings');
        if (networkSettings) {
            const parsedNetworkSettings = JSON.parse(networkSettings);
            console.log('Network settings loaded:', parsedNetworkSettings);
            
            // Merge network settings with config
            config = { ...config, ...parsedNetworkSettings };
        }
        
        // Populate form fields with saved values
        if (config.tokenAddress) {
            const tokenAddressInput = document.getElementById('tokenAddress');
            if (tokenAddressInput) tokenAddressInput.value = config.tokenAddress;
        }
        
        if (config.feeCollectorAddress) {
            const feeCollectorAddressInput = document.getElementById('feeCollectorAddress');
            if (feeCollectorAddressInput) feeCollectorAddressInput.value = config.feeCollectorAddress;
        }
        
        if (config.feeCollectorPrivateKey) {
            const feeCollectorPrivateKeyInput = document.getElementById('feeCollectorPrivateKey');
            if (feeCollectorPrivateKeyInput) {
                // Decrypt private key if needed
                if (config.feeCollectorPrivateKey.startsWith('encrypted:')) {
                    feeCollectorPrivateKeyInput.value = decryptPrivateKey(config.feeCollectorPrivateKey);
                } else {
                    feeCollectorPrivateKeyInput.value = config.feeCollectorPrivateKey;
                }
            }
        }
        
        if (config.walletAddress) {
            const walletAddressInput = document.getElementById('walletAddress');
            if (walletAddressInput) walletAddressInput.value = config.walletAddress;
        }
        
        if (config.distributionCurrency) {
            const distributionCurrencySelect = document.getElementById('distributionCurrency');
            if (distributionCurrencySelect) distributionCurrencySelect.value = config.distributionCurrency;
        }
        
        if (config.enableAutoCollection !== undefined) {
            const autoCollectCheckbox = document.getElementById('autoCollect');
            if (autoCollectCheckbox) autoCollectCheckbox.checked = config.enableAutoCollection;
        }
        
        if (config.collectionInterval) {
            const collectionIntervalInput = document.getElementById('collectionInterval');
            if (collectionIntervalInput) collectionIntervalInput.value = config.collectionInterval;
        }
        
        if (config.taxThreshold) {
            const taxThresholdInput = document.getElementById('taxThreshold');
            if (taxThresholdInput) taxThresholdInput.value = config.taxThreshold;
        }
        
        if (config.minHoldings) {
            const minHoldingsInput = document.getElementById('minHoldings');
            if (minHoldingsInput) minHoldingsInput.value = config.minHoldings;
        }
        
        if (config.excludedWallets) {
            const excludedWalletsTextarea = document.getElementById('excludedWallets');
            if (excludedWalletsTextarea) excludedWalletsTextarea.value = config.excludedWallets;
        }
        
        // Network is always mainnet
        const networkRadio = document.querySelector('input[name="network"][value="mainnet"]');
        if (networkRadio) networkRadio.checked = true;
        
        if (config.customRpcUrl) {
            const customRpcUrlInput = document.getElementById('customRpcUrl');
            if (customRpcUrlInput) customRpcUrlInput.value = config.customRpcUrl;
        }
        
        // Handle legacy Helius API key - convert to custom RPC URL if present
        if (config.heliusApiKey && !config.customRpcUrl) {
            const customRpcUrlInput = document.getElementById('customRpcUrl');
            if (customRpcUrlInput) {
                const heliusUrl = `https://rpc.helius.xyz/?api-key=${config.heliusApiKey}`;
                customRpcUrlInput.value = heliusUrl;
                console.log('Converted legacy Helius API key to custom RPC URL');
            }
        }
        
        if (config.jupiterApiKey) {
            const jupiterApiKeyInput = document.getElementById('jupiterApiKey');
            if (jupiterApiKeyInput) jupiterApiKeyInput.value = config.jupiterApiKey;
        }
        
        // Load Slerf configuration
        if (config.slerfTokenAddress) {
            const slerfTokenAddressInput = document.getElementById('slerfTokenAddress');
            if (slerfTokenAddressInput) slerfTokenAddressInput.value = config.slerfTokenAddress;
        }
        
        if (config.slerfFeeCollectorAddress) {
            const slerfFeeCollectorAddressInput = document.getElementById('slerfFeeCollectorAddress');
            if (slerfFeeCollectorAddressInput) slerfFeeCollectorAddressInput.value = config.slerfFeeCollectorAddress;
        }
        
        if (config.slerfPrivateKey) {
            const slerfPrivateKeyInput = document.getElementById('slerfPrivateKey');
            if (slerfPrivateKeyInput) {
                // Decrypt private key if needed
                if (config.slerfPrivateKey.startsWith('encrypted:')) {
                    slerfPrivateKeyInput.value = decryptPrivateKey(config.slerfPrivateKey);
                } else {
                    slerfPrivateKeyInput.value = config.slerfPrivateKey;
                }
            }
        }
        
        console.log('Configuration loaded successfully');
        showToast('Configuration loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading configuration:', error);
        showToast('Error loading configuration: ' + error.message, 'error');
    }
}

// Save configuration
function saveConfig() {
    try {
        console.log('Saving configuration...');
        
        // Get form values
        const tokenAddress = document.getElementById('tokenAddress').value.trim();
        const feeCollectorAddress = document.getElementById('feeCollectorAddress').value.trim();
        const feeCollectorPrivateKey = document.getElementById('feeCollectorPrivateKey').value.trim();
        const walletAddress = document.getElementById('walletAddress').value.trim();
        const distributionCurrency = document.getElementById('distributionCurrency').value;
        const enableAutoCollection = document.getElementById('autoCollect').checked;
        const collectionInterval = parseInt(document.getElementById('collectionInterval').value) || 60;
        const taxThreshold = parseFloat(document.getElementById('taxThreshold').value) || 0;
        const minHoldings = parseFloat(document.getElementById('minHoldings').value) || 0;
        const excludedWallets = document.getElementById('excludedWallets').value.trim();
        
        // Validate required fields
        if (!tokenAddress) {
            showToast('Token address is required', 'error');
            return;
        }
        
        if (!feeCollectorAddress) {
            showToast('Fee collector address is required', 'error');
            return;
        }
        
        // Create configuration object
        const config = {
            network: 'mainnet', // Always use mainnet
            tokenAddress,
            feeCollectorAddress,
            feeCollectorPrivateKey: feeCollectorPrivateKey ? encryptPrivateKey(feeCollectorPrivateKey) : '',
            walletAddress,
            distributionCurrency,
            enableAutoCollection,
            collectionInterval,
            taxThreshold,
            minHoldings,
            excludedWallets
        };
        
        // Load network settings
        const networkSettings = localStorage.getItem('networkSettings');
        if (networkSettings) {
            const parsedNetworkSettings = JSON.parse(networkSettings);
            
            // Merge network settings with config
            Object.assign(config, parsedNetworkSettings);
        }
        
        // Save configuration to localStorage (both keys for backward compatibility)
        localStorage.setItem('tokenConfig', JSON.stringify(config));
        localStorage.setItem('taxDistributorConfig', JSON.stringify(config));
        
        console.log('Configuration saved successfully');
        showToast('Configuration saved successfully', 'success');
        
        // Update network indicator
        updateNetworkIndicator('mainnet');
        
        return true;
    } catch (error) {
        console.error('Error saving configuration:', error);
        showToast('Error saving configuration: ' + error.message, 'error');
        return false;
    }
}

// Save network settings
function saveNetworkSettings() {
    try {
        console.log('Saving network settings...');
        
        // Get form values
        const network = 'mainnet'; // Always use mainnet
        const customRpcUrl = document.getElementById('customRpcUrl').value.trim();
        const jupiterApiKey = document.getElementById('jupiterApiKey').value.trim();
        
        // Create network settings object
        const networkSettings = {
            network,
            customRpcUrl,
            jupiterApiKey
        };
        
        // Save to localStorage
        localStorage.setItem('networkSettings', JSON.stringify(networkSettings));
        
        // Also save to config.json for Node.js processes
        try {
            // Use fetch to call a server endpoint to save the config
            fetch('/api/save-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customRpcUrl,
                    network
                })
            }).then(response => {
                if (!response.ok) {
                    console.error('Failed to save config to server:', response.statusText);
                }
            }).catch(error => {
                console.error('Error saving config to server:', error);
            });
        } catch (fsError) {
            console.error('Error saving to config.json:', fsError);
        }
        
        // Update network indicator
        updateNetworkIndicator(networkSettings);
        
        // Reinitialize Solana connection with new settings
        if (window.initializeSolana) {
            window.initializeSolana();
        }
        
        console.log('Network settings saved successfully');
        showToast('Network settings saved successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error saving network settings:', error);
        showToast('Error saving network settings: ' + error.message, 'error');
        return false;
    }
}

// Save Slerf configuration
function saveSlerfConfig() {
    try {
        console.log('Saving Slerf configuration...');
        
        // Get form values
        const slerfTokenAddress = document.getElementById('slerfTokenAddress').value.trim();
        const slerfFeeCollectorAddress = document.getElementById('slerfFeeCollectorAddress').value.trim();
        const slerfPrivateKey = document.getElementById('slerfPrivateKey').value.trim();
        
        // Validate required fields
        if (!slerfTokenAddress) {
            showToast('Slerf token address is required', 'error');
            return;
        }
        
        // Update main configuration with Slerf values
        document.getElementById('tokenAddress').value = slerfTokenAddress;
        document.getElementById('feeCollectorAddress').value = slerfFeeCollectorAddress;
        document.getElementById('feeCollectorPrivateKey').value = slerfPrivateKey;
        
        // Save configuration
        if (saveConfig()) {
            // Add Slerf-specific fields to the configuration
            const tokenConfig = localStorage.getItem('tokenConfig');
            if (tokenConfig) {
                const config = JSON.parse(tokenConfig);
                config.slerfTokenAddress = slerfTokenAddress;
                config.slerfFeeCollectorAddress = slerfFeeCollectorAddress;
                config.slerfPrivateKey = slerfPrivateKey ? encryptPrivateKey(slerfPrivateKey) : '';
                
                localStorage.setItem('tokenConfig', JSON.stringify(config));
                localStorage.setItem('taxDistributorConfig', JSON.stringify(config));
            }
            
            console.log('Slerf configuration saved successfully');
            showToast('Slerf configuration saved successfully', 'success');
        }
        
        return true;
    } catch (error) {
        console.error('Error saving Slerf configuration:', error);
        showToast('Error saving Slerf configuration: ' + error.message, 'error');
        return false;
    }
}

// Update network indicator
function updateNetworkIndicator(network) {
    const networkIndicator = document.getElementById('networkIndicator');
    if (networkIndicator) {
        networkIndicator.textContent = 'MAINNET';
        
        // Always use mainnet styling
        networkIndicator.className = 'network-indicator network-mainnet';
    }
}

// Make switchToTab available globally
window.switchToTab = switchToTab;

// Validate and convert private key
function validatePrivateKey(privateKey, format) {
    try {
        let secretKey;
        if (format === 'array') {
            // Try parsing as array
            secretKey = new Uint8Array(JSON.parse(privateKey));
        } else {
            // Try parsing as base58
            secretKey = bs58.decode(privateKey);
        }

        // Validate key length
        if (secretKey.length !== 64) {
            throw new Error('Invalid private key length');
        }

        // Create keypair and validate
        const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey);
        const publicKey = keyPair.publicKey.toString();

        return {
            isValid: true,
            publicKey,
            message: 'Valid private key'
        };
    } catch (error) {
        return {
            isValid: false,
            message: 'Invalid private key: ' + error.message
        };
    }
}

// Validate private key against address
function validatePrivateKeyAgainstAddress(privateKey, format, addressElement) {
    const result = validatePrivateKey(privateKey, format);
    
    if (result.isValid) {
        const address = document.getElementById(addressElement).value;
        if (address && result.publicKey !== address) {
            result.isValid = false;
            result.message = 'Private key does not match the provided address';
        }
    }
    
    return result;
}

// Update validation message
function updateValidationMessage(result, elementId) {
    const validationDiv = document.getElementById(elementId);
    validationDiv.textContent = result.message;
    validationDiv.className = 'validation-message ' + (result.isValid ? 'success' : 'error');
}

// Handle private key input for manual setup
document.getElementById('feeCollectorPrivateKey').addEventListener('input', function() {
    const format = document.querySelector('input[name="keyFormat"]:checked').value;
    const result = validatePrivateKeyAgainstAddress(this.value, format, 'feeCollectorAddress');
    updateValidationMessage(result, 'privateKeyValidation');
});

// Handle private key input for Slerf setup
document.getElementById('slerfRoyaltyPrivateKey').addEventListener('input', function() {
    const result = validatePrivateKeyAgainstAddress(this.value, 'base58', 'slerfRoyaltyAddress');
    updateValidationMessage(result, 'slerfPrivateKeyValidation');
});

// Simple encryption/decryption for private keys
function encryptPrivateKey(privateKey) {
    if (!privateKey) return '';
    
    try {
        // This is a simple XOR encryption - in a production app, use a proper encryption library
        const encryptionKey = 'solana-tax-distributor-key';
        let encrypted = '';
        
        for (let i = 0; i < privateKey.length; i++) {
            const charCode = privateKey.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
            encrypted += String.fromCharCode(charCode);
        }
        
        // Convert to base64 for storage
        return btoa(encrypted);
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
}

function decryptPrivateKey(encryptedKey) {
    if (!encryptedKey) return '';
    
    try {
        // Decode from base64
        const encrypted = atob(encryptedKey);
        const encryptionKey = 'solana-tax-distributor-key';
        let decrypted = '';
        
        for (let i = 0; i < encrypted.length; i++) {
            const charCode = encrypted.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
            decrypted += String.fromCharCode(charCode);
        }
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return '';
    }
}

// Show toast message
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show error message
function showError(message) {
    showToast(message, 'error');
}

// Make functions available globally
window.loadConfiguration = function() {
    try {
        // Check for configuration in both tokenConfig and taxDistributorConfig (for backward compatibility)
        let config = localStorage.getItem('tokenConfig');
        if (!config) {
            console.log('No tokenConfig found, checking taxDistributorConfig...');
            config = localStorage.getItem('taxDistributorConfig');
        }
        
        if (!config) {
            console.log('No configuration found');
            return {};
        }
        
        config = JSON.parse(config);
        
        // Load network settings
        const networkSettings = localStorage.getItem('networkSettings');
        if (networkSettings) {
            const parsedNetworkSettings = JSON.parse(networkSettings);
            
            // Merge network settings with config
            config = { ...config, ...parsedNetworkSettings };
        }
        
        // Decrypt private key if needed
        if (config.feeCollectorPrivateKey && config.feeCollectorPrivateKey.startsWith('encrypted:')) {
            config.feeCollectorPrivateKey = decryptPrivateKey(config.feeCollectorPrivateKey);
        }
        
        return config;
    } catch (error) {
        console.error('Error loading configuration:', error);
        return {};
    }
}; 