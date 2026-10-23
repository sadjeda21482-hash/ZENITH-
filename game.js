// ==========================================
// ZENITH MEDICAL BATTLE
// Medical Quiz + Supabase Leaderboard
// ==========================================

const SUPABASE_URL = "https://hjzrlmqwfbgamvqpttfs.supabase.co";
const SUPABASE_KEY = "sb_publishable_ofgWlO9nXnY1Bwil9je2hw_Bilxbahe";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (id) => document.getElementById(id);

// DOM
const homeScreen = $("homeScreen");
const gameScreen = $("gameScreen");
const resultScreen = $("resultScreen");

const playerNameInput = $("playerName");
const startButton = $("startButton");
const replayButton = $("replayButton");
const homeButton = $("homeButton");
const soundToggle = $("soundToggle");

const questionNumber = $("questionNumber");
const timerDisplay = $("timer");
const scoreDisplay = $("score");
const comboDisplay = $("combo");
const progressBar = $("progressBar");
const specialtyDisplay = $("specialty");
const organIcon = $("organIcon");
const questionText = $("questionText");
const answersContainer = $("answers");
const feedback = $("feedback");

const finalScore = $("finalScore");
const correctCount = $("correctCount");
const bestComboDisplay = $("bestCombo");
const accuracyDisplay = $("accuracy");
const saveStatus = $("saveStatus");

const QUESTION_TIME = 30;

let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let combo = 0;
let bestCombo = 0;
let timeLeft = QUESTION_TIME;
let timerInterval = null;
let nextQuestionTimeout = null;
let locked = false;
let soundEnabled = true;
let audioContext = null;
let playerName = "ZENITH PLAYER";

