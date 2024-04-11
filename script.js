document.addEventListener("DOMContentLoaded", function () {
    const cards = [
        { word: "apple", translation: "яблоко", example: "I ate an apple." },
        { word: "day", translation: "день", example: "Such a crazy day." },
        { word: "banana", translation: "банан", example: "She likes bananas." },
        { word: "journey", translation: "путешествие", example: "I like journeys" },
        { word: "juice", translation: "сок", example: "She likes orange juice" },
    ];

    const flipCards = document.querySelectorAll(".flip-card");
    const studyMode = document.getElementById("study-mode");
    const examMode = document.getElementById("exam-mode");
    const currentWordDisplay = document.getElementById("current-word");
    const totalWordDisplay = document.getElementById("total-word");
    const wordsProgress = document.getElementById("words-progress");
    const shuffleButton = document.getElementById("shuffle-words");
    const backButton = document.getElementById("back");
    const nextButton = document.getElementById("next");
    const examButton = document.getElementById("exam");
    const timerDisplay = document.getElementById("timer");
    const correctPercentDisplay = document.getElementById("correct-percent");
    const examProgress = document.getElementById("exam-progress");
    const resultsModal = document.querySelector(".results-modal");
    const wordStatsTemplate = document.getElementById("word-stats");

    let currentWordIndex = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let startTime;
    let timerInterval;

    function updateStudyModeUI() {
        const currentWord = cards[currentWordIndex];
        document.querySelector("#card-front h1").textContent = currentWord.word;
        document.querySelector("#card-back h1").textContent = currentWord.translation;
        document.querySelector("#card-back span").textContent = currentWord.example;
        currentWordDisplay.textContent = currentWordIndex + 1;
        totalWordDisplay.textContent = cards.length;
        wordsProgress.value = ((currentWordIndex + 1) / cards.length) * 100;
    }

    function updateExamModeUI() {
        examProgress.value = ((correctAnswers + incorrectAnswers) / cards.length) * 100;
        correctPercentDisplay.textContent = Math.round((correctAnswers / cards.length) * 100) + "%";
    }

    function flipCard() {
        this.classList.toggle("active");
    }

    function showNextCard() {
        if (currentWordIndex < cards.length - 1) {
            currentWordIndex++;
            updateStudyModeUI();
            backButton.disabled = false;
        }
        if (currentWordIndex === cards.length - 1) {
            nextButton.disabled = true;
        }
    }

    function showPreviousCard() {
        if (currentWordIndex > 0) {
            currentWordIndex--;
            updateStudyModeUI();
            nextButton.disabled = false;
        }
        if (currentWordIndex === 0) {
            backButton.disabled = true;
        }
    }

    function shuffleCards() {
        cards.sort(() => Math.random() - 0.5);
        currentWordIndex = 0;
        updateStudyModeUI();
    }

    function startExam() {
        studyMode.classList.add("hidden");
        examMode.classList.remove("hidden");
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        updateExamCards();
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function updateExamCards() {
        const examCardsContainer = document.getElementById("exam-cards");
        examCardsContainer.innerHTML = "";
        for (let i = 0; i < cards.length; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.textContent = cards[i].translation;
            card.addEventListener("click", selectCard);
            examCardsContainer.appendChild(card);
        }
    }

    function selectCard() {
        if (!this.classList.contains("correct")) {
            if (this.textContent === cards[currentWordIndex].word) {
                this.classList.add("correct");
                correctAnswers++;
                if (correctAnswers + incorrectAnswers === cards.length) {
                    clearInterval(timerInterval);
                    resultsModal.classList.remove("hidden");
                    updateExamModeUI();
                }
                setTimeout(() => {
                    this.classList.add("fade-out");
                    this.style.pointerEvents = "none";
                }, 500);
            } else {
                this.classList.add("wrong");
                incorrectAnswers++;
                setTimeout(() => {
                    this.classList.remove("wrong");
                }, 500);
            }
        }
        updateExamModeUI();
    }

    shuffleButton.addEventListener("click", shuffleCards);
    flipCards.forEach((card) => card.addEventListener("click", flipCard));
    backButton.addEventListener("click", showPreviousCard);
    nextButton.addEventListener("click", showNextCard);
    examButton.addEventListener("click", startExam);

    function saveProgress() {
        localStorage.setItem("currentWordIndex", currentWordIndex);
        localStorage.setItem("correctAnswers", correctAnswers);
        localStorage.setItem("incorrectAnswers", incorrectAnswers);
    }

    function loadProgress() {
        currentWordIndex = parseInt(localStorage.getItem("currentWordIndex")) || 0;
        correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
        incorrectAnswers = parseInt(localStorage.getItem("incorrectAnswers")) || 0;
    }

    if (localStorage.getItem("currentWordIndex") !== null) {
        loadProgress();
        updateStudyModeUI();
        updateExamModeUI();
    }

    window.addEventListener("beforeunload", saveProgress);
});
