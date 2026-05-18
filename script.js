// Inicializar animaciones de GSAP cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Timeline principal de entrada (Load Animation)
    const tl = gsap.timeline();

    // Fade y deslizamiento de elementos superiores
    tl.from(".logo", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(".nav-links li", { y: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }, "-=0.6")

        // Entrada del sidebar izquierdo
        .from(".sidebar-left", { x: -30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")

        // Entrada del fondo collage
        .from(".collage-item", { x: -40, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" }, "-=1.2")

        // Entrada majestuosa de la mascota y su blob dithered
        .from(".mascot-container", { scale: 0.9, opacity: 0, duration: 1, ease: "expo.out" }, "-=0.6")

        // Revelación de textos gigantes (NOUS GIRL)
        .from(".title-img", { x: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power4.out" }, "-=0.6")

        // Subtítulo
        .from(".subtitle", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")

        // Prompt de scroll inferior
        .from(".scroll-prompt", { opacity: 0, duration: 1 }, "-=0.2");

    // Efecto Glitch Rápido para las letras del collage
    const collageItems = document.querySelectorAll(".collage-item");
    collageItems.forEach((item) => {
        const glitchAnim = () => {
            const delay = gsap.utils.random(1, 3.5); // Sucede más rápido, cada 1 a 3.5s
            gsap.to(item, {
                x: () => gsap.utils.random(-25, 25), // Sacudida horizontal
                opacity: () => gsap.utils.random(0.05, 0.5), // Parpadeo de opacidad
                duration: 0.05, // Parpadeo más violento y rápido
                yoyo: true,
                repeat: 5, // 5 sacudidas en ráfaga
                onComplete: () => {
                    gsap.to(item, { x: 0, opacity: 0.15, duration: 0.1 });
                    glitchAnim(); // Reinicia el ciclo
                },
                delay: delay
            });
        };
        setTimeout(glitchAnim, 2500); // Empezar una vez termine la animación inicial
    });

    // Efecto Glitch Lento para la palabra NOUS
    const nousWord = document.querySelector(".nous-word");
    if (nousWord) {
        const slowGlitchAnim = () => {
            const delay = gsap.utils.random(4, 8); // Sucede menos frecuentemente, cada 4 a 8s
            gsap.to(nousWord, {
                x: () => gsap.utils.random(-8, 8), // Sacudida horizontal leve
                skewX: () => gsap.utils.random(-5, 5), // Distorsión de forma
                opacity: () => gsap.utils.random(0.6, 0.9), // Variación de luz
                duration: 0.15, // Parpadeo un poco más lento
                yoyo: true,
                repeat: 3, // Ráfaga corta
                onComplete: () => {
                    gsap.to(nousWord, { x: 0, skewX: 0, opacity: 1, duration: 0.1 });
                    slowGlitchAnim(); // Reinicia el ciclo
                },
                delay: delay
            });
        };
        setTimeout(slowGlitchAnim, 3500); // Empezar después de que la página se acomode
    }

    // Efecto de movimiento sutil (Parallax/Hover) en la imagen de la chica
    const mascotContainer = document.querySelector('.mascot-container');
    const mascotImage = document.querySelector('.mascot-img');

    if (mascotContainer && mascotImage) {
        mascotContainer.addEventListener('mousemove', (e) => {
            const rect = mascotContainer.getBoundingClientRect();
            // Calcular posición del ratón relativa al centro del contenedor
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Movimiento suave con GSAP
            gsap.to(mascotImage, {
                x: x * 0.08,
                y: y * 0.08,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        mascotContainer.addEventListener('mouseleave', () => {
            // Volver al centro al quitar el ratón
            gsap.to(mascotImage, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "power3.out"
            });
        });
    }

    // === SCROLLTRIGGER: SECTION 2 (ABOUT) ===
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 75%", // Se activa cuando el tope de la sección entra un 25% a la ventana
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });

    aboutTl.from(".section-label", { y: 20, opacity: 0, duration: 0.6 })
        .from(".about-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(".about-desc p", { y: 20, opacity: 0, duration: 0.6, stagger: 0.2 }, "-=0.4")
        .from(".stat-box", { y: 30, opacity: 0, duration: 0.6, stagger: 0.15 }, "-=0.4")
        .from(".glitch-banner-wrapper", { scale: 0.95, x: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=1");

    // === RESPONSIVE GSAP LOGIC (MATCHMEDIA) ===
    let mm = gsap.matchMedia();

    // Función compartida de Scrollspy UI
    const navLinks = document.querySelectorAll(".sidebar-left .icon-circle");
    const sidebarNum = document.getElementById("sidebar-num");

    function setActiveLink(targetId) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.sidebar-left .icon-circle[data-target="${targetId}"]`);
        if (activeLink) activeLink.classList.add("active");

        if (targetId === "hero") sidebarNum.innerText = "01";
        if (targetId === "about") sidebarNum.innerText = "02";
        if (targetId === "terminal") sidebarNum.innerText = "03";
        if (targetId === "tokenomics") sidebarNum.innerText = "04";
    }

    // Lógica global de clics para los enlaces (adaptativa)
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("data-target");

            // Si la ventana es pequeña (móvil), siempre es vertical nativo
            if (window.innerWidth <= 768) {
                gsap.to(window, { duration: 1, scrollTo: `#${targetId}`, ease: "power2.inOut" });
            } else {
                // Desktop: Lógica de Sándwich de Scroll
                if (targetId === "hero") {
                    gsap.to(window, { duration: 1, scrollTo: 0, ease: "power2.inOut" });
                } else if (targetId === "about") {
                    gsap.to(window, { duration: 1, scrollTo: ".horizontal-wrapper", ease: "power2.inOut" });
                } else if (targetId === "terminal") {
                    const horizontalOffset = document.querySelector(".horizontal-wrapper").offsetTop;
                    gsap.to(window, { duration: 1, scrollTo: horizontalOffset + window.innerWidth, ease: "power2.inOut" });
                } else if (targetId === "tokenomics") {
                    gsap.to(window, { duration: 1, scrollTo: "#tokenomics", ease: "power2.inOut" });
                }
            }
        });
    });

    // DESKTOP & TABLET (> 768px)
    mm.add("(min-width: 769px)", () => {
        const horizontalContainer = document.querySelector(".horizontal-container");

        let scrollTween = gsap.to(horizontalContainer, {
            x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-wrapper",
                pin: true,
                scrub: 1,
                end: () => "+=" + window.innerWidth
            }
        });

        ScrollTrigger.create({
            trigger: "#hero",
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveLink("hero"),
            onEnterBack: () => setActiveLink("hero")
        });

        // Trigger para Tokenomics (Desktop)
        ScrollTrigger.create({
            trigger: "#tokenomics",
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveLink("tokenomics"),
            onEnterBack: () => setActiveLink("tokenomics")
        });

        ScrollTrigger.create({
            trigger: ".horizontal-wrapper",
            start: "top top",
            end: () => "+=" + window.innerWidth,
            onUpdate: (self) => {
                if (self.progress < 0.5) {
                    setActiveLink("about");
                } else {
                    setActiveLink("terminal");
                }
            }
        });
    });

    // MOBILE (< 768px)
    mm.add("(max-width: 768px)", () => {
        // En móviles, todas las secciones son verticales puras.
        ["hero", "about", "terminal", "tokenomics"].forEach(id => {
            ScrollTrigger.create({
                trigger: `#${id}`,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveLink(id),
                onEnterBack: () => setActiveLink(id)
            });
        });
    });

    // (Opcional) Re-animar el parallax del banner de "Who is Nousgirl" pero basado en el scroll horizontal
    // Eliminamos el código anterior del parallax del about-banner-img porque chocaba con el movimiento lateral


    // === TERMINAL TYPEWRITER LOGIC (SECCIÓN 3) ===
    const termOutput = document.getElementById("term-output");
    const termCmds = document.querySelectorAll(".term-cmd");

    const terminalData = {
        "init": "NOUS_OS INITIATED...\n\nSYSTEM: HERMES 2 ONLINE.\nCOGNITIVE_CORE: SYNCED.\nSTATUS: READY FOR INPUT.\n\nTYPE COMMANDS OR SELECT FROM MENU TO LEARN MORE ABOUT THE NOUS ECOSYSTEM.",
        "lore": "DECRYPTING LORE...\n\nNousGirl is a decentralized cognitive agent born from the open-source collective Nous Research.\nShe processes logic, memes, and data directly on the Web3 space.\n\nMISSION: To guide users through the noise of the network.",
        "token": "FETCHING TOKEN DATA...\n\nCONTRACT: [CLASSIFIED_UNTIL_LAUNCH]\nMEMES: 100% LOCKED IN\nPUMP: SECURED\n\n100% COMMUNITY DRIVEN."
    };

    let typewriterTimeout;

    function typeWriter(text, element) {
        // Reiniciar el texto con solo el cursor
        element.innerHTML = '<span class="cursor">_</span>';
        let i = 0;
        clearTimeout(typewriterTimeout); // Detener escrituras previas si se hace clic rápido

        function type() {
            if (i < text.length) {
                // Insertar la siguiente letra y mantener el cursor parpadeando al final
                element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">_</span>';
                i++;
                // Velocidad variable para simular escritura humana/hacker real
                let speed = Math.random() * 30 + 10;
                typewriterTimeout = setTimeout(type, speed);
            }
        }
        type(); // Iniciar loop
    }

    // Al cargar la página, iniciar la terminal con el comando "init"
    typeWriter(terminalData["init"], termOutput);

    // Eventos al hacer clic en los botones de comandos de la consola
    termCmds.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remover el color azul del comando previo y ponerselo al nuevo
            termCmds.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Disparar la escritura
            const cmd = btn.getAttribute("data-cmd");
            typeWriter(terminalData[cmd], termOutput);
        });
    });

    // === HAMBURGER MENU LOGIC ===
    const hamburger = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinksList = navMenu.querySelectorAll("a");
        navLinksList.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // === 3D TILT EFFECT (TOKENOMICS) ===
    const mockup = document.querySelector(".mockup-img");
    if (mockup) {
        document.addEventListener("mousemove", (e) => {
            // Activar solo en escritorio
            if (window.innerWidth > 768) {
                // Cálculo de ejes basado en el centro del viewport para evitar rotaciones extremas por scroll Y
                const xAxis = (window.innerWidth / 2 - e.clientX) / 35;
                const yAxis = (window.innerHeight / 2 - e.clientY) / 35;
                mockup.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            }
        });

        document.addEventListener("mouseleave", () => {
            mockup.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }
});
