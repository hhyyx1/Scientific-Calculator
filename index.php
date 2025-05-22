<?php require_once 'includes/header.php'; ?>

<!-- 背景容器 - 保留原有SVG背景 -->
<div class="background-container">
    <div id="light-background" class="background">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f9f9f9;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e6f3ff;stop-opacity:1" />
                </linearGradient>
                <filter id="lightGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.4   0 0 0 0 0.6   0 0 0 0 1  0 0 0 0.5 0"/>
                </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#lightGradient)" />
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#88ccff" stroke-width="0.1" opacity="0.2"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <g class="tech-lines" stroke="#88ccff" stroke-width="0.5" fill="none" filter="url(#lightGlow)"></g>
        </svg>
    </div>
    <div id="dark-background" class="background" style="display: none;">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#0F2027;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#203A43;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2C5364;stop-opacity:1" />
                </linearGradient>
                <filter id="darkGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0   0 1 0 0 0.8   0 0 1 0 1  0 0 0 1 0"/>
                </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#darkGradient)" />
            <pattern id="darkGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ffffff" stroke-width="0.1" opacity="0.2"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#darkGrid)" />
            <g class="tech-lines" stroke="#00ff9d" stroke-width="0.5" fill="none" filter="url(#darkGlow)"></g>
        </svg>
    </div>
    
    <!-- 粒子效果层 -->
    <canvas id="particles-canvas" class="particles-layer"></canvas>
</div>

<div class="theme-toggle">
    <button id="theme-toggle-btn">
        <span class="theme-icon">🌓</span>
    </button>
</div>

<div class="calculator">
    <div class="calculator-header">
        <select id="mode-selector">
            <option value="standard">Standard</option>
            <option value="scientific">Scientific</option>
        </select>
    </div>

    <div class="display">
        <div class="history"></div>
        <div class="current">0</div>
    </div>

    <div class="buttons standard-buttons">
        <!-- 标准计算器按键 -->
        <button class="clear">C</button>
        <button class="operator">⌫</button>
        <button class="operator">%</button>
        <button class="operator">÷</button>
        
        <button class="number">7</button>
        <button class="number">8</button>
        <button class="number">9</button>
        <button class="operator">×</button>
        
        <button class="number">4</button>
        <button class="number">5</button>
        <button class="number">6</button>
        <button class="operator">-</button>
        
        <button class="number">1</button>
        <button class="number">2</button>
        <button class="number">3</button>
        <button class="operator">+</button>
        
        <button class="number">0</button>
        <button class="number">.</button>
        <button class="equals">=</button>
        <button class="operator">±</button>
    </div>

    <div class="buttons scientific-buttons" style="display: none;">
        <!-- 科学计算器额外按键 -->
        <button class="scientific">sin</button>
        <button class="scientific">cos</button>
        <button class="scientific">tan</button>
        <button class="scientific">π</button>
        
        <button class="scientific">√</button>
        <button class="scientific">x²</button>
        <button class="scientific">x³</button>
        <button class="scientific">xʸ</button>
        
        <button class="scientific">log</button>
        <button class="scientific">ln</button>
        <button class="scientific">e</button>
        <button class="scientific">!</button>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
