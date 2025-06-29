const levels = [
  {
    instruction: "1. Центрируй зверят по горизонтали",
    correctCSS: "justify-content: center;",
    hint: "Подсказка: display: flex; justify-content: center;",
  },
  {
    instruction: "2. Выравнивание по низу",
    correctCSS: "align-items: flex-end;",
    hint: "Подсказка: display: flex; align-items: flex-end;",
  },
  {
    instruction: "3. Распредели с промежутками",
    correctCSS: "justify-content: space-between;",
    hint: "Подсказка: display: flex; justify-content: space-between;",
  },
  {
    instruction: "4. Построй колонку из зверят",
    correctCSS: "flex-direction: column;",
    hint: "Подсказка: display: flex; flex-direction: column;",
  },
  {
    instruction: "5. Добавь отступы между зверятами",
    correctCSS: "gap: 10px;",
    hint: "Подсказка: display: flex; gap: 10px;",
  },
  {
    instruction: "6. Включи перенос зверят на другую строку",
    correctCSS: "flex-wrap: wrap;",
    hint: "Подсказка: display: flex; flex-wrap: wrap;",
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
  resetPlayground();
}

function resetPlayground() {
  const box = document.getElementById("playground");
  box.style.cssText = "";
  box.className = "box";
  box.style.display = "flex";
}

function applyCSS(cssText) {
  const box = document.getElementById("playground");
  const styleProps = {};

  const rules = cssText
    .split(";")
    .map((r) => r.trim())
    .filter((r) => r.includes(":"));

  rules.forEach((rule) => {
    let [prop, value] = rule.split(":").map((p) => p.trim());
    if (prop && value) {
      styleProps[prop] = value;
    }
  });

  if (isPracticeMode) {
    Object.entries(styleProps).forEach(([prop, value]) => {
      box.style[prop] = value;
    });
    if (!styleProps["display"] || styleProps["display"] !== "flex") {
      box.style.display = "flex";
    }
  } else {
    if (styleProps["display"] === "flex") {
      Object.entries(styleProps).forEach(([prop, value]) => {
        box.style[prop] = value;
      });
    } else {
      box.style.cssText = "display: flex;";
    }
  }
}

function checkAnswer() {
  const input = document
    .getElementById("cssInput")
    .value.trim()
    .replace(/\s+/g, " ");
  const correct = levels[currentLevel].correctCSS.trim();
  const hasDisplayFlex = input.includes("display: flex");
  const isCorrect = hasDisplayFlex && input.includes(correct);

  applyCSS(input);

  if (isCorrect) {
    document.getElementById("feedback").innerText = "✅ Правильно!";
    document.getElementById("cssInput").disabled = true;
    document.getElementById("nextBtn").style.display = "inline-block";
    localStorage.setItem("currentLevel", currentLevel); // Сохраняем уровень
  } else {
    document.getElementById("feedback").innerText =
      "❌ Неправильно. Попробуй снова!";
  }
}

function nextLevel() {
  currentLevel++;
  localStorage.setItem("currentLevel", currentLevel); // Сохраняем уровень

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
  applyCSS("display: flex;");
  localStorage.setItem("currentLevel", levels.length); // Помечаем как завершённый
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
