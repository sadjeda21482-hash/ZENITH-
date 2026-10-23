// ==========================================
// ZENITH MEDICAL BATTLE
// Compatible with index.html + Supabase
// ==========================================

const SUPABASE_URL = "https://hjzrlmqwfbgamvqpttfs.supabase.co";
const SUPABASE_KEY = "sb_publishable_ofgWlO9nXnY1Bwil9je2hw_Bilxbahe";

const db = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const $ = (id) => document.getElementById(id);

const homeScreen = $("home-screen");
const gameScreen = $("game-screen");
const resultsScreen = $("results-screen");

const startForm = $("start-form");
const playerNameInput = $("player-name");
const currentPlayer = $("current-player");

const leaderboardButton = $("leaderboard-button");
const resultsLeaderboardButton = $("results-leaderboard-button");
const closeLeaderboardButton = $("close-leaderboard");
const refreshLeaderboardButton = $("refresh-leaderboard");
const leaderboardModal = $("leaderboard-modal");
const leaderboardList = $("leaderboard-list");

const nextButton = $("next-button");
const replayButton = $("replay-button");

const questionCategory = $("question-category");
const questionCounter = $("question-counter");
const questionText = $("question-text");
const questionTag = $("question-tag");
const difficultyTag = $("difficulty-tag");
const answersGrid = $("answers-grid");
const feedbackBox = $("feedback-box");
const feedbackIcon = $("feedback-icon");
const feedbackTitle = $("feedback-title");
const feedbackText = $("feedback-text");

const progressFill = $("progress-fill");
const currentScore = $("current-score");
const correctCount = $("correct-count");
const comboCount = $("combo-count");
const timerNumber = $("timer-number");
const timerFill = $("timer-fill");

const finalScore = $("final-score");
const finalCorrect = $("final-correct");
const finalAccuracy = $("final-accuracy");
const finalBestCombo = $("final-best-combo");
const resultTitle = $("result-title");
const resultSubtitle = $("result-subtitle");
const saveStatus = $("save-status");

const QUESTION_TIME = 20;

