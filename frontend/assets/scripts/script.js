document.addEventListener('DOMContentLoaded', () => {
    const playButtons = document.querySelectorAll('.song button');
    const audioPlayer = document.getElementById('audio-player');
    const currentSongName = document.getElementById('current-song-name');
    const currentCover = document.getElementById('current-cover');
    const playPauseButton = document.getElementById('play-pause');
    const playPauseIcon = playPauseButton.querySelector('i');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalDurationDisplay = document.getElementById('total-duration');
    
    let isPlaying = false;

    // Controlar la reproducción al hacer clic en una canción
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const songElement = button.parentElement;
            const songName = songElement.querySelector('p').textContent;
            const songSrc = songElement.getAttribute('data-src');
            const songCover = songElement.querySelector('img').src;

            playSong(songSrc, songName, songCover);
        });
    });

    // Función para reproducir una canción
    function playSong(src, name, cover) {
        // Actualizar la información del reproductor
        audioPlayer.src = src;
        currentSongName.textContent = name;
        currentCover.src = cover;

        // Reproducir la canción
        audioPlayer.play();
        isPlaying = true;
        updatePlayPauseIcon();

        // Cuando se carga la metadata de la canción (como la duración), actualizamos la duración total
        audioPlayer.addEventListener('loadedmetadata', () => {
            totalDurationDisplay.textContent = formatTime(audioPlayer.duration);
            progressBar.max = Math.floor(audioPlayer.duration);
        });
    }

    // Controlar el botón de play/pause
    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcon();
    });

    // Actualizar el ícono del botón de play/pause
    function updatePlayPauseIcon() {
        if (isPlaying) {
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        } else {
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    }

    // Actualizar la barra de progreso en tiempo real
    audioPlayer.addEventListener('timeupdate', () => {
        progressBar.value = Math.floor(audioPlayer.currentTime);
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    });

    // Permitir al usuario hacer clic en la barra de progreso para cambiar el tiempo
    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = progressBar.value;
    });

    // Función para formatear el tiempo en minutos y segundos
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar i');

    searchButton.addEventListener('click', async () => {
        const query = searchInput.value;

        // Enviar solicitud de búsqueda al backend
        const response = await fetch(`/buscar?query=${query}`);
        const songs = await response.json();

        // Limpiar la sección de resultados
        const contentSection = document.querySelector('.content');
        contentSection.innerHTML = '';

        // Mostrar los resultados en el frontend
        if (songs.length > 0) {
            songs.forEach(song => {
                const songDiv = document.createElement('div');
                songDiv.classList.add('song');

                const img = document.createElement('img');
                img.src = `/frontend/assets/img/portadas canciones/${song.album_title}.jpg`; // Ruta de la portada

                const p = document.createElement('p');
                p.textContent = `${song.song_title} - ${song.artist_name} (${song.album_title})`;

                const button = document.createElement('button');
                button.innerHTML = '<i class="fas fa-play"></i>';
                button.addEventListener('click', () => {
                    playSong(`/frontend/assets/canciones/${song.audio_file}`, song.song_title, img.src);
                });

                songDiv.appendChild(img);
                songDiv.appendChild(p);
                songDiv.appendChild(button);
                contentSection.appendChild(songDiv);
            });
        } else {
            contentSection.innerHTML = '<p>No se encontraron canciones.</p>';
        }
    });

    // Función para reproducir canciones
    function playSong(src, name, cover) {
        const audioPlayer = document.getElementById('audio-player');
        const currentSongName = document.getElementById('current-song-name');
        const currentCover = document.getElementById('current-cover');

        audioPlayer.src = src;
        currentSongName.textContent = name;
        currentCover.src = cover;
        audioPlayer.play();
    }
});


document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Enviar los datos al servidor
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Registro exitoso');
    } else {
        alert(data.message);
    }
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Enviar los datos al servidor para iniciar sesión
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (data.success) {
        // Guardar el token o el estado de sesión, redirigir a la página principal
        localStorage.setItem('token', data.token); // O cualquier otro mecanismo de autenticación
        window.location.href = 'index.html'; // Regresar a la página principal
    } else {
        document.getElementById('login-message').textContent = data.message || 'Error en el inicio de sesión.';
    }
});
