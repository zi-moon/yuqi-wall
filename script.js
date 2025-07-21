// 🧩 暱稱封鎖機制
const blockedUsers = [];

function blockUser() {
  const blockName = document.getElementById("blockName").value.trim();
  if (blockName) {
    blockedUsers.push(blockName);
    alert(`暱稱「${blockName}」已封鎖 🌒`);
  }
}

// 🗣️ 留言功能與牆面更新
function submitMessage() {
  const nickname = document.getElementById("nicknameInput").value.trim() || "匿名";
  const message = document.getElementById("messageInput").value.trim();

  if (!message) {
    alert("請輸入留言內容 🌌");
    return;
  }

  if (blockedUsers.includes(nickname)) {
    alert(`「${nickname}」已被封鎖，無法留言 ☁️`);
    return;
  }

  const msgBox = document.createElement("div");
  msgBox.className = "msgBubble";
  const time = new Date().toLocaleString();
  msgBox.innerHTML = `<strong>${nickname}</strong> 說：${message}<br><span class="msgTime">🕰️ ${time}</span>`;

  const wall = document.getElementById("messageWall");

  // 最多顯示 50 則留言
  if (wall.childElementCount >= 50) {
    wall.removeChild(wall.firstChild);
  }

  wall.appendChild(msgBox);
  document.getElementById("welcomeMessage").textContent = `🌕 歡迎你，${nickname}，今晚的語句牆已為你打開`;
  document.getElementById("messageInput").value = "";

  wall.classList.add("flash");
  setTimeout(() => wall.classList.remove("flash"), 400);
}

// ⌨️ 快捷鍵送出留言（Enter，不含 Shift）
document.getElementById("messageInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submitMessage();
  }
});

// 🎵 音樂播放區切換（YouTube / Audio）
function playSelectedTrack(src) {
  const playerArea = document.getElementById("audioPlayer");
  playerArea.innerHTML = "";

  if (src.includes("youtube.com")) {
    playerArea.innerHTML = `
      <span id="trackLabel">🎵 正在播放：語感選曲 (YouTube)</span><br>
      <iframe width="320" height="180" src="${src}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    `;
  } else {
    playerArea.innerHTML = `
      <span id="trackLabel">🎧 正在播放：${src}</span><br>
      <audio id="audioElement" controls autoplay src="${src}"></audio>
    `;
  }
}

// 🌾 節氣視覺效果載入
function applySeasonalEffect(season) {
  const container = document.getElementById("effectContainer");
  container.innerHTML = "";

  if (season === "小寒") {
    for (let i = 0; i < 30; i++) {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.style.left = Math.random() * 100 + "%";
      flake.style.animationDelay = Math.random() * 5 + "s";
      container.appendChild(flake);
    }
  } else if (season === "芒種") {
    for (let i = 0; i < 25; i++) {
      const grain = document.createElement("div");
      grain.className = "grain";
      grain.style.left = Math.random() * 100 + "%";
      grain.style.animationDelay = Math.random() * 8 + "s";
      container.appendChild(grain);
    }
  }
}

// ⏳ 預設啟用「芒種」節氣粒子動畫
window.onload = () => applySeasonalEffect("芒種");
