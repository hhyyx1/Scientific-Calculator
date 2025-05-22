class ScientificCalculator {
    constructor() {
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.display = document.querySelector('.display .current');
        this.history = document.querySelector('.display .history');
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        console.log("Calculator initialized");
    }

    setupEventListeners() {
        // 数字和运算符按钮
        document.querySelector('.standard-buttons').addEventListener('click', (e) => {
            const button = e.target;
            if (!button.matches('button')) return;
            
            console.log("Standard button clicked:", button.textContent);

            if (button.classList.contains('number')) {
                this.appendNumber(button.textContent);
                this.updateDisplay();
            } else if (button.classList.contains('operator')) {
                if (button.textContent === '⌫') {
                    this.backspace();
                    this.updateDisplay();
                } else if (button.textContent === '±') {
                    this.toggleSign();
                    this.updateDisplay();
                } else {
                    this.chooseOperation(button.textContent);
                    this.updateDisplay();
                }
            } else if (button.classList.contains('equals')) {
                this.compute();
                this.updateDisplay();
            } else if (button.classList.contains('clear')) {
                this.clear();
                this.updateDisplay();
            }
        });

        // 科学计算器按钮区域
        document.querySelector('.scientific-buttons').addEventListener('click', (e) => {
            const button = e.target;
            if (!button.matches('button.scientific')) return;
            
            console.log("Scientific button clicked:", button.textContent);
            this.handleScientific(button.textContent);
            this.updateDisplay();
        });

        // 模式切换
        document.getElementById('mode-selector').addEventListener('change', (e) => {
            const scientificButtons = document.querySelector('.scientific-buttons');
            scientificButtons.style.display = e.target.value === 'scientific' ? 'grid' : 'none';
        });

        // 键盘支持
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
            } else if (e.key === '+' || e.key === '-') {
                this.chooseOperation(e.key);
            } else if (e.key === '*') {
                this.chooseOperation('×');
            } else if (e.key === '/') {
                this.chooseOperation('÷');
            } else if (e.key === 'Enter' || e.key === '=') {
                this.compute();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (e.key === 'Backspace') {
                this.backspace();
            }
            this.updateDisplay();
        });

        // 背景切换
        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme');
            
            // 切换背景
            const lightBg = document.getElementById('light-background');
            const darkBg = document.getElementById('dark-background');
            
            if (lightBg.style.display === 'none') {
                lightBg.style.display = 'block';
                darkBg.style.display = 'none';
                // 更新粒子颜色
                if (window.particleNetwork) {
                    window.particleNetwork.updateColors(
                        'rgba(50, 130, 230, 0.7)', 
                        'rgba(50, 130, 230, 0.3)'
                    );
                }
            } else {
                lightBg.style.display = 'none';
                darkBg.style.display = 'block';
                // 更新粒子颜色
                if (window.particleNetwork) {
                    window.particleNetwork.updateColors(
                        'rgba(0, 255, 157, 0.7)', 
                        'rgba(0, 255, 157, 0.3)'
                    );
                }
            }
            
            // 保存主题偏好
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('calculator-theme', currentTheme);
        });
    }

    appendNumber(number) {
        console.log("Appending number:", number);
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        console.log("Operation chosen:", operation);
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateHistory();
    }

    compute() {
        console.log("Computing result");
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError("Cannot divide by zero");
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = (prev / 100) * current;
                break;
            default:
                return;
        }

        console.log(`${prev} ${this.operation} ${current} = ${computation}`);
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateHistory(`${prev} ${this.operation} ${current} = ${computation}`);
    }

    handleScientific(operation) {
        console.log("Scientific operation:", operation);
        const current = parseFloat(this.currentOperand);
        let result;

        switch(operation) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case 'π':
                result = Math.PI;
                break;
            case '√':
                if (current < 0) {
                    this.showError("Invalid input for square root");
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'x²':
                result = Math.pow(current, 2);
                break;
            case 'x³':
                result = Math.pow(current, 3);
                break;
            case 'xʸ':
                // 保存幂运算
                this.operation = 'power';
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateHistory(`${this.previousOperand} ^ `);
                return;
            case 'log':
                if (current <= 0) {
                    this.showError("Invalid input for logarithm");
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    this.showError("Invalid input for natural logarithm");
                    return;
                }
                result = Math.log(current);
                break;
            case 'e':
                result = Math.E;
                break;
            case '!':
                result = this.factorial(current);
                break;
            default:
                return;
        }
        
        this.currentOperand = result.toString();
        this.updateHistory(`${operation}(${current}) = ${result}`);
    }

    factorial(n) {
        if (n < 0 || !Number.isInteger(n)) {
            this.showError("Invalid input for factorial");
            return NaN;
        }
        if (n > 170) {
            this.showError("Number too large for factorial");
            return Infinity;
        }
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    clear() {
        console.log("Clearing calculator");
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.history.textContent = '';
    }

    backspace() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    updateDisplay() {
        console.log("Updating display:", this.currentOperand);
        this.display.textContent = this.formatNumber(this.currentOperand);
    }

    updateHistory(text) {
        if (text) {
            this.history.textContent = text;
        } else if (this.operation) {
            this.history.textContent = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        }
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    showError(message) {
        this.history.textContent = message;
        this.display.classList.add('error');
        setTimeout(() => {
            this.display.classList.remove('error');
        }, 1500);
    }
}

// 初始化粒子背景
function initParticles() {
    // 检查是否已有粒子实例
    if (window.particleNetwork) return;
    
    // 创建粒子网络
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    // 初始主题
    const currentTheme = localStorage.getItem('calculator-theme') || 'light';
    const isLight = currentTheme === 'light';
    
    // 主题颜色配置
    const particleConfig = {
        particleCount: 120,
        particleColor: isLight ? 'rgba(50, 130, 230, 0.7)' : 'rgba(0, 255, 157, 0.7)',
        lineColor: isLight ? 'rgba(50, 130, 230, 0.3)' : 'rgba(0, 255, 157, 0.3)',
        particleSize: 2,
        lineWidth: 0.5,
        maxSpeed: 0.4,
        maxDistance: 150
    };
    
    // 创建粒子网络实例
    window.particleNetwork = new ParticleNetwork('particles-canvas', particleConfig);
    console.log("Particle network initialized");
}

// 加载保存的主题
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('calculator-theme') || 'light';
    
    // 设置主题类
    document.body.classList.add(savedTheme + '-theme');
    
    // 显示对应背景
    const lightBg = document.getElementById('light-background');
    const darkBg = document.getElementById('dark-background');
    
    if (savedTheme === 'light') {
        lightBg.style.display = 'block';
        darkBg.style.display = 'none';
    } else {
        lightBg.style.display = 'none';
        darkBg.style.display = 'block';
    }
}

// DOM内容加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化计算器
    new ScientificCalculator();
    
    // 加载保存的主题
    loadSavedTheme();
    
    // 初始化粒子背景
    initParticles();
    
    console.log("Calculator fully initialized");
});
