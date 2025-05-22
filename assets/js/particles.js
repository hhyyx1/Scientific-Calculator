class ParticleNetwork {
    constructor(canvasId, options) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 默认配置与传入配置合并
        this.options = {
            particleCount: 100,
            particleColor: '#ffffff',
            lineColor: '#ffffff',
            particleSize: 2,
            lineWidth: 0.5,
            maxSpeed: 0.5,
            maxDistance: 150,
            responsive: true,
            ...options
        };
        
        this.particles = [];
        this.mousePosition = { x: null, y: null };
        
        this.init();
    }
    
    init() {
        // 设置Canvas尺寸
        this.resizeCanvas();
        if (this.options.responsive) {
            window.addEventListener('resize', () => this.resizeCanvas());
        }
        
        // 创建粒子
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(new Particle(this));
        }
        
        // 鼠标交互
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mousePosition = { x: null, y: null };
        });
        
        // 开始动画
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // 绘制粒子间的连线
        this.drawLines();
        
        // 请求下一帧
        requestAnimationFrame(() => this.animate());
    }
    
    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                // 计算粒子间距离
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + 
                    Math.pow(p1.y - p2.y, 2)
                );
                
                // 如果距离小于最大连线距离，绘制连线
                if (distance <= this.options.maxDistance) {
                    // 线条透明度基于距离
                    const opacity = 1 - (distance / this.options.maxDistance);
                    this.ctx.strokeStyle = this.options.lineColor.replace('rgb', 'rgba').replace(')', `,${opacity})`);
                    this.ctx.lineWidth = this.options.lineWidth;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateColors(particleColor, lineColor) {
        this.options.particleColor = particleColor;
        this.options.lineColor = lineColor;
    }
}

class Particle {
    constructor(network) {
        this.network = network;
        this.reset();
    }
    
    reset() {
        // 随机位置
        this.x = Math.random() * this.network.canvas.width;
        this.y = Math.random() * this.network.canvas.height;
        
        // 随机速度
        this.vx = Math.random() * this.network.options.maxSpeed * 2 - this.network.options.maxSpeed;
        this.vy = Math.random() * this.network.options.maxSpeed * 2 - this.network.options.maxSpeed;
        
        // 设置大小
        this.size = Math.random() * (this.network.options.particleSize * 1.5 - this.network.options.particleSize) + this.network.options.particleSize;
    }
    
    update() {
        // 移动粒子
        this.x += this.vx;
        this.y += this.vy;
        
        // 检查边界并反弹
        if (this.x < 0 || this.x > this.network.canvas.width) {
            this.vx = -this.vx;
        }
        
        if (this.y < 0 || this.y > this.network.canvas.height) {
            this.vy = -this.vy;
        }
        
        // 鼠标吸引效果
        if (this.network.mousePosition.x !== null && this.network.mousePosition.y !== null) {
            const dx = this.x - this.network.mousePosition.x;
            const dy = this.y - this.network.mousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const angle = Math.atan2(dy, dx);
                const force = 0.5;
                this.vx += Math.cos(angle) * force;
                this.vy += Math.sin(angle) * force;
                
                // 限制最大速度
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > this.network.options.maxSpeed * 2) {
                    this.vx = (this.vx / speed) * this.network.options.maxSpeed * 2;
                    this.vy = (this.vy / speed) * this.network.options.maxSpeed * 2;
                }
            }
        }
    }
    
    draw() {
        const ctx = this.network.ctx;
        ctx.fillStyle = this.network.options.particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
