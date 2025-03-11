// Default Playlist with Royalty Free Music
const playlist = [
    {
        title: "Guitar Electro Sport",
        artist: "Alex Grohl",
        src: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3",
        albumArt: "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg"
    },
    {
        title: "Epic Cinematic",
        artist: "Music Unlimited",
        src: "https://cdn.pixabay.com/download/audio/2022/09/06/audio_8a49937f87.mp3",
        albumArt: "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg"
    },
    {
        title: "Summer Walk",
        artist: "Olexy",
        src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
        albumArt: "https://images.pexels.com/photos/1913689/pexels-photo-1913689.jpeg"
    }
];

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const albumArt = document.getElementById('albumArt');
const trackTitle = document.getElementById('trackTitle');
const artistName = document.getElementById('artistName');
const playlistItems = document.getElementById('playlistItems');
const playlistToggle = document.getElementById('playlistToggle');
const addSongModal = document.getElementById('addSongModal');
const addSongForm = document.getElementById('addSongForm');
const cancelAddSong = document.getElementById('cancelAddSong');
const notification = document.getElementById('notification');

// Variables
let currentTrackIndex = 0;

// Load Track
function loadTrack(index) {
    const track = playlist[index];
    audioPlayer.src = track.src;
    albumArt.src = track.albumArt;
    trackTitle.textContent = track.title;
    artistName.textContent = track.artist;
    audioPlayer.load();
}

// Play/Pause Track
function playTrack() {
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause text-2xl"></i>';
}

function pauseTrack() {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play text-2xl"></i>';
}

// Update Progress Bar
audioPlayer.addEventListener('timeupdate', () => {
    const { currentTime: current, duration: total } = audioPlayer;
    const progressPercent = (current / total) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTime.textContent = formatTime(current);
    duration.textContent = formatTime(total);
});

// Format Time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Next Track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

// Previous Track
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

// Toggle Playlist
playlistToggle.addEventListener('click', () => {
    const playlistSidebar = document.getElementById('playlist');
    playlistSidebar.classList.toggle('translate-x-full');
});

// Show Add Song Modal
document.getElementById('addSongBtn').addEventListener('click', () => {
    addSongModal.classList.remove('hidden');
    addSongModal.classList.add('flex');
});

// Add Song
addSongForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newSong = {
        title: document.getElementById('songTitle').value,
        artist: document.getElementById('songArtist').value,
        src: document.getElementById('songUrl').value,
        albumArt: document.getElementById('albumArtUrl').value
    };
    
    // Validate audio URL
    const audio = new Audio();
    audio.src = newSong.src;
    
    audio.addEventListener('error', () => {
        showNotification('Invalid audio URL. Please check the URL and try again.');
    });
    
    audio.addEventListener('loadedmetadata', () => {
        playlist.push(newSong);
        updatePlaylistUI();
        addSongModal.classList.remove('flex');
        addSongModal.classList.add('hidden');
        addSongForm.reset();
        showNotification('Song added successfully!', 'success');
    });
});

// Show Notification
function showNotification(message, type = 'error') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('opacity-0');
    notification.classList.remove('bg-red-500', 'bg-green-500');
    notification.classList.add(type === 'error' ? 'bg-red-500' : 'bg-green-500');
    
    setTimeout(() => {
        notification.classList.add('opacity-0');
    }, 3000);
}

// Remove Song
function removeSong(index) {
    playlist.splice(index, 1);
    updatePlaylistUI();
}

// Event Listeners
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
});

nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
cancelAddSong.addEventListener('click', () => {
    addSongModal.classList.add('hidden');
});

// Error handling for audio
audioPlayer.addEventListener('error', () => {
    showNotification('Error loading audio. Please try another track.');
    nextTrack();
});

// Handle click on playlist items
function handlePlaylistItemClick(index) {
    currentTrackIndex = index;
    loadTrack(currentTrackIndex);
    playTrack();
}

// Update Playlist UI with click handlers
function updatePlaylistUI() {
    playlistItems.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-3 hover:bg-purple-900/50 rounded cursor-pointer';
        li.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${track.albumArt}" alt="${track.title}" class="w-12 h-12 rounded object-cover">
                <div>
                    <div class="font-medium">${track.title}</div>
                    <div class="text-sm text-gray-400">${track.artist}</div>
                </div>
            </div>
            <button class="text-red-500 hover:text-red-400" onclick="event.stopPropagation(); removeSong(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        li.addEventListener('click', () => handlePlaylistItemClick(index));
        playlistItems.appendChild(li);
    });
}

// Initialize
updatePlaylistUI();
loadTrack(currentTrackIndex);
