// Algorithmic Trading Platform - Main JavaScript
class TradingBot {
    constructor() {
        this.isRunning = false;
        this.currentPrice = 0;
        this.profitLoss = 0;
        this.totalTrades = 0;
        this.successfulTrades = 0;
        this.tradeHistory = [];
        this.priceUpdateInterval = null;
        
        this.initializeTrading();
    }

    initializeTrading() {
        this.logMessage('Algorithmic Trading Platform initialized', 'info');
        this.startPriceUpdates();
        this.updateStats();
        
        // Simulate initial market data
        this.simulateMarketData();
    }

    startPriceUpdates() {
        this.priceUpdateInterval = setInterval(() => {
            this.updatePrice();
        }, 1000);
    }

    updatePrice() {
        // Simulate realistic price movement with random walk
        const volatility = 50; // Higher volatility for more realistic movement
        const change = (Math.random() - 0.5) * volatility;
        const drift = 0.1; // Slight upward drift
        
        this.currentPrice = Math.max(45000, this.currentPrice + change + drift);
        
        document.getElementById('currentPrice').textContent = `$${this.currentPrice.toFixed(2)}`;
        
        // Update chart placeholder with current price
        this.updateChartPlaceholder();
    }

    updateChartPlaceholder() {
        const chart = document.getElementById('tradingChart');
        chart.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 1.2rem; margin-bottom: 10px; color: #00ff88;">Live Trading Chart</div>
                <div style="font-size: 2rem; font-weight: bold; margin-bottom: 10px;">$${this.currentPrice.toFixed(2)}</div>
                <div style="color: #cccccc;">Chart visualization would be integrated here</div>
                <div style="margin-top: 20px; font-size: 0.9rem; color: #888;">
                    Next: Integrate with TradingView, Chart.js, or other charting library
                </div>
            </div>
        `;
    }

    executeTrade(type) {
        if (!this.isRunning && type !== 'manual') {
            this.logMessage('Trading bot is not running. Please start the bot first.', 'error');
            return;
        }

        const amount = parseFloat(document.getElementById('tradeAmount').value) || 100;
        const pair = document.getElementById('tradingPair').value;
        
        // Simulate trade execution
        const tradePrice = this.currentPrice;
        const simulatedOutcome = Math.random() > 0.4; // 60% success rate for simulation
        
        this.totalTrades++;
        
        if (simulatedOutcome) {
            this.successfulTrades++;
            const profit = type === 'buy' ? amount * 0.02 : amount * 0.015; // 2% profit for buy, 1.5% for sell
            this.profitLoss += profit;
            
            this.logMessage(`${type.toUpperCase()} trade executed: ${amount} USD of ${pair} at $${tradePrice.toFixed(2)} - Profit: $${profit.toFixed(2)}`, 'success');
        } else {
            const loss = amount * 0.01; // 1% loss
            this.profitLoss -= loss;
            
            this.logMessage(`${type.toUpperCase()} trade executed: ${amount} USD of ${pair} at $${tradePrice.toFixed(2)} - Loss: $${loss.toFixed(2)}`, 'error');
        }
        
        // Add to trade history
        this.tradeHistory.unshift({
            type: type,
            pair: pair,
            amount: amount,
            price: tradePrice,
            timestamp: new Date(),
            outcome: simulatedOutcome ? 'profit' : 'loss'
        });
        
        this.updateStats();
        
        // Keep only last 50 trades in history
        if (this.tradeHistory.length > 50) {
            this.tradeHistory.pop();
        }
    }

    toggleTradingBot() {
        this.isRunning = !this.isRunning;
        
        const button = document.querySelector('button[onclick="toggleTradingBot()"]');
        
        if (this.isRunning) {
            button.textContent = 'STOP BOT';
            button.className = 'btn btn-danger';
            this.logMessage('Algorithmic trading bot STARTED - Automated trading enabled', 'success');
            
            // Start automated trading
            this.startAutomatedTrading();
        } else {
            button.textContent = 'START BOT';
            button.className = 'btn btn-secondary';
            this.logMessage('Algorithmic trading bot STOPPED', 'error');
            
            // Stop automated trading
            this.stopAutomatedTrading();
        }
    }

    startAutomatedTrading() {
        // Simulate automated trading decisions
        this.autoTradeInterval = setInterval(() => {
            if (this.isRunning) {
                // Simple momentum strategy simulation
                const decision = Math.random() > 0.5 ? 'buy' : 'sell';
                this.executeTrade(decision);
            }
        }, 5000); // Trade every 5 seconds
    }

    stopAutomatedTrading() {
        if (this.autoTradeInterval) {
            clearInterval(this.autoTradeInterval);
        }
    }

    updateStats() {
        document.getElementById('profitLoss').textContent = `$${this.profitLoss.toFixed(2)}`;
        document.getElementById('tradesCount').textContent = this.totalTrades;
        
        const winRate = this.totalTrades > 0 ? (this.successfulTrades / this.totalTrades) * 100 : 0;
        document.getElementById('winRate').textContent = `${winRate.toFixed(1)}%`;
        
        // Color code P&L
        const pnlElement = document.getElementById('profitLoss');
        pnlElement.style.color = this.profitLoss >= 0 ? '#00ff88' : '#ff4444';
    }

    logMessage(message, type = 'info') {
        const logs = document.getElementById('tradingLogs');
        const timestamp = new Date().toLocaleTimeString();
        
        const typeClass = `log-${type}`;
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="${typeClass}">${message}</span>`;
        
        logs.insertBefore(logEntry, logs.firstChild);
        
        // Keep only last 100 log entries
        while (logs.children.length > 100) {
            logs.removeChild(logs.lastChild);
        }
    }

    simulateMarketData() {
        // Initialize with realistic price
        this.currentPrice = 50000 + (Math.random() - 0.5) * 1000;
        this.updatePrice();
    }

    // Advanced trading strategies can be added here
    momentumStrategy() {
        // Implement momentum-based trading logic
    }

    meanReversionStrategy() {
        // Implement mean reversion trading logic
    }
}

// Initialize trading bot when page loads
let tradingBot;

document.addEventListener('DOMContentLoaded', function() {
    tradingBot = new TradingBot();
});

// Global functions for HTML onclick handlers
function executeTrade(type) {
    tradingBot.executeTrade(type);
}

function toggleTradingBot() {
    tradingBot.toggleTradingBot();
}

// Utility function for manual trading
function manualTrade() {
    const type = confirm('Execute BUY trade? Click OK for BUY, Cancel for SELL') ? 'buy' : 'sell';
    executeTrade(type);
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TradingBot, executeTrade, toggleTradingBot };
}