const questions = [
  {
    specialty: "CARDIOLOGY",
    icon: "❤️",
    type: "CLINICAL CASE",
    question: "Un patient de 58 ans présente une douleur thoracique intense irradiant vers le bras gauche, accompagnée de sueurs froides. Quel diagnostic faut-il suspecter en priorité ?",
    answers: [
      "Crise d'asthme",
      "Infarctus du myocarde",
      "Gastro-entérite",
      "Migraine"
    ],
    correct: 1,
    explanation: "Cette association peut évoquer un syndrome coronarien aigu et nécessite une évaluation médicale urgente."
  },
  {
    specialty: "NEUROLOGY",
    icon: "🧠",
    type: "EMERGENCY CASE",
    question: "Une patiente présente soudainement une faiblesse du bras droit et des difficultés à parler. Quelle est la priorité ?",
    answers: [
      "Attendre une heure",
      "Lui donner un repas",
      "Déclencher immédiatement la prise en charge urgente pour suspicion d'AVC",
      "La laisser dormir"
    ],
    correct: 2,
    explanation: "Un déficit neurologique brutal peut signaler un AVC. Chaque minute compte : les secours doivent être alertés immédiatement."
  },
  {
    specialty: "PNEUMOLOGY",
    icon: "🫁",
    type: "RESPIRATORY MISSION",
    question: "Quel système est principalement concerné par une crise d'asthme ?",
    answers: [
      "Le système urinaire",
      "Les bronches et les poumons",
      "Le pancréas",
      "La rate"
    ],
    correct: 1,
    explanation: "L'asthme entraîne une inflammation et un rétrécissement des voies respiratoires, notamment des bronches."
  },
  {
    specialty: "ENDOCRINOLOGY",
    icon: "🩸",
    type: "METABOLIC MISSION",
    question: "Un patient diabétique devient confus, transpire et tremble. Quelle cause faut-il envisager rapidement ?",
    answers: [
      "Une hypoglycémie",
      "Une fracture",
      "Une otite",
      "Une myopie"
    ],
    correct: 0,
    explanation: "Ces symptômes peuvent signaler une hypoglycémie. Il faut évaluer immédiatement la glycémie et suivre le protocole adapté."
  },
  {
    specialty: "INFECTIOUS DISEASES",
    icon: "🦠",
    type: "DIAGNOSTIC MISSION",
    question: "Un patient présente de la fièvre, une toux et une fatigue importante. Quelle est la meilleure première approche ?",
    answers: [
      "Prescrire automatiquement des antibiotiques",
      "Ignorer les symptômes",
      "Évaluer les signes cliniques, les risques et les causes possibles",
      "Conclure immédiatement à une infection bactérienne"
    ],
    correct: 2,
    explanation: "Ces symptômes ont plusieurs causes possibles. L'évaluation clinique guide les examens et le traitement."
  },
  {
    specialty: "ANATOMY LAB",
    icon: "🧬",
    type: "ANATOMY CHALLENGE",
    question: "Quel organe pompe le sang dans la circulation sanguine ?",
    answers: [
      "Le foie",
      "Le cœur",
      "L'estomac",
      "La vessie"
    ],
    correct: 1,
    explanation: "Le cœur propulse le sang vers les poumons et les autres organes."
  },
  {
    specialty: "RENAL MEDICINE",
    icon: "🫘",
    type: "ORGAN MISSION",
    question: "Quelle est l'une des fonctions principales des reins ?",
    answers: [
      "Produire la bile",
      "Pomper le sang",
      "Filtrer le sang et réguler l'équilibre hydrique et électrolytique",
      "Digérer les aliments"
    ],
    correct: 2,
    explanation: "Les reins éliminent certains déchets dans l'urine et participent à la régulation de l'eau et des électrolytes."
  },
  {
    specialty: "FIRST AID",
    icon: "🚑",
    type: "EMERGENCY PROTOCOL",
    question: "Une personne s'effondre, ne répond pas et ne respire pas normalement. Quelle action est prioritaire ?",
    answers: [
      "Lui donner de l'eau",
      "La mettre debout",
      "Appeler les secours, demander un défibrillateur et commencer la RCP selon sa formation",
      "Attendre sans agir"
    ],
    correct: 2,
    explanation: "Il faut déclencher immédiatement les secours, obtenir un défibrillateur et commencer la réanimation cardiopulmonaire."
  },
  {
    specialty: "PHARMACOLOGY",
    icon: "💊",
    type: "PHARMACOLOGY MISSION",
    question: "Avant d'administrer un médicament, quelle vérification est essentielle ?",
    answers: [
      "La couleur de la boîte uniquement",
      "L'identité du patient, le médicament, la dose, la voie et le moment d'administration",
      "Le prix du médicament",
      "L'avis d'un autre patient"
    ],
    correct: 1,
    explanation: "Les vérifications de sécurité et la recherche d'allergies contribuent à prévenir les erreurs médicamenteuses."
  },
  {
    specialty: "FINAL BOSS",
    icon: "👾",
    type: "FINAL BOSS — CLINICAL REASONING",
    question: "Un patient présente une douleur thoracique persistante, un essoufflement et une pâleur soudaine. Quelle est la meilleure décision ?",
    answers: [
      "Le faire marcher pour tester son endurance",
      "Attendre la fin du questionnaire",
      "Activer immédiatement les secours et organiser une évaluation urgente",
      "Lui donner un médicament au hasard"
    ],
    correct: 2,
    explanation: "Ces signes peuvent signaler une urgence vitale. Il faut activer immédiatement les secours sans retarder l'évaluation."
  }
];

// SOUND
function playTone(frequency = 440, duration = 0.12, type = "sine") {
  if (!soundEnabled) return;

  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.06, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn("Audio indisponible :", error);
  }
}

function playCorrectSound() {
  playTone(660, 0.1);
  setTimeout(() => playTone(880, 0.16), 100);
}

function playWrongSound() {
  playTone(180, 0.22, "triangle");
}

// SCREEN MANAGEMENT
function showScreen(screen) {
  [homeScreen, gameScreen, resultScreen].forEach((item) => {
    if (item) item.classList.remove("active");
  });

  if (screen) screen.classList.add("active");
}

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

// START GAME
function startGame() {
  clearInterval(timerInterval);
  clearTimeout(nextQuestionTimeout);

  playerName = playerNameInput?.value.trim() || "ZENITH PLAYER";
  playerName = playerName.slice(0, 24);

  currentQuestion = 0;
  score = 0;
  correctAnswers = 0;
  combo = 0;
  bestCombo = 0;
  locked = false;

  showScreen(gameScreen);
  playTone(520, 0.1);
  renderQuestion();
}

