// script.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("solarCanvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Add Sun
const sunGeo = new THREE.SphereGeometry(2, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 300);
light.position.set(0, 0, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xaaaaaa, 5); // soft light
scene.add(ambientLight);

// Planets
const planetsData = [
  { name: "Mercury", radius: 0.4, distance: 5, color: 0x909090 },
  { name: "Venus", radius: 0.7, distance: 7, color: 0xe6d8ad },
  { name: "Earth", radius: 0.8, distance: 9, color: 0x2a63ff },
  { name: "Mars", radius: 0.6, distance: 11, color: 0xff4500 },
  { name: "Jupiter", radius: 1.2, distance: 14, color: 0xd2b48c },
  { name: "Saturn", radius: 1.1, distance: 17, color: 0xf5deb3 },
  { name: "Uranus", radius: 0.9, distance: 20, color: 0xadd8e6 },
  { name: "Neptune", radius: 0.9, distance: 23, color: 0x4169e1 },
];

const planetGroups = {};
const speeds = {};
planetsData.forEach((data) => {
  const planetGeo = new THREE.SphereGeometry(data.radius, 32, 32);
  const planetMat = new THREE.MeshStandardMaterial({ color: data.color });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  planet.position.x = data.distance;

  const pivot = new THREE.Object3D();
  pivot.add(planet);
  scene.add(pivot);

  planetGroups[data.name] = pivot;
  speeds[data.name] = 0.01;

  // Bind slider input
  const input = document.getElementById(`${data.name.toLowerCase()}-speed`);
  if (input) {
    input.addEventListener("input", (e) => {
      speeds[data.name] = parseFloat(e.target.value) * 0.01;
    });
  }
});

camera.position.z = 35;
let paused = false;

document.getElementById("toggle-animation").addEventListener("click", () => {
  paused = !paused;
  document.getElementById("toggle-animation").innerText = paused
    ? "Resume"
    : "Pause";
});

// Stars background
function addStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
addStars();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    for (let name in planetGroups) {
      planetGroups[name].rotation.y += speeds[name];
    }
  }
  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
