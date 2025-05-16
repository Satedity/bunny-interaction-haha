
const videoEl = document.getElementById('bunnyVideo');
const responseEl = document.getElementById('bunnyResponse');
const retryBtn = document.getElementById('startSpeech');
const successSection = document.getElementById('successSection');
const successVideo = document.getElementById('successVideo');

videoEl.muted = false;
successVideo.muted = false;

let currentStep = 0;
let failCount = 0;

const videos = {
  intro: "videos/intro.mp4",
  encourage: "videos/encourage.mp4",
  success: "videos/success.mp4"
};

function playIntro() {
  currentStep = 1;
  videoEl.src = videos.intro;
  responseEl.textContent = "小兔子来了，等一下要说出你的邀请哦~";
  videoEl.play();
}

function playEncouragement() {
  currentStep = 2;
  failCount++;
  videoEl.src = videos.encourage;
  videoEl.play();
  const messages = [
    "小兔子没听清，再试试说：“一起玩”吧~",
    "别灰心，小兔子还在等你~",
    "已经很棒了，再来一次一定成功！",
    "坚持就是胜利，加油宝贝~",
    "再试试这次一定能通关！"
  ];
  responseEl.textContent = messages[Math.min(failCount - 1, messages.length - 1)];
  retryBtn.style.display = "inline-block";
}

function playSuccess() {
  currentStep = 3;
  successVideo.src = videos.success;
  successSection.style.display = "flex";
  successVideo.play();
  launchConfetti();
}

function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("请使用 Chrome 浏览器进行语音互动");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'zh-CN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  responseEl.textContent = "🎤 请说出：“一起玩”或者“我想玩”";
  retryBtn.style.display = "none";
  recognition.start();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.trim();
    if (/一起玩|我想玩|和我玩|好的/i.test(text)) {
      failCount = 0;
      playSuccess();
    } else {
      playEncouragement();
    }
  };

  recognition.onerror = () => {
    playEncouragement();
  };
}

videoEl.onended = () => {
  if (currentStep === 1) {
    retryBtn.style.display = "inline-block";
    responseEl.textContent = "🗣️ 请点击按钮并说：“一起玩”或“我想玩”";
  }
};

retryBtn.onclick = () => {
  startRecognition();
};

window.onload = playIntro;

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}
