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

let firstCard = null;
let secondCard = null;
let startTime = null;
let endTime = null;
let correctCount = 0;
let incorrectCount = 0;
let currentIndex = 0;

const cards = [
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
}

function startTimer() {
    startTime = new Date().getTime();
}

function stopTimer() {
    endTime = new Date().getTime();
    const timeDiff = endTime - startTime;
    const seconds = Math.floor(timeDiff / 1000);
    timer.textContent = `${seconds} сек`;
}

function updateExamProgress() {
    const totalCards = correctCount + incorrectCount;
    const percentCorrect = (correctCount / totalCards) * 100;
    correctPercent.textContent = `${Math.round(percentCorrect)}%`;
    examProgress.textContent = `${totalCards} / ${cards.length}`;
}

function showResults() {
    const fragment = document.importNode(wordStatsTemplate.content, true);
    const resultsContainer = fragment.querySelector('.results-container');
    cards.forEach(card => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <p>${card.engWord}</p>
            <p>${card.translateWord}</p>
            <p>${card.example}</p>
        `;
        resultsContainer.appendChild(resultItem);
    });
    resultsModal.appendChild(fragment);
    resultsModal.style.display = 'block';
}

function createTestCards() {
    const shuffledCards = shuffleArray(cards.concat(cards));
    shuffledCards.forEach(card => {
        const testCard = document.createElement('div');
        testCard.classList.add('test-card');
        const word = document.createElement('p');
        word.textContent = card.engWord;
        word.classList.add('word');
        testCard.appendChild(word);
        const translation = document.createElement('p');
        translation.textContent = card.translateWord;
        translation.classList.add('translation');
        testCard.appendChild(translation);
        testCard.addEventListener('click', () => handleCardClick(testCard, card));
        testCards.appendChild(testCard);
    });
}

function handleCardClick(cardElement, card) {
    if (!firstCard) {
        firstCard = card;
        cardElement.classList.add('selected');
        cardElement.classList.add('correct');
    } else if (!secondCard) {
        secondCard = card;
        cardElement.classList.add('selected');
        if (firstCard.translateWord === secondCard.translateWord) {
            setTimeout(() => {
                cardElement.classList.add('fade-out');
                const matchedCards = document.querySelectorAll('.selected');
                matchedCards.forEach(matchedCard => {
                    matchedCard.classList.add('fade-out');
                });
                setTimeout(() => {
                    checkAllCardsMatched();
                }, 500);
            }, 500);
        } else {
            cardElement.classList.add('wrong');
            setTimeout(() => {
                const selectedCards = document.querySelectorAll('.selected');
                selectedCards.forEach(selectedCard => {
                    selectedCard.classList.remove('selected');
                    selectedCard.classList.remove('correct');
                    selectedCard.classList.remove('wrong');
                });
                firstCard = null;
                secondCard = null;
            }, 500);
        }
    }
}

function checkAllCardsMatched() {
    const remainingCards = document.querySelectorAll('.test-card');
    if (remainingCards.length === 0) {
        stopTimer();
        showResults();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function shuffleCards() {
    currentIndex = 0;
    cards = shuffleArray(cards);
    setCard(cards[currentIndex]);
    updateProgress();
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

nextButton.addEventListener("click", goForward);
backButton.addEventListener("click", goBack);
shuffleButton.addEventListener("click", shuffleCards);

createTestCards();
startTimer();
