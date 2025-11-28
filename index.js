// ===========================
// AUTO COLLAPSE NAVBAR (Mobile)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navMenu = document.getElementById("navMenu");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("show")) {
                new bootstrap.Collapse(navMenu, { toggle: true });
            }
        });
    });
});


// ===========================
// MULTI-COLOR NEURAL NETWORK BACKGROUND
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;

    // Create Canvas
    const canvas = document.createElement("canvas");
    canvas.id = "neuralNetworkCanvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    heroSection.prepend(canvas);

    const ctx = canvas.getContext("2d");

    let width, height;
    const nodes = [];
    const nodeCount = 70; // adjust if needed

    const colors = [
        "rgba(0,255,255,0.8)",
        "rgba(255,0,255,0.8)",
        "rgba(138,43,226,0.8)",
        "rgba(0,128,255,0.8)"
    ];

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Resize canvas to hero height only
    function resizeCanvas() {
        width = canvas.width = heroSection.clientWidth;
        height = canvas.height = heroSection.clientHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = 2 + Math.random() * 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        move() {
            this.x += this.vx;
            this.y += this.vy;

            // bounce
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // repel effect near mouse
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    this.x += (dx / dist) * 2;
                    this.y += (dy / dist) * 2;
                }
            }
        }
    }

    // create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // glow background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "rgba(0,255,255,0.08)");
        gradient.addColorStop(0.5, "rgba(255,0,255,0.08)");
        gradient.addColorStop(1, "rgba(0,128,255,0.08)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // connecting lines
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    const opacity = 1 - dist / 140;
                    const color = colors[(i + j) % colors.length].replace("0.8", opacity.toFixed(2));
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // glowing nodes
        nodes.forEach((node) => {
            const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 6);
            glow.addColorStop(0, node.color);
            glow.addColorStop(1, "transparent");

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();

            node.move();
        });

        requestAnimationFrame(draw);
    }

    draw();
});