const questions = [
  {
    category: "CARDIOLOGIE",
    tag: "CAS CLINIQUE",
    difficulty: "NIVEAU I",
    question: "Quel organe propulse le sang dans la circulation sanguine ?",
    answers: ["Le foie", "Le cœur", "L'estomac", "La vessie"],
    correct: 1,
    explanation: "Le cœur propulse le sang vers les poumons et les autres organes."
  },
  {
    category: "NEUROLOGIE",
    tag: "URGENCE",
    difficulty: "NIVEAU II",
    question: "Une personne présente soudainement une faiblesse d'un côté du corps et des difficultés à parler. Que faut-il suspecter ?",
    answers: ["Une migraine banale", "Une indigestion", "Un AVC", "Une entorse"],
    correct: 2,
    explanation: "Ces signes peuvent évoquer un AVC. Il faut appeler immédiatement les secours."
  },
  {
    category: "PNEUMOLOGIE",
    tag: "MISSION RESPIRATOIRE",
    difficulty: "NIVEAU I",
    question: "Quel organe est principalement responsable des échanges gazeux ?",
    answers: ["Les poumons", "Les reins", "La rate", "Le pancréas"],
    correct: 0,
    explanation: "Les échanges d'oxygène et de dioxyde de carbone se font principalement dans les alvéoles pulmonaires."
  },
  {
    category: "ENDOCRINOLOGIE",
    tag: "MISSION MÉTABOLIQUE",
    difficulty: "NIVEAU II",
    question: "Laquelle de ces hormones contribue à diminuer la glycémie ?",
    answers: ["L'adrénaline", "Le glucagon", "L'insuline", "La thyroxine"],
    correct: 2,
    explanation: "L'insuline aide les cellules à capter le glucose et contribue à diminuer la glycémie."
  },
  {
    category: "ANATOMIE",
    tag: "TEST DE CONNAISSANCES",
    difficulty: "NIVEAU I",
    question: "Combien de cavités possède le cœur humain normal ?",
    answers: ["Deux", "Trois", "Quatre", "Cinq"],
    correct: 2,
    explanation: "Le cœur possède deux oreillettes et deux ventricules."
  },
  {
    category: "NÉPHROLOGIE",
    tag: "MISSION DES ORGANES",
    difficulty: "NIVEAU II",
    question: "Quelle est une fonction principale des reins ?",
    answers: [
      "Produire la bile",
      "Filtrer le sang et réguler l'équilibre hydrique",
      "Pomper le sang",
      "Digérer les protéines"
    ],
    correct: 1,
    explanation: "Les reins filtrent le sang et participent à la régulation de l'eau et des électrolytes."
  },
  {
    category: "INFECTIOLOGIE",
    tag: "MISSION DIAGNOSTIQUE",
    difficulty: "NIVEAU II",
    question: "Pourquoi une fièvre ne suffit-elle pas à identifier avec certitude la cause d'une infection ?",
    answers: [
      "La fièvre n'a aucune importance",
      "Elle indique toujours une infection bactérienne",
      "Elle peut avoir différentes causes",
      "Elle signifie toujours une urgence vitale"
    ],
    correct: 2,
    explanation: "La fièvre peut avoir plusieurs causes. L'évaluation clinique permet d'orienter le diagnostic."
  },
  {
    category: "PHARMACOLOGIE",
    tag: "SÉCURITÉ",
    difficulty: "NIVEAU II",
    question: "Avant d'administrer un médicament, que faut-il vérifier ?",
    answers: [
      "La couleur de la boîte uniquement",
      "L'identité, le médicament, la dose et la voie",
      "Le prix du médicament",
      "La préférence d'un autre patient"
    ],
    correct: 1,
    explanation: "Ces vérifications contribuent à prévenir les erreurs médicamenteuses."
  },
  {
    category: "PREMIERS SECOURS",
    tag: "PROTOCOLE D'URGENCE",
    difficulty: "NIVEAU III",
    question: "Une personne est inconsciente et ne respire pas normalement. Quelle est la priorité ?",
    answers: [
      "Lui donner à boire",
      "La laisser seule",
      "Appeler les secours, demander un défibrillateur et commencer la RCP selon sa formation",
      "Attendre quelques minutes"
    ],
    correct: 2,
    explanation: "Il faut alerter les secours et commencer rapidement les gestes de réanimation appropriés."
  },
  {
    category: "FINAL BOSS",
    tag: "RAISONNEMENT CLINIQUE",
    difficulty: "NIVEAU III",
    question: "Une personne présente une douleur thoracique persistante et un essoufflement soudain. Quelle est la meilleure décision ?",
    answers: [
      "Lui faire faire de l'exercice",
      "Attendre la fin du jeu",
      "Contacter immédiatement les secours",
      "Lui donner un médicament au hasard"
    ],
    correct: 2,
    explanation: "Ces symptômes peuvent signaler une urgence. Il faut contacter immédiatement les secours."
  }
];

let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let combo = 0;
let bestCombo = 0;
let timeLeft = QUESTION_TIME;
let timerInterval = null;
let locked = false;
let playerName = "ZENITH PLAYER";
let audioContext = null;

function showScreen(screenToShow) {
  [homeScreen, gameScreen, resultsScreen].forEach((screen) => {
    if (screen) screen.classList.toggle("active", screen === screenToShow);
  });
}

