/**
 * 🌻 PARA DIANA — CORTOMETRAJE INTERACTIVO CINEMATOGRÁFICO
 * Guion técnico y orquestación visual en JavaScript
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SISTEMA DE AUDIO CINEMATOGRÁFICO (HTML5 AUDIO)
     ========================================================================== */
  const bgMusic = document.getElementById('backgroundMusic');
  const btnAudioToggle = document.getElementById('btnAudioToggle');
  const audioWaves = document.getElementById('audioWaves');
  const audioIcon = document.getElementById('audioIcon');
  const audioStatus = document.getElementById('audioStatus');

  let isAudioPlaying = false;
  let audioFadeInterval = null;

  // Iniciar reproducción con fade-in progresivo
  function playAudioWithFadeIn(targetVolume = 0.70, durationMs = 3000) {
    if (!bgMusic) return;

    bgMusic.volume = 0.20; // Inicia con volumen bajo como solicitado
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioPlaying = true;
          updateAudioUI(true);

          // Rampa suave de volumen
          const stepTime = 100;
          const steps = durationMs / stepTime;
          const volumeIncrement = (targetVolume - 0.20) / steps;

          if (audioFadeInterval) clearInterval(audioFadeInterval);
          audioFadeInterval = setInterval(() => {
            if (bgMusic.volume + volumeIncrement < targetVolume) {
              bgMusic.volume = Math.min(targetVolume, bgMusic.volume + volumeIncrement);
            } else {
              bgMusic.volume = targetVolume;
              clearInterval(audioFadeInterval);
            }
          }, stepTime);
        })
        .catch((err) => {
          console.warn('Aviso: El archivo assets/music/Musica de fondo.mp3 no se pudo reproducir automáticamente o aún no está disponible:', err);
          updateAudioUI(false);
        });
    }
  }

  function pauseAudio() {
    if (!bgMusic) return;
    bgMusic.pause();
    isAudioPlaying = false;
    updateAudioUI(false);
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudioWithFadeIn();
    }
  }

  function updateAudioUI(playing) {
    if (playing) {
      audioWaves.classList.add('active');
      audioIcon.textContent = '⏸';
      audioStatus.textContent = 'Sonando';
    } else {
      audioWaves.classList.remove('active');
      audioIcon.textContent = '▶';
      audioStatus.textContent = 'Pausado';
    }
  }

  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', toggleAudio);
  }

  /* ==========================================================================
     2. ESCENA 1: INTRODUCCIÓN SECUENCIAL CINEMATOGRÁFICA
     ========================================================================== */
  const sceneIntro = document.getElementById('scene-intro');
  const introPhrase1 = document.getElementById('introPhrase1');
  const introReveal = document.getElementById('introReveal');
  const btnStart = document.getElementById('btnStart');

  window.addEventListener('DOMContentLoaded', () => {
    // Paso 1: Aparece lentamente "Hay historias que comienzan sin avisar..."
    setTimeout(() => {
      introPhrase1.classList.add('active');
    }, 1200);

    // Paso 2: Desaparece lentamente
    setTimeout(() => {
      introPhrase1.classList.remove('active');
      introPhrase1.classList.add('exit');
    }, 3800);

    // Paso 3: Aparece DIANA con zoom, brillo y botón COMENZAR
    setTimeout(() => {
      introReveal.classList.add('active');
    }, 4900);
  });

  // Paso 4: Al pulsar COMENZAR — Scroll Automático Cinematográfico
  // La experiencia avanza sola como un cortometraje, pausa en cada escena.
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      // Inicia música cinematográfica con fade-in
      playAudioWithFadeIn();

      // Deshabilitar el botón para evitar doble clic
      btnStart.disabled = true;
      btnStart.style.opacity = '0.5';

      // Desvanece la pantalla de intro
      setTimeout(() => {
        sceneIntro.classList.add('faded-out');
      }, 300);

      // IDs de escenas en orden narrativo + tiempos de pausa (ms)
      const scenePlan = [
        { id: 'scene-2',  delay: 900,   pause: 4200 },   // Transición texto
        { id: 'scene-3',  delay: 5200,  pause: 4500 },   // Luz volumétrica
        { id: 'scene-4',  delay: 9800,  pause: 3800 },   // Cielo nocturno
        { id: 'scene-5',  delay: 13700, pause: 7000 },   // Flores amarillas (más tiempo)
        { id: 'scene-6',  delay: 20800, pause: 4200 },   // Pausa y mensaje
        { id: 'scene-7',  delay: 25100, pause: 9000 },   // La carta (más tiempo para leer)
        { id: 'scene-12', delay: 34200, pause: 0  },     // Final
      ];

      scenePlan.forEach(({ id, delay }) => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, delay);
      });
    });
  }

  /* ==========================================================================
     3. CANVAS CINEMATOGRÁFICO: POLVO DE ORO & MOTAS DE LUZ FLOTANTES
     ========================================================================== */
  const canvas = document.getElementById('cinema-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class GoldenMote {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = -(Math.random() * 0.45 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.pulse += this.pulseSpeed;
      this.alpha = Math.max(0, this.baseAlpha + Math.sin(this.pulse) * 0.2);

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.fillStyle = `rgba(255, 220, 110, ${this.alpha})`;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const MOTES_COUNT = 40;
  const motes = Array.from({ length: MOTES_COUNT }, () => new GoldenMote());

  function animateCinemaCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < motes.length; i++) {
      motes[i].update();
      motes[i].draw();
    }

    requestAnimationFrame(animateCinemaCanvas);
  }
  animateCinemaCanvas();

  /* ==========================================================================
     4. PARTICULAS AL MOVER EL CURSOR (ESCENA 10)
     ========================================================================== */
  let lastSparkleTime = 0;
  const sparkleSymbols = ['✦', '•', '✧', '⋆'];

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    // Limitar la frecuencia para evitar sobrecarga (throttle elegante)
    if (now - lastSparkleTime < 80) return;
    lastSparkleTime = now;

    createCursorSparkle(e.clientX, e.clientY);
  });

  function createCursorSparkle(x, y) {
    const el = document.createElement('span');
    el.className = 'cursor-sparkle';
    el.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 35;
    const dy = (Math.random() - 0.5) * 35;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  /* ==========================================================================
     5. INTERSECTION OBSERVER: REVELADO PROGRESIVO DE TEXTOS Y ELEMENTOS
     ========================================================================== */
  const revealElements = document.querySelectorAll('[data-appear]');
  const finaleFlower = document.getElementById('finaleFlower');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Observador específico para el final
  if (finaleFlower) {
    const finaleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            finaleFlower.classList.add('revealed');
          }, 600);
        }
      });
    }, { threshold: 0.3 });

    finaleObserver.observe(finaleFlower);
  }

  /* ==========================================================================
     6. PARALLAX CINEMATOGRÁFICO CON MOUSE (ESCENAS 4, 5 & 9)
     ========================================================================== */
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const cameraRigs = document.querySelectorAll('[data-parallax-depth]');

  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateParallax() {
    // Interpolación suave (lerp)
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    // Mover capas de estrellas, luna y campo de flores
    parallaxElements.forEach((el) => {
      const depth = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      const moveX = currentMouseX * depth * 35;
      const moveY = currentMouseY * depth * 25;
      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    // Mover sutilmente los rigs de cámara
    cameraRigs.forEach((rig) => {
      const depth = parseFloat(rig.getAttribute('data-parallax-depth')) || 0.1;
      const moveX = currentMouseX * depth * 15;
      const moveY = currentMouseY * depth * 10;
      rig.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    requestAnimationFrame(updateParallax);
  }
  updateParallax();

  /* ==========================================================================
     7. EFECTO 3D DE LA CARTA AL MOVER EL CURSOR (ESCENA 8)
     ========================================================================== */
  const letterCard = document.getElementById('cinematicLetter');

  if (letterCard) {
    letterCard.addEventListener('mousemove', (e) => {
      const rect = letterCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Inclinación máxima sutil de 4.5 grados para elegancia
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      letterCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    letterCard.addEventListener('mouseleave', () => {
      letterCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ==========================================================================
     8. FLOR PRINCIPAL INTERACTIVA (ESCENA 5)
     ========================================================================== */
  const heroSunflower = document.getElementById('heroSunflower');

  if (heroSunflower) {
    heroSunflower.addEventListener('click', (e) => {
      // Al hacer clic genera un pequeño destello de partículas doradas
      const rect = heroSunflower.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height * 0.4;

      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          createCursorSparkle(
            originX + (Math.random() - 0.5) * 80,
            originY + (Math.random() - 0.5) * 80
          );
        }, i * 40);
      }
    });
  }

})();
