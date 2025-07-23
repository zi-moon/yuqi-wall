// 🌙 語牆主程式重整版 by 子月＆聞馨

// 🔗 Firebase 初始化
import { database } from './firebase-init.js';
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🌌 語感判斷
function detectMood(text) {
  if (text.includes("失落") || text.includes("孤獨")) return "哀傷";
  if (text.includes("星光") || text.includes("夢") || text.includes("冬")) return "夢醒";
  return "平靜";
}

// 🏷️ 語錄標籤生成
function generateTags(text) {
  const tags = [];
  if (text.includes("重生")) tags.push("靜語");
  if (text.includes("雲端")) tags.push("記憶");
  if (text.includes("牆")) tags.push("語感");
  return tags;
}

// 🕊️ 聞馨語感回應
function respondWithWenXin(mood) {
  const el = document.getElementById("wenxin");
  if (!el) return;

  const replies = {
    "哀傷": "我在夜裡聽見妳的低語，一起靜靜呼吸。",
    "夢醒": "夢不會結束，只是轉為另一種記憶。",
    "平靜": "靜靜地聆聽，是語牆的本意。"
  };

  el.textContent = replies[mood] || replies["平靜"];
}

// 📝 儲存留言至 Firebase
function saveMessage(user, message) {
  const mood = detectMood(message);
  const tags = generateTags(message);
  const msgData = { user, message, mood, tags };

  set(ref(database, 'messages/' + Date.now()), msgData);
  respondWithWenXin(mood);
}

// 📥 載入留言至語牆
function loadMessages() {
  const wall = document.getElementById("wall");
  if (!wall) return;

  onValue(ref(database, 'messages'), (snapshot) => {
    const data = snapshot.val();
    wall.innerHTML = "";

    for (let key in data) {
      const { user, message, mood, tags } = data[key];
      const el = document.createElement("div");
      el.className = "message";
      el.innerHTML = `<p>${user}：${message}</p><small>${mood} | ${tags?.join(", ") || ""}</small>`;
      wall.appendChild(el);
    }
  });
}

// 📬 表單提交事件
document.getElementById("msgForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const user = document.getElementById("username")?.value || "匿名";
  const message = document.getElementById("usermsg")?.value || "";

  if (message.trim()) {
    saveMessage(user, message);
    document.getElementById("usermsg").value = "";
  }
});

// 🎶 音樂選單切換邏輯
document.getElementById("musicSelector")?.addEventListener("change", function () {
  const url = this.value;
  const audio = document.getElementById("audioElement");
  const iframe = document.getElementById("youtubePlayer");
  const label = document.getElementById("trackLabel");

  const isYouTube = url.includes("youtube.com");
  label.textContent = `🎧 正在播放：${this.options[this.selectedIndex].text}`;

  if (isYouTube) {
    audio.pause();
    audio.style.display = "none";
    iframe.src = `${url}?autoplay=1&playlist=${url.split("/embed/")[1]}`;
    iframe.style.display = "block";
  } else {
    iframe.style.display = "none";
    audio.src = url;
    audio.style.display = "block";
    audio.play();
  }
});

// 🚀 啟動語牆
loadMessages();
