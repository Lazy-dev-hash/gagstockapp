const bgm = document.getElementById("bgm");
window.addEventListener("click", () => {
  bgm.volume = 0.3;
  bgm.play().catch(e => console.log("Autoplay blocked:", e));
}, { once: true });

const loadingScreen = document.getElementById("loading");

function updateCountdown(fillId, secondsLeft, maxSeconds) {
  const fill = document.getElementById(fillId);
  const percent = Math.min(100, (secondsLeft / maxSeconds) * 100);
  fill.style.width = `${percent}%`;
}

function drawCircularTimer(canvasId, percent) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const radius = 18;
  canvas.width = canvas.height = 40;
  ctx.clearRect(0, 0, 40, 40);
  ctx.beginPath();
  ctx.arc(20, 20, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(20, 20, radius, -Math.PI / 2, 2 * Math.PI * (percent / 100) - Math.PI / 2);
  ctx.strokeStyle = "#88e7a3";
  ctx.lineWidth = 4;
  ctx.stroke();
}

async function fetchData() {
  try {
    const [gearRes, eggRes, weatherRes, honeyRes] = await Promise.all([
      fetch("https://growagardenstock.com/api/stock?type=gear-seeds"),
      fetch("https://growagardenstock.com/api/stock?type=egg"),
      fetch("https://growagardenstock.com/api/stock/weather"),
      fetch("http://65.108.103.151:22377/api/stocks?type=honeyStock")
    ]);

    const gear = await gearRes.json();
    const egg = await eggRes.json();
    const weather = await weatherRes.json();
    const honey = await honeyRes.json();

    document.getElementById("gearList").textContent = gear.gear?.join("\n") || "No gear.";
    document.getElementById("seedList").textContent = gear.seeds?.join("\n") || "No seeds.";
    document.getElementById("eggList").textContent = egg.egg?.join("\n") || "No eggs.";

    document.getElementById("weatherDesc").textContent = `${weather.icon || "🌦️"} ${weather.currentWeather}`;
    document.getElementById("weatherBonus").textContent = `🪴 Bonus: ${weather.cropBonuses}`;
    document.getElementById("weatherLottie").setAttribute("src", weather.lottieUrl || "https://assets7.lottiefiles.com/packages/lf20_iwmd6pyr.json");

    const honeyList = honey.honeyStock || [];
    document.getElementById("honeyList").textContent = honeyList.length
      ? honeyList.map((h) => `🍯 ${h.name}: ${h.value}`).join("\n")
      : "No honey available.";

    const now = Date.now();
    const gearLeft = 300 - Math.floor((now - gear.updatedAt) / 1000);
    const eggLeft = 600 - Math.floor((now - egg.updatedAt) / 1000);
    updateCountdown("gearFill", gearLeft, 300);
    updateCountdown("eggFill", eggLeft, 600);
    drawCircularTimer("gearCircle", (gearLeft / 300) * 100);
    drawCircularTimer("eggCircle", (eggLeft / 600) * 100);

    loadingScreen.classList.add("hidden");
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

fetchData();
setInterval(fetchData, 30000);

tsParticles.load("tsparticles", {
  fullScreen: { enable: false },
  particles: {
    number: { value: 60 },
    size: { value: 3 },
    move: { enable: true, speed: 0.6 },
    color: { value: ["#88e7a3", "#ffc6ff"] },
    links: { enable: true, color: "#ffffff33" },
  },
  background: { color: "transparent" },
});
