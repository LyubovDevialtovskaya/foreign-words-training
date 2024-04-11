const studyCards = document.querySelector('.study-cards');
const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back');
const cardFrontContent = document.querySelector('#card-front h1');
const cardBackTranslate = document.querySelector('#card-back h1');
const cardBackExample = document.querySelector('#card-back span');
const nextButton = document.querySelector('#next');
const backButton = document.querySelector('#back');
const number = document.querySelector('#current-word');
const examButton = document.querySelector('#exam');
const allExamCards = document.querySelector('#exam-cards');
const shuffleButton = document.querySelector('#shuffle-words');
const timer = document.querySelector('#timer');
const wordsProgress = document.querySelector('#words-progress');
const correctPercent = document.querySelector('#correct-percent');
const examProgress = document.querySelector('#exam-progress');
const resultsModal = document.querySelector('#results-modal');
const wordStatsTemplate = document.querySelector('template#word-stats');
let currentIndex = 0;
let cards = [
    { engWord: 'juice', translateWord: 'сок', example: 'I like orange juice.' },
    { engWord: 'sun', translateWord: 'солнце', example: 'The sun gives you a good mood when it shines.' },
    { engWord: 'life', translateWord: 'жизнь', example: 'Life is beautiful, the main thing is to notice it!' },
    { engWord: 'dress', translateWord: 'платье', example: 'A dress is the best decoration for a girl.' },
    { engWord: 'journey', translateWord: 'путешествие', example: 'Journey of a lifetime!' },
];

function setCard(card) {
    cardFrontContent.textContent = card.engWord;
    cardBackTranslate.textContent = card.translateWord;
    cardBackExample.textContent = card.example;
}

function updateProgress() {
    const percent = ((currentIndex + 1) / cards.length) * 100;
    wordsProgress.textContent = `${Math.round(percent)}%`;
    number.textContent = `${currentIndex + 1}`;
}

function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        setCard(cards[currentIndex]);
        updateProgress();
    }
}

function goForward() {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        setCard(cards[currentIndex]);
        updateProgress();
    }
}

function flipCards() {
    flipCard.classList.toggle('active');
}

function switchToExamMode() {
    // Скрываем элементы режима тренировки
    studyCards.style.display = 'none';
    flipCard.style.display = 'none';
    nextButton.style.display = 'none';
    backButton.style.display = 'none';
    shuffleButton.style.display = 'none';

    // Отображаем элементы режима проверки знаний
    allExamCards.style.display = 'block';
    timer.style.display = 'block';
    correctPercent.style.display = 'block';
    examProgress.style.display = 'block';

    // Начинаем тестирование
    startTimer();
}

nextButton.addEventListener("click", goForward);
backButton.addEventListener("click", goBack);
flipCard.addEventListener("click", flipCards);
examButton.addEventListener("click", switchToExamMode);

setCard(cards[currentIndex]);
updateProgress();
