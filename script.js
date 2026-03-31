const world = document.getElementById("world");
const rainBtn = document.getElementById("rainBtn");

const cats = [];
const gravity = 0.35;
const bounce = 0.8;
const friction = 0.995;

const catImage = "mcat.png";

let draggedCat = null;
let offsetX = 0;
let offsetY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseVX = 0;
let mouseVY = 0;

function createCat(x, y) {
  const img = document.createElement("img");
  img.src = catImage;
  img.className = "cat";
  img.draggable = false;
  img.style.pointerEvents = "auto";
  world.appendChild(img);

  const size = 400 + Math.random() * 80;

  const cat = {
    el: img,
    x: x,
    y: y,
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

document.addEventListener("mouseup", () => {
  if (!draggedCat) return;

  draggedCat.isDragging = false;
  draggedCat.vx = mouseVX;
  draggedCat.vy = mouseVY;

  draggedCat = null;
});

rainBtn.addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    createCat(
      Math.random() * (window.innerWidth - 200),
      -Math.random() * 300
    );
  }
});

for (let i = 0; i < 5; i++) {
  createCat(
    Math.random() * (window.innerWidth - 200),
    Math.random() * 200
  );
}

animate();