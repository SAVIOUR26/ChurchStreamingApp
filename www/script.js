// Constants
const API_KEY = 'AIzaSyDe-wybVWOKtlLvh1FoVx5F34dIO5KnaJw'; // Replace with your YouTube Data API key
const CHANNEL_ID = 'UC4IBfWgcAnJaZYB2mjs9oSA';
const MAX_RESULTS = 3; // Set your desired number of initial results

// DOM Elements
const playerContainer = document.getElementById('player-container');
const liveStatus = document.getElementById('live-status');
const videoList = document.getElementById('video-list');
const loadMoreBtn = document.getElementById('load-more-btn');
const interactiveText = document.getElementById('interactive-text');

// Variables
let nextPageToken = ''; // To store the token for paginated requests

// Interactive text statements
const statements = [
  "Grace Covenant Church",
  "We Minister Grace to the Hurting World",
  "Ephesians 2:8, 2 Peter 3:18"
];

let statementIndex = 0; // Index to track the current statement

// Constants
const PLAYER_CONTAINER_ID = 'player-container'; // Replace with the actual ID of your player container

// Load YouTube player
function loadYouTubePlayer(videoId) {
  // Ensure the YouTube Iframe API script is loaded
  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
    // Handle the case when the API script is not yet loaded
    console.error('YouTube Iframe API not loaded.');
    return;
  }

  // Create a new YouTube player
  new YT.Player(PLAYER_CONTAINER_ID, {
    height: '360', // Set the desired height
    width: '640',  // Set the desired width
    videoId: videoId,
    events: {
      // Add any events you want to handle, e.g., onReady, onStateChange, etc.
    },
  });
}

// Ensure that the YouTube API script is loaded before using the loadYouTubePlayer function
// Add the YouTube API script to the head of your HTML file

// Call loadYouTubePlayer with a specific video ID when needed, for example, after checking for live stream
// Example:
// loadYouTubePlayer('YOUR_VIDEO_ID');

// Check for live stream
function checkLiveStream() {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      console.log('YouTube API Response:', data);  // Log the API response
      if (data.items.length > 0) {
        const liveStreamId = data.items[0].id.videoId;

        // Load the YouTube player
        loadYouTubePlayer(liveStreamId);

        // Display live status message
        displayLiveStatus('Live stream is currently ongoing!');
      } else {
        // No live stream
        displayLiveStatus('No live stream is currently happening.');
      }
    })
    .catch(error => {
      console.error('Error checking live stream:', error);
      displayLiveStatus('Error checking live stream. Please try again later.');
    });
}


// Fetch past videos
function getPastVideos(channelId, maxResults, pageToken) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&type=video&order=date&key=${API_KEY}&pageToken=${pageToken || ''}`)
    .then(response => response.json())
    .then(data => {
      nextPageToken = data.nextPageToken || ''; // Store the next page token for paginated requests
      renderVideoList(data.items);
    })
    .catch(error => {
      console.error('Error fetching past videos:', error);
      videoList.innerHTML = '<li>Error fetching past videos. Please try again later.</li>';
    });
}

// Render video list
// Render video list
function renderVideoList(videos) {
  videos.forEach(video => {
    const videoItem = document.createElement('div');
    videoItem.innerHTML = `
      <div class="video-item">
        <div id="${PLAYER_CONTAINER_ID}-${video.id.videoId}"></div>
        <h3>${video.snippet.title}</h3>
      </div>`;
    videoList.appendChild(videoItem);

    // Load YouTube player for each video
    loadYouTubePlayer(video.id.videoId);
  });
}

// Load YouTube player
function loadYouTubePlayer(videoId) {
  // Ensure the YouTube Iframe API script is loaded
  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
    // Handle the case when the API script is not yet loaded
    console.error('YouTube Iframe API not loaded.');
    return;
  }

  // Create a new YouTube player for each video
  new YT.Player(`${PLAYER_CONTAINER_ID}-${videoId}`, {
    height: '100%', // Set the desired height
    width: '100%',  // Set the desired width
    videoId: videoId,
    events: {
      // Add any events you want to handle, e.g., onReady, onStateChange, etc.
    },
  });
}


// Load more videos
function loadMoreVideos() {
  getPastVideos(CHANNEL_ID, MAX_RESULTS, nextPageToken);
}

// Update interactive text
function updateInteractiveText() {
  interactiveText.textContent = statements[statementIndex];
  statementIndex = (statementIndex + 1) % statements.length;
}

// Event listener for "Load More" button
loadMoreBtn.addEventListener('click', loadMoreVideos);

// Call functions on page load
window.onload = function () {
  checkLiveStream();
  getPastVideos(CHANNEL_ID, MAX_RESULTS);

  // Set interval for updating interactive text
  setInterval(updateInteractiveText, 3000); // Change text every 3 seconds
};

// ... Existing JavaScript code ...

// Display live status message
function displayLiveStatus(message) {
    liveStatus.textContent = message;
  }
  
  // ... Existing JavaScript code ...

// Update welcome text and icons
function updateWelcomeTextAndIcons() {
    const welcomeText = document.getElementById('welcome-text');
    const welcomeSection = document.getElementById('welcome-section');
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('fa-blink-container');
  
    welcomeText.textContent = "Grace Covenant Church.\nWe Minister Grace to the Hurting World.\nEphesians 2:8, 2 Peter 3:18";
  
    // Font Awesome icons
    const icons = ['cross', 'dove', 'star', 'book-open', 'praying-hands', 'angel', 'flame', 'eye', 'circle', 'heart', 'candle'];
    icons.forEach(iconClass => {
      const icon = document.createElement('i');
      icon.classList.add('fas', `fa-${iconClass}`, 'fa-blink');
      iconContainer.appendChild(icon);
    });
  
    welcomeSection.appendChild(iconContainer);
  }
  
  // Call functions on page load
  window.onload = function () {
    checkLiveStream();
    getPastVideos(CHANNEL_ID, MAX_RESULTS);
    updateWelcomeTextAndIcons();
  };
  
  