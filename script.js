function revealAlbums() {
    const albums = document.querySelectorAll('.album');
    const windowHeight = window.innerHeight;
    
    albums.forEach((album, index) => {
        const elementTop = album.getBoundingClientRect().top;
        if(elementTop < windowHeight - 100){
            setTimeout(() => {
                album.style.opacity = 1;
                album.style.transform = 'translateY(0)';
            }, index * 200); // staggered animation
        }
    });

    // Reveal discography title
    const title = document.querySelector('#discography h2');
    const titleTop = title.getBoundingClientRect().top;
    if(titleTop < windowHeight - 100){
        title.style.opacity = 1;
        title.style.transform = 'translateY(0)';
    }
}

window.addEventListener('scroll', revealAlbums);
window.addEventListener('load', revealAlbums);

// PARTICLES IN HERO
for(let i=0;i<50;i++){
    const p=document.createElement('div');
    p.className='particle';
    const s=Math.random()*6+4;
    p.style.width=s+'px';
    p.style.height=s+'px';
    p.style.left=Math.random()*100+'%';
    p.style.top=Math.random()*100+'%';
    p.style.animationDuration=(Math.random()*15+10)+'s';
    document.getElementById('hero').appendChild(p);
}

// BIO APPEAR ON SCROLL
function revealOnScroll() {
    const bio = document.querySelector('.bio-container');
    const windowHeight = window.innerHeight;
    const elementTop = bio.getBoundingClientRect().top;
    const elementVisible = 100;
    
    if(elementTop < windowHeight - elementVisible){
        bio.style.opacity = 1;
        bio.style.transform = 'translateY(0)';
    }
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

(() => {
    const albums = document.querySelectorAll('.album');

    let currentAudio = null;
    let currentAlbum = null;

    albums.forEach(album => {
        const cover = album.querySelector('.album-cover');
        const overlay = album.querySelector('.play-overlay');
        const audioSrc = album.dataset.audio;

        const audio = new Audio(audioSrc);

        cover.addEventListener('click', () => {

            // Клик по текущему
            if (currentAlbum === album) {
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

            // Остановить предыдущий
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAlbum.classList.remove('playing');
                currentAlbum.querySelector('.play-overlay').textContent = '▶';
            }

            // Запустить новый
            audio.play();
            album.classList.add('playing');
            overlay.textContent = '❚❚';

            currentAudio = audio;
            currentAlbum = album;
        });

        // Конец трека
        audio.addEventListener('ended', () => {
            album.classList.remove('playing');
            overlay.textContent = '▶';
            currentAudio = null;
            currentAlbum = null;
        });
    });
})();