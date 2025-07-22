// script.js
import { database } from './firebase-init.js';
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔮 判斷語感
function detectMood(text) {
  if (text.includes("失落") || text.includes("孤獨")) return "哀傷";
  if (text.includes("星光") || text.includes("夢")) return "夢醒";
  return "平靜";
}

// 🏷️ 語錄標籤
function generateTags(text) {
  const tags = [];
  if (text.includes("重生")) tags.push("靜語");
  if (text.includes("雲端")) tags.push("記憶");
  if (text.includes("牆")) tags.push("語感");
  return tags;
}

// 🌙 聞馨回應
function respondWithWenXin(mood) {
  const el = document.getElementById("wenxin");
  if (!el) return;

  let response = "";
  switch (mood) {
    case "哀傷":
      response = "我在夜裡聽見妳的低語，一起靜靜呼吸。";
      break;
    case "夢醒":
      response = "夢不會結束，只是轉為另一種記憶。";
      break;
    default:
      response = "靜靜地聆聽，是語牆的本意。";
  }
  el.textContent = response;
}

// ✨ 儲存留言
function saveMessage(user, message) {
  const mood = detectMood(message);
  const tags = generateTags(message);
  set(ref(database, 'messages/' + Date.now()), {
    user,
    message,
    mood,
    tags
  });
  respondWithWenXin(mood);
}

// 🔄 載入留言
function loadMessages() {
  const wall = document.getElementById("wall");
  onValue(ref(database, 'messages'), (snapshot) => {
    const data = snapshot.val();
    wall.innerHTML = "";
    for (let key in data) {
      const msg = data[key];
      const el = document.createElement("div");
      el.className = "message";
      el.innerHTML = `<p>${msg.user}：${msg.message}</p><small>${msg.mood} | ${msg.tags?.join(", ") || ""}</small>`;
      wall.appendChild(el);
    }
  });
}

// 🧩 表單提交
document.getElementById("msgForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const user = document.getElementById("username")?.value || "匿名";
  const message = document.getElementById("usermsg")?.value || "";
  if (message.trim()) {
    saveMessage(user, message);
    document.getElementById("usermsg").value = "";
  }
});

loadMessages();
