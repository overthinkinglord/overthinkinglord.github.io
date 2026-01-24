// Lightweight, non-blocking UI interactions
document.addEventListener('DOMContentLoaded', () => {
    // Reveal albums and bio using IntersectionObserver to avoid scroll handlers
    const albums = Array.from(document.querySelectorAll('.album'));
    const bio = document.querySelector('.bio-container');

    if ('IntersectionObserver' in window) {
        const albumObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const album = entry.target;
                    const index = albums.indexOf(album);
                    setTimeout(() => {
                        album.style.opacity = '1';
                        album.style.transform = 'translateY(0)';
                    }, Math.min(index * 150, 600));
                    obs.unobserve(album);
                }
            });
        }, {threshold: 0.1});

        albums.forEach(a => albumObserver.observe(a));

        if (bio) {
            const bioObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        obs.unobserve(el);
                    }
                });
            }, {threshold: 0.1});
            bioObserver.observe(bio);
        }
    } else {
        // Fallback: simple onload reveal
        albums.forEach((album, i) => setTimeout(() => {
            album.style.opacity = '1';
            album.style.transform = 'translateY(0)';
        }, i * 150));
        if (bio) {
            bio.style.opacity = '1';
            bio.style.transform = 'translateY(0)';
        }
    }

    // Defer creation of decorative particles to idle time
    function createParticles(count = 20) {
        const hero = document.getElementById('hero');
        if (!hero) return;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const s = Math.random() * 6 + 4;
            p.style.width = s + 'px';
            p.style.height = s + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 15 + 10) + 's';
            hero.appendChild(p);
        }
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => createParticles(20));
    } else {
        setTimeout(() => createParticles(20), 500);
    }

    // Lazy-create Audio objects on demand to avoid early network requests
    let currentAudio = null;
    let currentAlbum = null;

    albums.forEach(album => {
        const cover = album.querySelector('.album-cover');
        const overlay = album.querySelector('.play-overlay');
        const audioSrc = album.dataset.audio;
        let audio = null; // created when first played

        if (!cover) return;

        cover.addEventListener('click', () => {
            if (currentAlbum === album) {
                if (!audio) return;
                if (audio.paused) {
                    audio.play();
                    album.classList.add('playing');
                    overlay.textContent = '❚❚';
                } else {
                    audio.pause();
                    album.classList.remove('playing');
                    overlay.textContent = '▶';
                }
                return;
            }

            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentAlbum) {
                    currentAlbum.classList.remove('playing');
                    const po = currentAlbum.querySelector('.play-overlay');
                    if (po) po.textContent = '▶';
                }
            }

            if (!audio) {
                audio = new Audio();
                audio.src = audioSrc;
                audio.preload = 'none';
            }

            audio.play().catch(() => {});
            album.classList.add('playing');
            overlay.textContent = '❚❚';

            currentAudio = audio;
            currentAlbum = album;

            audio.addEventListener('ended', () => {
                album.classList.remove('playing');
                overlay.textContent = '▶';
                if (currentAudio === audio) {
                    currentAudio = null;
                    currentAlbum = null;
                }
            });
        });
    });

    // Optional: close long-lived connections on pagehide (placeholder)
    window.addEventListener('pagehide', () => {
        // If you add WebSocket/EventSource later, close them here to allow bfcache
        // Example: if (ws) ws.close();
    });
});
