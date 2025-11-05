// ProStocks API Configuration
const PROSTOCKS_CONFIG = {
    baseUrl: 'https://staruat.prostocks.com',
    endpoints: {
        login: '/api/v1/login',
        orders: '/api/v1/orders',
        positions: '/api/v1/positions',
        holdings: '/api/v1/holdings',
        marketData: '/api/v1/marketdata'
    }
};

// Global State
let isAuthenticated = false;
let userData = null;
let marketData = [];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const prostocksLogin = document.getElementById('prostocksLogin');
const portfolioValue = document.getElementById('portfolioValue');
const todayPnl = document.getElementById('todayPnl');
const openPositions = document.getElementById('openPositions');
const activeOrders = document.getElementById('activeOrders');
const marketDataBody = document.getElementById('marketDataBody');

// Modal Functions
function openLogin() {
    loginModal.style.display = 'block';
}

function closeLogin() {
    loginModal.style.display = 'none';
}

// ProStocks Authentication
prostocksLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const apiKey = document.getElementById('apiKey').value;
    const apiSecret = document.getElementById('apiSecret').value;
    
    try {
        const response = await authenticateWithProStocks(apiKey, apiSecret);
        
        if (response.success) {
            isAuthenticated = true;
            userData = response.data;
            closeLogin();
            initializeTrading();
            showNotification('Successfully connected to ProStocks!', 'success');
        } else {
            showNotification('Authentication failed. Please check your credentials.', 'error');
        }
    } catch (error) {
        showNotification('Connection error. Please try again.', 'error');
        console.error('Authentication error:', error);
    }
});

// API Integration Functions
async function authenticateWithProStocks(apiKey, apiSecret) {
    // Placeholder for actual ProStocks authentication
    // You'll need to implement the actual API call based on ProStocks documentation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    userId: 'demo_user',
                    name: 'Demo Trader',
                    balance: 100000
                }
            });
        }, 1000);
    });
}

// Trading Functions
async function placeOrder() {
    if (!isAuthenticated) {
        showNotification('Please login to ProStocks first', 'warning');
        openLogin();
        return;
    }

    const symbol = document.getElementById('symbolSelect').value;
    const orderType = document.getElementById('orderType').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    if (!symbol || !quantity || !price) {
        showNotification('Please fill all order details', 'warning');
        return;
    }

    try {
        // Placeholder for actual order placement
        const order = {
            symbol,
            orderType,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            timestamp: new Date().toISOString()
        };

        showNotification(`Order placed: ${orderType} ${quantity} ${symbol} @ ${price}`, 'success');
        
        // Reset form
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
        
        // Update dashboard
        updateDashboard();
        
    } catch (error) {
        showNotification('Order placement failed', 'error');
        console.error('Order error:', error);
    }
}

// Dashboard Functions
function initializeTrading() {
    updateDashboard();
    startMarketDataStream();
    setInterval(updateDashboard, 30000); // Update every 30 seconds
}

function updateDashboard() {
    // Update with real data from ProStocks API
    portfolioValue.textContent = `₹${(Math.random() * 1000000).toFixed(2)}`;
    todayPnl.textContent = `₹${(Math.random() * 5000 - 2500).toFixed(2)}`;
    openPositions.textContent = Math.floor(Math.random() * 10);
    activeOrders.textContent = Math.floor(Math.random() * 5);
}

function startMarketDataStream() {
    // Simulate market data updates
    setInterval(() => {
        updateMarketData();
    }, 2000);
}

function updateMarketData() {
    const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICIBANK'];
    const marketDataHTML = symbols.map(symbol => {
        const ltp = (Math.random() * 5000 + 1000).toFixed(2);
        const change = (Math.random() * 100 - 50).toFixed(2);
        const changePercent = ((change / ltp) * 100).toFixed(2);
        const volume = Math.floor(Math.random() * 1000000);
        
        return `
            <tr>
                <td><strong>${symbol}</strong></td>
                <td>₹${ltp}</td>
                <td class="${change >= 0 ? 'positive' : 'negative'}">
                    ${change >= 0 ? '+' : ''}${change} (${changePercent}%)
                </td>
                <td>${volume.toLocaleString()}</td>
                <td>
                    <button class="btn-buy" onclick="quickBuy('${symbol}')">Buy</button>
                    <button class="btn-sell" onclick="quickSell('${symbol}')">Sell</button>
                </td>
            </tr>
        `;
    }).join('');
    
    marketDataBody.innerHTML = marketDataHTML;
}

function quickBuy(symbol) {
    document.getElementById('symbolSelect').value = symbol;
    document.getElementById('orderType').value = 'BUY';
    document.getElementById('quantity').focus();
}

function quickSell(symbol) {
    document.getElementById('symbolSelect').value = symbol;
    document.getElementById('orderType').value = 'SELL';
    document.getElementById('quantity').focus();
}

// Utility Functions
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #27ae60;' : ''}
        ${type === 'error' ? 'background: #e74c3c;' : ''}
        ${type === 'warning' ? 'background: #f39c12;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateMarketData();
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeLogin();
        }
    });
});
