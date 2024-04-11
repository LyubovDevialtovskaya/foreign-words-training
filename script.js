const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');
const wordsProgress = document.querySelector('#words-progress');
const shuffleWordsButton = document.querySelector('#shuffle-words');
const examProgress = document.querySelector('#exam-progress');
const flipCardButton = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front h1');
const cardBack = document.querySelector('#card-back h1');
const example = document.querySelector('#card-back span');
const backButton = document.querySelector('#back');
const nextButton = document.querySelector('#next');
const studyCardsContainer = document.querySelector('.study-cards');
const examCardsContainer = document.querySelector('#exam-cards');

class Word {
    constructor(title, translation, example) {
        this.title = title;
        this.translation = translation;
        this.example = example;
    }
}

const words = [
    new Word("juice", "сок", "I like orange juice."),
    new Word("sun", "солнце", "The sun gives you a good mood when it shines."),
    new Word("life", "жизнь", "Life is beautiful, the main thing is to notice it"),
    new Word("dress", "платье", "A dress is the best decoration for a girl."),
    new Word("journey", "путешествие", "Journey of a lifetime!")
];

let currentIndex = 0;

function renderCard(word) {
    currentWord.textContent = currentIndex + 1;
    cardFront.textContent = word.title;
    cardBack.textContent = word.translation;
    example.textContent = flipCardButton.classList.contains('active') ? word.example : '';
    wordsProgress.value = (currentIndex + 1) / words.length * 100;
}

function prepareStudyCards() {
    studyCardsContainer.innerHTML = '';
    words.forEach(word => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = word.title;
        cardElement.onclick = () => flipCardButton.classList.toggle("active");
        studyCardsContainer.appendChild(cardElement);
    });
}

function prepareExamCards() {
    examCardsContainer.innerHTML = '';
    words.forEach(word => {
        const frontCard = createTestCard(word.translation);
        const backCard = createTestCard(word.title);
        examCardsContainer.appendChild(frontCard);
        examCardsContainer.appendChild(backCard);
    });
}

function createTestCard(text) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = text;
    cardElement.onclick = () => checkTranslationsHandler(cardElement);
    return cardElement;
}

function checkTranslationsHandler(selectedCard) {
    const selectedWord = words.find(word => word.translation === selectedCard.textContent || word.title === selectedCard.textContent);
    const isCorrect = flipCardButton.classList.contains('active') ? selectedWord.translation === cardBack.textContent : selectedWord.title === cardBack.textContent;
    selectedCard.classList.toggle('correct', isCorrect);
    if (!isCorrect) {
        selectedCard.classList.toggle('wrong', true);
        setTimeout(() => {
            selectedCard.classList.remove('wrong');
            selectedCard.classList.remove('correct');
        }, 500);
    } else {
        selectedCard.style.pointerEvents = "none";
        const cards = document.querySelectorAll('.card');
        const allCorrect = Array.from(cards).every(card => card.classList.contains('correct'));
        if (allCorrect) {
            setTimeout(() => {
                alert('Проверка знаний завершена успешно!');
            }, 1000);
        }
    }
}

function shuffleWords() {
    words.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    renderCard(words[currentIndex]);
}

function nextCard() {
    currentIndex++;
    if (currentIndex >= words.length) {
        currentIndex = words.length - 1;
    }
    renderCard(words[currentIndex]);
}

function prevCard() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = 0;
    }
    renderCard(words[currentIndex]);
}

flipCardButton.addEventListener("click", function() {
    flipCardButton.classList.toggle("active");
    renderCard(words[currentIndex]);
});

nextButton.addEventListener("click", nextCard);
backButton.addEventListener("click", prevCard);
shuffleWordsButton.addEventListener('click', shuffleWords);

totalWord.textContent = words.length;
prepareStudyCards();

function saveProgress() {
    localStorage.setItem('currentIndex', currentIndex);
}

function loadProgress() {
    const savedIndex = localStorage.getItem('currentIndex');
    if (savedIndex !== null) {
        currentIndex = parseInt(savedIndex);
        renderCard(words[currentIndex]);
    }
}

window.addEventListener('load', loadProgress);
window.addEventListener('unload', saveProgress);
