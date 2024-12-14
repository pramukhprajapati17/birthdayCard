let memoryImageShown = {}; // Track whether an image has been shown
let birthdayCardRevealed = false; // Track if the birthday card message has been revealed

function setupScratchCard(canvas, revealContentCallback, preScratchText, memoryCard) {
  canvas.width='290';
  canvas.height='656';
  const ctx = canvas.getContext("2d");
  let isScratching = false;

  // Initialize scratch layer
  ctx.fillStyle = '#a3a3a3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Display "Scratch to open your gift!" text
  preScratchText.style.display = 'block';

  // Detect mouse or touch events
  canvas.addEventListener('mousedown', () => (isScratching = true));
  canvas.addEventListener('mouseup', () => (isScratching = false));
  canvas.addEventListener('mousemove', (e) => scratch(e, canvas));
  canvas.addEventListener('touchstart', () => (isScratching = true));
  canvas.addEventListener('touchend', () => (isScratching = false));
  canvas.addEventListener('touchmove', (e) => scratch(e.touches[0], canvas));

  function scratch(e, canvas) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    if (isRevealed(ctx, canvas)) {
      revealContentCallback();
      preScratchText.style.display = 'none';
      // Show the revealed image inside the card after scratch
      memoryCard.style.backgroundImage = memoryCard.dataset.memoryImage;
    }
  }

  function isRevealed(ctx, canvas) {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) clearPixels++;
    }
    return clearPixels / (pixels.length/4) > 0.3; // 30% reveal threshold
  }
}

// Setup the birthday card scratchable canvas
const birthdayCanvas = document.getElementById('birthdayCanvas');
const birthdayPreScratchText = document.querySelector('.pre-scratch-text');
setupScratchCard(birthdayCanvas, () => {
  const hiddenMessage = document.querySelector('.hidden-message');
  hiddenMessage.style.display = 'block'; // Show the hidden message
  birthdayCanvas.style.display = 'none'; // Hide the canvas
}, birthdayPreScratchText);

// Existing scratch card setup for memories
document.querySelectorAll('.memoryCanvas').forEach((canvas, index) => {
  const preScratchText = canvas.parentElement.querySelector('.pre-scratch-text');
  const memoryContent = document.querySelector(`.memory-card[data-memory="memory${index + 1}"] .hidden-image`);
  const memoryMessage = ``; // Customize the message for each memory
  const memoryCard = document.querySelector(`.memory-card[data-memory="memory${index + 1}"]`);
  
  // Store the background image for later use after scratch
  memoryCard.dataset.memoryImage = memoryContent.style.backgroundImage;

  setupScratchCard(canvas, () => {
    const memoryId = `memory${index + 1}`;

    if (!memoryImageShown[memoryId]) {
      const imageContainer = document.getElementById('bigImageContainer');
      const bigImage = document.getElementById('bigImage');
      const memoryImage = canvas.parentElement.querySelector('.hidden-image').style.backgroundImage;
      bigImage.style.backgroundImage = memoryImage;
      imageContainer.style.display = 'flex';

      memoryImageShown[memoryId] = true;

      // Display memory message
      const memoryText = document.createElement('div');
      memoryText.classList.add('memory-text');
      memoryText.innerText = memoryMessage; // Customize this message
      canvas.parentElement.appendChild(memoryText); // Append the message below the memory card
    }
  }, preScratchText, memoryCard);
});

// Handle cancel button for big image popup
document.getElementById('cancelButton').addEventListener('click', () => {
  document.getElementById('bigImageContainer').style.display = 'none';
});



// manually added

// function hideElement() {
//   var element = document.querySelector('.pre-scratch-text-card');
//   element.style.display = 'none';
// }


document.addEventListener("DOMContentLoaded", () => {
  const giftCanvas = document.querySelector(".giftCanvas");
  const hiddenVideo = document.querySelector(".hidden-video");
  const preScratchText = document.querySelector(".pre-scratch-text");
  const closeButton = document.querySelector(".close-button");

  if (giftCanvas && hiddenVideo) {
    const ctx = giftCanvas.getContext("2d");
    giftCanvas.width = 280;
    giftCanvas.height = 200;

    // Set the fill style to #a3a3a3
    ctx.fillStyle = '#a3a3a3';
    ctx.fillRect(0, 0, giftCanvas.width, giftCanvas.height);

    // Store scratched areas
    let scratched = 0;

    // Mouse/touch handling
    let isScratching = false;

    const startScratching = () => (isScratching = true);
    const stopScratching = () => (isScratching = false);

    const scratch = (e) => {
      if (!isScratching) return;

      const rect = giftCanvas.getBoundingClientRect();
      const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Count cleared pixels
      const imageData = ctx.getImageData(0, 0, giftCanvas.width, giftCanvas.height);
      scratched = imageData.data.filter((pixel, index) => index % 4 === 3 && pixel === 0).length;

      const totalPixels = giftCanvas.width * giftCanvas.height;
      const scratchPercent = (scratched / totalPixels) * 100;

      // Reveal video if scratched area exceeds 30%
      if (scratchPercent > 30) {
        hiddenVideo.style.display = "block";
        preScratchText.style.display = "none";
        giftCanvas.style.display = "none";
      }
    };

    // Add event listeners
    giftCanvas.addEventListener("mousedown", startScratching);
    giftCanvas.addEventListener("mouseup", stopScratching);
    giftCanvas.addEventListener("mousemove", scratch);

    giftCanvas.addEventListener("touchstart", startScratching);
    giftCanvas.addEventListener("touchend", stopScratching);
    giftCanvas.addEventListener("touchmove", scratch);

    // Close button to hide the video overlay
    closeButton.addEventListener("click", () => {
      hiddenVideo.style.display = "none";
    });
  }
});
