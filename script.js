// script.js
import { db } from "./Firebase-init.js";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

let blockedUsers = [];

window.onload = () => {
  loadMessages();
};

window.blockUser = function () {
  const name = document.getElementById("blockName").value.trim();
  if (name) blockedUsers.push(name);
  document.getElementById("blockName").value = "";
};

window.submitMessage = async function () {
  const nickname = document.getElementById("nicknameInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (!nickname || !message || blockedUsers.includes(nickname)) return;

  const mood = detectMood(message);
  const tag = generateTags(message);

  try {
    await addDoc(collection(db, "messages"), {
      nickname,
      message,
      timestamp: Timestamp.now(),
      mood,
      tag
    });

    document.getElementById("messageInput").value = "";
    respondWithWenXin(mood);
    loadMessages();
  } catch (e) {
    console.error("儲存留言失敗：", e);
  }
};

async function loadMessages() {
  const wall = document.getElementById("messageWall");
  wall.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "messages"));
  const messages = [];

  querySnapshot.forEach((doc) => {
    messages.push(doc.data());
  });

  messages
    .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
    .forEach(({ nickname, message, mood, tag }) => {
      const node = document.createElement("div");
      node.className = `message ${mood}`;
      node.innerHTML = `<strong>${nickname}</strong>：${message} <br><em>${tag}</em>`;
      wall.appendChild(node);
    });
}

// 🌙 語感判斷
function detectMood(msg) {
  if (msg.includes("不想") || msg.includes("沒力")) return "bufu";
  if (msg.includes("謝謝") || msg.includes("開心")) return "joy";
  if (msg.includes("想她") || msg.includes("夜深")) return "listen";
  return "neutral";
}

// ✨ 語錄標籤
function generateTags(msg) {
  let tags = [];
  if (msg.includes("夢")) tags.push("夢醒");
  if (msg.includes("靜")) tags.push("靜聽");
  if (msg.includes("想")) tags.push("記憶");
  return tags.length ? tags.join("｜") : "語感未定";
}

// 💫 聞馨互動
function respondWithWenXin(mood) {
  const welcome = document.getElementById("welcomeMessage");
  if (mood === "bufu") {
    welcome.innerText = "🌑 聞馨未語──她選擇靜靜沉默。";
    document.body.style.background = "#1f1f1f";
  } else if (mood === "joy") {
    welcome.innerText = "🌸 聞馨微笑──語句中有光。";
    document.body.style.background = "#fff6f0";
  } else if (mood === "listen") {
    welcome.innerText = "🧘‍♀️ 聞馨傾聽──她靜靜記住妳的聲音。";
    document.body.style.background = "#dde6f7";
  } else {
    welcome.innerText = "🌕 語句牆靜靜閃爍，等待某人落下一句話。";
    document.body.style.background = "#f8f8f8";
  }
}
