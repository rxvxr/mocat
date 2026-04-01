const world = document.getElementById("world");
const rainBtn = document.getElementById("rainBtn");

const cats = [];
const gravity = 0.35;
const bounce = 0.8;
const friction = 0.995;

const catImages = ["mcat1.png", "mcat2.png", "mcat3.png", "mcat4.png",];

let draggedCat = null;
let offsetX = 0;
let offsetY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseVX = 0;
let mouseVY = 0;

function createCat(x, y) {
  const img = document.createElement("img");
  const catImageIndex = Math.floor(Math.random() * catImages.length);
  img.src = catImages[catImageIndex];
  img.className = "cat";
  img.draggable = false;
  img.style.pointerEvents = "auto";
  world.appendChild(img);

  const isMobile = window.innerWidth < 768;
  let size;
  
  if (catImages[catImageIndex] === "mcat4.png") {
    // mcat4 is smaller
    size = isMobile ? 80 + Math.random() * 40 : 200 + Math.random() * 50;
  } else {
    // Other cats scale based on device
    size = isMobile ? 120 + Math.random() * 60 : 400 + Math.random() * 80;
  }

  const cat = {
    el: img,
    x: x !== null && x !== undefined ? x : Math.random() * window.innerWidth,
    y: y !== null && y !== undefined ? y : Math.random() * window.innerHeight * 0.4,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 2,
    width: size,
    height: size,
    isDragging: false
  };

  img.style.width = `${size}px`;
  img.style.height = `${size}px`;

  img.addEventListener("mousedown", (e) => {
    draggedCat = cat;
    cat.isDragging = true;

    offsetX = e.clientX - cat.x;
    offsetY = e.clientY - cat.y;

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    mouseVX = 0;
    mouseVY = 0;
  });

  img.addEventListener("touchstart", (e) => {
    draggedCat = cat;
    cat.isDragging = true;

    const touch = e.touches[0];
    offsetX = touch.clientX - cat.x;
    offsetY = touch.clientY - cat.y;

    lastMouseX = touch.clientX;
    lastMouseY = touch.clientY;
    mouseVX = 0;
    mouseVY = 0;
  });

  cats.push(cat);
  updateCat(cat);
}

function updateCat(cat) {
  cat.el.style.transform = `translate(${cat.x}px, ${cat.y}px)`;
}

function animate() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  for (const cat of cats) {
    if (!cat.isDragging) {
      cat.vy += gravity;
      cat.vx *= friction;

      cat.x += cat.vx;
      cat.y += cat.vy;

      if (cat.x <= 0) {
        cat.x = 0;
        cat.vx *= -bounce;
      }

      if (cat.x + cat.width >= screenWidth) {
        cat.x = screenWidth - cat.width;
        cat.vx *= -bounce;
      }

      if (cat.y <= 0) {
        cat.y = 0;
        cat.vy *= -bounce;
      }

      if (cat.y + cat.height >= screenHeight) {
        cat.y = screenHeight - cat.height;
        cat.vy *= -bounce;

        if (Math.abs(cat.vy) < 1) {
          cat.vy = 0;
        }
      }
    }

    updateCat(cat);
  }

  requestAnimationFrame(animate);
}

document.addEventListener("mousemove", (e) => {
  if (!draggedCat) return;

  draggedCat.x = e.clientX - offsetX;
  draggedCat.y = e.clientY - offsetY;

  mouseVX = e.clientX - lastMouseX;
  mouseVY = e.clientY - lastMouseY;

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

document.addEventListener("touchmove", (e) => {
  if (!draggedCat) return;

  const touch = e.touches[0];
  draggedCat.x = touch.clientX - offsetX;
  draggedCat.y = touch.clientY - offsetY;

  mouseVX = touch.clientX - lastMouseX;
  mouseVY = touch.clientY - lastMouseY;

  lastMouseX = touch.clientX;
  lastMouseY = touch.clientY;
}, { passive: false });

document.addEventListener("mouseup", () => {
  if (!draggedCat) return;

  draggedCat.isDragging = false;
  draggedCat.vx = mouseVX;
  draggedCat.vy = mouseVY;

  draggedCat = null;
});

document.addEventListener("touchend", () => {
  if (!draggedCat) return;

  draggedCat.isDragging = false;
  draggedCat.vx = mouseVX;
  draggedCat.vy = mouseVY;

  draggedCat = null;
});

rainBtn.addEventListener("click", () => {
  const isMobile = window.innerWidth < 768;
  const catCount = isMobile ? 12 : 30;
  for (let i = 0; i < catCount; i++) {
    createCat(
      null,
      null
    );
  }
});

const isMobile = window.innerWidth < 768;
const initialCats = isMobile ? 3 : 10;

for (let i = 0; i < initialCats; i++) {
  createCat(
    null,
    null
  );
}

animate();