function playTone(frequency = 440, duration = 0.12) {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // Le jeu continue même si le son n'est pas disponible.
  }
}

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function startGame(event) {
  if (event) event.preventDefault();

  clearInterval(timerInterval);

  playerName = (playerNameInput?.value || "").trim().slice(0, 24);
  if (!playerName) {
    playerNameInput?.focus();
    playerNameInput?.setCustomValidity("Entre ton nom pour commencer.");
    playerNameInput?.reportValidity();
    return;
  }

  playerNameInput.setCustomValidity("");
  currentQuestionIndex = 0;
  score = 0;
  correctAnswers = 0;
  combo = 0;
  bestCombo = 0;
  locked = false;

  if (currentPlayer) currentPlayer.textContent = playerName;

  showScreen(gameScreen);
  playTone(520);
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerInterval);
  locked = false;

  const question = questions[currentQuestionIndex];
  if (!question) {
    endGame();
    return;
  }

  timeLeft = QUESTION_TIME;

  if (questionCategory) questionCategory.textContent = question.category;
  if (questionCounter) {
    questionCounter.textContent =
      `QUESTION ${String(currentQuestionIndex + 1).padStart(2, "0")} / ${questions.length}`;
  }
  if (questionText) questionText.textContent = question.question;
  if (questionTag) questionTag.textContent = question.tag;
  if (difficultyTag) difficultyTag.textContent = question.difficulty;

  if (timerNumber) {
    timerNumber.replaceChildren();
    timerNumber.append(document.createTextNode(String(timeLeft)));
    const seconds = document.createElement("span");
    seconds.textContent = "s";
    timerNumber.appendChild(seconds);
  }

  if (currentScore) currentScore.textContent = String(score).padStart(4, "0");
  if (correctCount) correctCount.textContent = correctAnswers;
  if (comboCount) comboCount.textContent = `×${combo}`;

  if (progressFill) {
    progressFill.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
  }

  if (timerFill) timerFill.style.width = "100%";

  if (feedbackBox) feedbackBox.className = "feedback-box";
  if (feedbackIcon) feedbackIcon.textContent = "✦";
  if (feedbackTitle) feedbackTitle.textContent = "Analyse en cours";
  if (feedbackText) feedbackText.textContent = "Sélectionne une réponse pour continuer.";

  if (nextButton) nextButton.disabled = true;

  if (answersGrid) {
    answersGrid.replaceChildren();

    const answers = shuffle(
      question.answers.map((answer, originalIndex) => ({ answer, originalIndex }))
    );

    answers.forEach(({ answer, originalIndex }, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.correct = String(originalIndex === question.correct);

      const letter = document.createElement("span");
      letter.className = "answer-letter";
      letter.textContent = ["A", "B", "C", "D"][index];

      const text = document.createElement("span");
      text.textContent = answer;

      button.append(letter, text);
      button.addEventListener("click", () => chooseAnswer(originalIndex, button));
      answersGrid.appendChild(button);
    });
  }

  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (locked) return;

  timeLeft = Math.max(0, timeLeft - 1);

  if (timerNumber) {
    timerNumber.replaceChildren();
    timerNumber.append(document.createTextNode(String(timeLeft)));
    const seconds = document.createElement("span");
    seconds.textContent = "s";
    timerNumber.appendChild(seconds);
  }

  if (timerFill) {
    timerFill.style.width = `${(timeLeft / QUESTION_TIME) * 100}%`;
  }

  if (timeLeft <= 5 && timeLeft > 0) playTone(300, 0.05);

  if (timeLeft === 0) chooseAnswer(-1, null);
}

