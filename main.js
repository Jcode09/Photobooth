const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const finalCanvas = document.getElementById('final-canvas');
const startBtn = document.getElementById('start-btn');
const saveBtn = document.getElementById('save-btn');
const collageContainer = document.getElementById('collage-container');
const collageCountSelect = document.getElementById('collage-count');
const timerDisplay = document.getElementById('timer');

let images = [];
let countdownInterval;
let currentPhotoIndex = 0;
let collageCount = 1;

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing the camera: ", err);
  });

// Start photo booth
startBtn.addEventListener('click', () => {
  collageCount = parseInt(collageCountSelect.value);
  images = []; // Reset images array
  collageContainer.innerHTML = ''; // Clear previous images
  saveBtn.disabled = true; // Disable save button until all photos are captured
  currentPhotoIndex = 0; // Reset photo index
  startCountdown();
});

// Start countdown timer and capture photos
function startCountdown() {
  if (currentPhotoIndex >= collageCount) {
    createCollage();
    return;
  }

  let timeLeft = 10; // Set countdown to 3 seconds per photo
  timerDisplay.textContent = timeLeft;

  countdownInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      capturePhoto(); // Capture the photo
    }
  }, 1000);
}

// Capture photo
function capturePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageUrl = canvas.toDataURL('image/png');
  images.push(imageUrl);

  const imgElement = document.createElement('img');
  imgElement.src = imageUrl;
  collageContainer.appendChild(imgElement);

  currentPhotoIndex++;

  if (currentPhotoIndex < collageCount) {
    startCountdown(); // Continue capturing if more photos are needed
  } else {
    createCollage(); // All images taken, proceed to collage creation
  }
}

// Create final collage
function createCollage() {
  const imageWidth = 300; // Width of each image in the collage
  const imageHeight = 300; // Height of each image in the collage
  const borderWidth = 10; // Border width around each image
  const spacing = 10; // Spacing between images

  // Calculate final canvas dimensions
  const finalWidth = imageWidth + 2 * borderWidth;
  const finalHeight = (imageHeight + 2 * borderWidth + spacing) * collageCount - spacing;

  finalCanvas.width = finalWidth;
  finalCanvas.height = finalHeight;
  const ctx = finalCanvas.getContext('2d');

  // Set background color
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, finalWidth, finalHeight);

  images.forEach((img, index) => {
    const imgElement = new Image();
    imgElement.src = img;
    imgElement.onload = () => {
      const x = borderWidth;
      const y = (imageHeight + 2 * borderWidth + spacing) * index + borderWidth;
      ctx.drawImage(imgElement, x, y, imageWidth, imageHeight);
    };
  });

  saveBtn.disabled = false; // Enable save button
}

// Save collage
saveBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'photobooth_collage.png';
  link.href = finalCanvas.toDataURL('image/png');
  link.click();
});