// RENDER QUESTION
function renderQuestion() {
  clearInterval(timerInterval);
  locked = false;
  timeLeft = QUESTION_TIME;

  const q = questions[currentQuestion];

  if (!q) {
    endGame();
    return;
  }

  if (questionNumber) {
    questionNumber.textContent = `QUESTION ${currentQuestion + 1} / ${questions.length}`;
  }

  if (timerDisplay) timerDisplay.textContent = timeLeft;
  if (scoreDisplay) scoreDisplay.textContent = score;
  if (comboDisplay) comboDisplay.textContent = `x${combo}`;
  if (specialtyDisplay) specialtyDisplay.textContent = q.specialty;
  if (organIcon) organIcon.textContent = q.icon;
  if (questionText) questionText.textContent = q.question;

  if (feedback) {
    feedback.textContent = q.type;
    feedback.className = "feedback";
  }

  if (progressBar) {
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  }

  if (answersContainer) {
    answersContainer.replaceChildren();

    const randomizedAnswers = shuffleArray(
      q.answers.map((answer, originalIndex) => ({ answer, originalIndex }))
    );

    randomizedAnswers.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-btn";
      button.dataset.correct = String(item.originalIndex === q.correct);

      const letter = document.createElement("span");
      letter.className = "answer-letter";
      letter.textContent = ["A", "B", "C", "D"][index];

      const text = document.createElement("span");
      text.className = "answer-text";
      text.textContent = item.answer;

      button.append(letter, text);
      button.addEventListener("click", () => chooseAnswer(button, item.originalIndex));
      answersContainer.appendChild(button);
    });
  }

  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (locked) return;

  timeLeft = Math.max(0, timeLeft - 1);

  if (timerDisplay) timerDisplay.textContent = timeLeft;

  if (timeLeft <= 5 && timeLeft > 0) {
    playTone(300, 0.05, "square");
  }

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    chooseAnswer(null, -1);
  }
}

// ANSWER LOGIC
function chooseAnswer(button, selectedIndex) {
  if (locked) return;

  locked = true;
  clearInterval(timerInterval);

  const q = questions[currentQuestion];
  if (!q) return;

  const buttons = answersContainer?.querySelectorAll("button") || [];

  buttons.forEach((item) => {
    item.disabled = true;

    if (item.dataset.correct === "true") {
      item.classList.add("correct");
    }
  });

  if (selectedIndex === q.correct) {
    correctAnswers++;
    combo++;
    bestCombo = Math.max(bestCombo, combo);

    const speedBonus = Math.max(0, timeLeft) * 2;
    const comboBonus = combo >= 3 ? 50 : 0;
    const earned = 100 + speedBonus + comboBonus;

    score += earned;

    if (button) button.classList.add("correct");

    if (feedback) {
      feedback.textContent = `✓ EXCELLENT ! +${earned} XP — ${q.explanation}`;
      feedback.className = "feedback success";
    }

    playCorrectSound();
  } else {
    combo = 0;

    if (button) button.classList.add("wrong");

    if (feedback) {
      const prefix = selectedIndex === -1 ? "⏱ TEMPS ÉCOULÉ !" : "✕ INCORRECT.";
      feedback.textContent = `${prefix} ${q.explanation}`;
      feedback.className = "feedback error";
    }

    playWrongSound();
  }

  if (scoreDisplay) scoreDisplay.textContent = score;
  if (comboDisplay) comboDisplay.textContent = `x${combo}`;

  if (progressBar) {
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  }

  nextQuestionTimeout = setTimeout(() => {
    currentQuestion++;

    if (currentQuestion < questions.length) {
      renderQuestion();
    } else {
      endGame();
    }
  }, 2600);
}