function chooseAnswer(selectedIndex, selectedButton) {
  if (locked) return;
  locked = true;
  clearInterval(timerInterval);

  const question = questions[currentQuestionIndex];
  if (!question) return;

  const buttons = answersGrid?.querySelectorAll("button") || [];
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.dataset.correct === "true") button.classList.add("correct");
  });

  if (selectedIndex === question.correct) {
    correctAnswers++;
    combo++;
    bestCombo = Math.max(bestCombo, combo);

    const earned = 100 + timeLeft * 2 + (combo >= 3 ? 50 : 0);
    score += earned;

    selectedButton?.classList.add("correct");
    if (feedbackBox) feedbackBox.classList.add("success");
    if (feedbackIcon) feedbackIcon.textContent = "✓";
    if (feedbackTitle) feedbackTitle.textContent = `EXCELLENT ! +${earned} XP`;
    playTone(720, 0.15);
  } else {
    combo = 0;
    selectedButton?.classList.add("wrong");
    if (feedbackBox) feedbackBox.classList.add("error");
    if (feedbackIcon) feedbackIcon.textContent = selectedIndex === -1 ? "⏱" : "✕";
    if (feedbackTitle) {
      feedbackTitle.textContent = selectedIndex === -1 ? "TEMPS ÉCOULÉ !" : "INCORRECT";
    }
    playTone(180, 0.2);
  }

  if (feedbackText) feedbackText.textContent = question.explanation;
  if (currentScore) currentScore.textContent = String(score).padStart(4, "0");
  if (correctCount) correctCount.textContent = correctAnswers;
  if (comboCount) comboCount.textContent = `×${combo}`;
  if (progressFill) {
    progressFill.style.width =
      `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  }

  if (nextButton) nextButton.disabled = false;
}

function nextQuestion() {
  if (!locked) return;

  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    endGame();
  } else {
    renderQuestion();
  }
}

async function endGame() {
  clearInterval(timerInterval);
  showScreen(resultsScreen);

  const accuracy = Math.round((correctAnswers / questions.length) * 100);

  if (finalScore) finalScore.textContent = String(score);
  if (finalCorrect) finalCorrect.textContent = `${correctAnswers}/${questions.length}`;
  if (finalAccuracy) finalAccuracy.textContent = `${accuracy}%`;
  if (finalBestCombo) finalBestCombo.textContent = `×${bestCombo}`;

  if (resultTitle) {
    resultTitle.textContent =
      correctAnswers === questions.length ? "EXCELLENT TRAVAIL !" :
      correctAnswers >= 7 ? "ÉLITE MÉDICALE" :
      correctAnswers >= 4 ? "HÉROS MÉDICAL EN DEVENIR" :
      "MISSION TERMINÉE";
  }

  if (resultSubtitle) {
    resultSubtitle.textContent = `Tu as obtenu ${correctAnswers} bonne(s) réponse(s) sur ${questions.length}.`;
  }

  if (saveStatus) saveStatus.textContent = "Enregistrement du score...";
  await saveScore();
  playTone(740, 0.25);
}

async function saveScore() {
  if (!db) {
    if (saveStatus) saveStatus.textContent = "Supabase n'est pas disponible. Le score n'a pas été enregistré.";
    return;
  }

  try {
    const { error } = await db
      .from("zenith_scores")
      .insert([{ player_name: playerName, score }]);

    if (error) throw error;
    if (saveStatus) saveStatus.textContent = "☁️ Score enregistré avec succès !";
  } catch (error) {
    console.error("Erreur Supabase :", error);
    if (saveStatus) {
      saveStatus.textContent = "Score non enregistré. Vérifie les permissions Supabase.";
    }
  }
}

function openLeaderboard() {
  if (!leaderboardModal) return;
  leaderboardModal.classList.add("open");
  leaderboardModal.setAttribute("aria-hidden", "false");
  loadLeaderboard();
}

function closeLeaderboard() {
  if (!leaderboardModal) return;
  leaderboardModal.classList.remove("open");
  leaderboardModal.setAttribute("aria-hidden", "true");
}

async function loadLeaderboard() {
  if (!leaderboardList) return;
  leaderboardList.textContent = "Chargement du classement...";

  if (!db) {
    leaderboardList.textContent = "Supabase n'est pas disponible.";
    return;
  }

  try {
    const { data, error } = await db
      .from("zenith_scores")
      .select("player_name, score, created_at")
      .order("score", { ascending: false })
      .limit(10);

    if (error) throw error;

    leaderboardList.replaceChildren();

    if (!data?.length) {
      leaderboardList.textContent = "Aucun score pour le moment. Sois le premier !";
      return;
    }

    data.forEach((row, index) => {
      const item = document.createElement("div");
      item.className = "leaderboard-row";

      const rank = document.createElement("span");
      rank.textContent = ["🥇", "🥈", "🥉"][index] || `#${index + 1}`;

      const name = document.createElement("span");
      name.textContent = row.player_name || "ZENITH PLAYER";

      const points = document.createElement("strong");
      points.textContent = `${row.score} XP`;

      item.append(rank, name, points);
      leaderboardList.appendChild(item);
    });
  } catch (error) {
    console.error("Erreur leaderboard :", error);
    leaderboardList.textContent =
      "Impossible de charger le classement. Vérifie les permissions SELECT dans Supabase.";
  }
}

startForm?.addEventListener("submit", startGame);
nextButton?.addEventListener("click", nextQuestion);
replayButton?.addEventListener("click", startGame);

leaderboardButton?.addEventListener("click", openLeaderboard);
resultsLeaderboardButton?.addEventListener("click", openLeaderboard);
closeLeaderboardButton?.addEventListener("click", closeLeaderboard);
refreshLeaderboardButton?.addEventListener("click", loadLeaderboard);

leaderboardModal?.addEventListener("click", (event) => {
  if (event.target === leaderboardModal) closeLeaderboard();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLeaderboard();
});

showScreen(homeScreen);
