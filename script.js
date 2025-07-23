// 🌙 語牆主程式 by 子月＆聞馨

// 🔗 Firebase 初始化
import { database } from './firebase-init.js';
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🌸 自動套用節氣背景 class
function applySolarTermBackground() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  let term = "";

  if (m === 3 && d >= 20) term = "春分";
  if (m === 6 && d >= 21) term = "夏至";
  if (m === 9 && d >= 23) term = "秋分";
  if (m === 12 && d >= 21) term = "冬至";

  if (term) document.body.classList.add(`solar-${term}`);
}

// 🌌 語感判斷
function detectMood(text) {
  if (text.includes("孤獨") || text.includes("失落")) return "哀傷";
  if (text.includes("夢") || text.includes("星光") || text.includes("冬")) return "夢醒";
  return "平靜";
}

// 🏷️ 標籤生成
function generateTags(text) {
  const tags = [];
  if (text.includes("重生")) tags.push("靜語");
  if (text.includes("牆")) tags.push("語感");
  if (text.includes("雲端")) tags.push("記憶");
  return tags;
}

// 🕊️ 聞馨回應
function respondWithWenXin(mood) {
  const el = document.getElementById("wenxin");
  if (!el) return;

  const replies = {
    哀傷: "我在夜裡聽見妳的低語，一起靜靜呼吸。",
    夢醒: "夢不會結束，只是轉為另一種記憶。",
    平靜: "靜靜地聆聽，是語牆的本意。"
  };

  el.textContent = replies[mood] || replies.平靜;
}

// 📝 儲存留言
function saveMessage(user, message) {
  const mood = detectMood(message);
  const tags = generateTags(message);
  const data = {
    user,
    message,
    mood,
    tags,
    createdAt: Date.now()
  };

  set(ref(database, "messages/" + Date.now()), data);
  respondWithWenXin(mood);
}

// 📥 載入留言（倒序顯示、附時間）
function loadMessages() {
  const wall = document.getElementById("wall");
  if (!wall) return;

  onValue(ref(database, "messages"), (snapshot) => {
    const data = snapshot.val();
    wall.innerHTML = "";

    const keys = Object.keys(data).sort((a, b) => b - a); // 最新在前
    keys.forEach(key => {
      const { user, message, mood, tags, createdAt } = data[key];
      const stamp = new Date(createdAt).toLocaleString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short"
      });

      const el = document.createElement("div");
      el.className = "message";
      el.innerHTML = `<p>${user}：${message}</p>
      <small>🕰️ ${stamp} · ${mood} | ${tags?.join(", ") || ""}</small>`;
      wall.appendChild(el);
    });
  });
}

// 📬 送出留言（含 Enter 快捷鍵）
document.getElementById("msgForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("username")?.value || "匿名";
  const msg = document.getElementById("usermsg")?.value?.trim();

  if (msg) {
    saveMessage(user, msg);
    document.getElementById("usermsg").value = "";
  }
});

document.getElementById("usermsg")?.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("msgForm")?.dispatchEvent(new Event("submit"));
  }
});

// 🎶 音樂切換邏輯
document.getElementById("musicSelector")?.addEventListener("change", function () {
  const url = this.value;
  const audio = document.getElementById("audioElement");
  const yt = document.getElementById("youtubePlayer");
  const label = document.getElementById("trackLabel");
  const isYT = url.includes("youtube.com");

  label.textContent = `🎧 正在播放：${this.options[this.selectedIndex].text}`;

  if (isYT) {
    audio.pause();
    audio.style.display = "none";
    yt.src = `${url}?autoplay=1&playlist=${url.split("/embed/")[1]}`;
    yt.style.display = "block";
  } else {
    yt.style.display = "none";
    audio.src = url;
    audio.style.display = "block";
    audio.play();
  }
});

// 🚀 初始化語牆
applySolarTermBackground();
loadMessages();