// END GAME
async function endGame() {
  clearInterval(timerInterval);
  clearTimeout(nextQuestionTimeout);
  showScreen(resultScreen);

  const accuracy = Math.round((correctAnswers / questions.length) * 100);

  if (finalScore) finalScore.textContent = score;
  if (correctCount) correctCount.textContent = `${correctAnswers} / ${questions.length}`;
  if (bestComboDisplay) bestComboDisplay.textContent = bestCombo;
  if (accuracyDisplay) accuracyDisplay.textContent = `${accuracy}%`;

  const resultTitle = $("resultTitle");
  if (resultTitle) {
    resultTitle.textContent =
      correctAnswers === questions.length ? "PERFECT MEDICAL LEGEND!" :
      correctAnswers >= 7 ? "ELITE MEDICAL AGENT" :
      correctAnswers >= 4 ? "RISING MEDICAL HERO" :
      "MISSION COMPLETE";
  }

  const resultIcon = $("resultIcon");
  if (resultIcon) {
    resultIcon.textContent =
      correctAnswers === questions.length ? "🏆" :
      correctAnswers >= 7 ? "🧬" :
      correctAnswers >= 4 ? "🩺" : "⚡";
  }

  if (saveStatus) saveStatus.textContent = "⏳ Enregistrement du score...";

  await saveScore();
  playTone(740, 0.25);
}

// SUPABASE SAVE
async function saveScore() {
  try {
    const { error } = await db
      .from("zenith_scores")
      .insert([{ player_name: playerName, score }]);

    if (error) throw error;

    if (saveStatus) {
      saveStatus.textContent = "☁️ Score enregistré avec succès !";
    }
  } catch (error) {
    console.error("Erreur Supabase :", error);

    if (saveStatus) {
      saveStatus.textContent =
        "⚠️ Score non enregistré. Vérifie la connexion et les permissions Supabase.";
    }
  }
}

// LEADERBOARD
function createLeaderboardButton() {
  if ($("leaderboardButton") || !homeScreen) return;

  const button = document.createElement("button");
  button.id = "leaderboardButton";
  button.type = "button";
  button.className = "leaderboard-button";
  button.textContent = "🏆 LEADERBOARD";
  button.addEventListener("click", showLeaderboard);

  homeScreen.appendChild(button);
}

async function showLeaderboard() {
  const overlay = document.createElement("div");
  overlay.className = "leaderboard-overlay";

  const modal = document.createElement("div");
  modal.className = "leaderboard-modal";

  const title = document.createElement("h2");
  title.textContent = "🏆 ZENITH TOP AGENTS";

  const close = document.createElement("button");
  close.type = "button";
  close.className = "leaderboard-close";
  close.textContent = "✕";
  close.setAttribute("aria-label", "Fermer le classement");
  close.addEventListener("click", () => overlay.remove());

  const list = document.createElement("div");
  list.className = "leaderboard-list";
  list.textContent = "Chargement des meilleurs scores...";

  modal.append(close, title, list);
  overlay.appendChild(modal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);

  try {
    const { data, error } = await db
      .from("zenith_scores")
      .select("player_name,score,created_at")
      .order("score", { ascending: false })
      .limit(10);

    if (error) throw error;

    list.replaceChildren();

    if (!data || data.length === 0) {
      list.textContent = "Aucun score pour le moment. Sois le premier !";
      return;
    }

    data.forEach((row, index) => {
      const item = document.createElement("div");
      item.className = "leaderboard-row";

      const rank = document.createElement("span");
      rank.className = "leaderboard-rank";
      rank.textContent = ["🥇", "🥈", "🥉"][index] || `#${index + 1}`;

      const name = document.createElement("span");
      name.className = "leaderboard-name";
      name.textContent = row.player_name || "ZENITH PLAYER";

      const points = document.createElement("strong");
      points.className = "leaderboard-score";
      points.textContent = `${row.score} XP`;

      item.append(rank, name, points);
      list.appendChild(item);
    });
  } catch (error) {
    console.error("Erreur leaderboard :", error);
    list.textContent =
      "Impossible de charger le classement. Vérifie les permissions SELECT dans Supabase.";
  }
}

// BUTTON EVENTS
startButton?.addEventListener("click", startGame);

playerNameInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") startGame();
});

replayButton?.addEventListener("click", startGame);

homeButton?.addEventListener("click", () => {
  clearInterval(timerInterval);
  clearTimeout(nextQuestionTimeout);
  showScreen(homeScreen);
});

soundToggle?.addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  if (soundToggle.tagName === "BUTTON") {
    soundToggle.textContent = soundEnabled ? "🔊 SOUND ON" : "🔇 SOUND OFF";
  } else {
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.title = soundEnabled ? "Désactiver le son" : "Activer le son";
  }

  if (soundEnabled) playTone(600, 0.12);
});

// INITIALIZATION
createLeaderboardButton();
showScreen(homeScreen);
