const levels = [
  {
    instruction: "1. Центрируй зверят по горизонтали",
    correctCSS: "justify-content: center;",
    hint: "Подсказка: display: flex; justify-content: center;",
    animalsCount: 3,
  },
  {
    instruction: "2. Выравнивание по низу",
    correctCSS: "align-items: flex-end;",
    hint: "Подсказка: display: flex; align-items: flex-end;",
    animalsCount: 3,
  },
  {
    instruction: "3. Распредели с промежутками",
    correctCSS: "justify-content: space-between;",
    hint: "Подсказка: display: flex; justify-content: space-between;",
    animalsCount: 4,
  },
  {
    instruction: "4. Построй колонку из зверят",
    correctCSS: "flex-direction: column;",
    hint: "Подсказка: display: flex; flex-direction: column;",
    animalsCount: 4,
  },
  {
    instruction: "5. Включи перенос зверят на другую строку",
    correctCSS: "flex-wrap: wrap;",
    hint: "Подсказка: display: flex; flex-wrap: wrap;",
    animalsCount: 15,
  },
];

let currentLevel = 0;
let isPracticeMode = false;

function loadLevel() {
  const level = levels[currentLevel];
  document.getElementById("instruction").innerText = level.instruction;
  document.getElementById("hint").innerText = level.hint;
  document.getElementById("cssInput").value = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("cssInput").disabled = false;
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("practiceLabel").style.display = "none";
  isPracticeMode = false;
  resetPlayground(level.animalsCount);
}

function resetPlayground(count = 3) {
  const box = document.getElementById("playground");
  box.innerHTML = "";
  box.style.cssText = "";
  box.className = "box";
  box.style.display = "flex";

  const animals = ["🐶", "🐱", "🐰"];
  for (let i = 0; i < count; i++) {
    const animalDiv = document.createElement("div");
    animalDiv.className = "animal";
    animalDiv.textContent = animals[i % animals.length];
    box.appendChild(animalDiv);
  }
}

function applyCSS(cssText) {
  const box = document.getElementById("playground");
  box.style.cssText = "display: flex;"; // сброс + flex

  const rules = cssText
    .split(";")
    .map((r) => r.trim())
    .filter((r) => r.includes(":"));

  rules.forEach((rule) => {
    const [prop, value] = rule.split(":").map((s) => s.trim());
    if (prop && value) {
      box.style.setProperty(prop, value);
    }
  });
}
function checkAnswer() {
  const input = document
    .getElementById("cssInput")
    .value.trim()
    .replace(/\s+/g, " ");

  applyCSS(input);

  if (isPracticeMode) {
    document.getElementById("feedback").innerText =
      "✅ Свойства применены! Ты в практическом режиме.";
    return;
  }

  const correct = levels[currentLevel]?.correctCSS?.trim();
  const hasDisplayFlex = input.includes("display: flex");
  const isCorrect = hasDisplayFlex && input.includes(correct);

  if (isCorrect) {
    document.getElementById("feedback").innerText = "✅ Правильно!";
    document.getElementById("cssInput").disabled = true;
    document.getElementById("nextBtn").style.display = "inline-block";
    localStorage.setItem("currentLevel", currentLevel);
  } else {
    document.getElementById("feedback").innerText =
      "❌ Неправильно. Попробуй снова!";
  }
}

function nextLevel() {
  currentLevel++;
  localStorage.setItem("currentLevel", currentLevel);

  if (currentLevel < levels.length) {
    loadLevel();
  } else {
    activatePracticeMode();
  }
}
function activatePracticeMode() {
  isPracticeMode = true;
  document.getElementById("instruction").innerText =
    "🎉 Молодец! Ты прошёл все уровни!";
  document.getElementById("hint").innerText =
    "Теперь ты можешь тренироваться сам — пиши любые CSS свойства!";
  document.getElementById("cssInput").disabled = false;
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("practiceLabel").style.display = "block";
  document.getElementById("feedback").innerText = "👨‍🏫 Практика включена!";
  document.getElementById("cssInput").value = "display: flex;";
  resetPlayground(12); // больше зверят
  applyCSS("display: flex;");
  localStorage.setItem("currentLevel", levels.length);
}

function resetProgress() {
  localStorage.removeItem("currentLevel");
  currentLevel = 0;
  loadLevel();
}

window.onload = function () {
  const savedLevel = parseInt(localStorage.getItem("currentLevel"));
  if (!isNaN(savedLevel)) {
    if (savedLevel >= levels.length) {
      activatePracticeMode();
      return;
    } else {
      currentLevel = savedLevel;
    }
  }
  loadLevel();
};
