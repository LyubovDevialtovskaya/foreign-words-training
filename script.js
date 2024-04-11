const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');
const wordsProgress = document.querySelector('#words-progress');
const shuffleWords = document.querySelector('#shuffle-words');
const examProgress = document.querySelector('#exam-progress');
const slider = document.querySelector('.slider');
const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front');
const frontTitle = cardFront.querySelector('h1');
const cardBack = document.querySelector('#card-back');
const backTitle = cardBack.querySelector('h1');
const example = cardBack.querySelector('span');
const back = document.querySelector('#back');
const testing = document.querySelector('#exam');
const next = document.querySelector('#next');
const studying = document.querySelector('.study-cards');
const examination = document.querySelector('#exam-cards');

function randomInteger(max) {
    return Math.floor(Math.random() * (max + 1));
}

class WordCard {
    constructor(title, translation, example) {
        this.title = title;
        this.translation = translation;
        this.example = example;
    }
}

const word1 = new WordCard("сок", "juice", "I like orange juice.");
const word2 = new WordCard("солнце", "sun", "The sun gives you a good mood when it shines.");
const word3 = new WordCard("жизнь", "life", "Life is beautiful, the main thing is to notice it");
const word4 = new WordCard("платье", "dress", "A dress is the best decoration for a girl.");
const word5 = new WordCard("путешествие", "journey", "Journey of a lifetime!");

const wordsArray = [word1, word2, word3, word4, word5];

flipCard.classList.add('active');

let currentIndex = 0;

function displayFrontCard({ title }) {
    currentWord.textContent = currentIndex + 1;
    frontTitle.textContent = title;
    backTitle.textContent = '';
    example.textContent = '';
    wordsProgress.value = (currentIndex + 1) / wordsArray.length * 100;
}

function displayBackCard({ title, translation, example }) {
    currentWord.textContent = currentIndex + 1;
    frontTitle.textContent = title;
    backTitle.textContent = translation;
    example.textContent = example;
    wordsProgress.value = (currentIndex + 1) / wordsArray.length * 100;
}

function prepareCard() {
    displayFrontCard(wordsArray[currentIndex]);
}

prepareCard();

next.addEventListener("click", function () {
    currentIndex++;
    if (currentIndex < wordsArray.length) {
        prepareCard();
        back.removeAttribute('disabled');
    } else {
        next.disabled = true;
        currentIndex = wordsArray.length - 1;
    }
});

back.addEventListener("click", function () {
    currentIndex--;
    if (currentIndex >= 0) {
        prepareCard();
        next.removeAttribute('disabled');
    } else {
        back.disabled = true;
        currentIndex = 0;
    }
});

shuffleWords.addEventListener('click', function () {
    wordsArray.sort(() => Math.random() - 0.5);
    prepareCard();
});

totalWord.textContent = wordsArray.length;

function createTestCard(word) {
    const divElement = document.createElement('div');
    divElement.classList.add('card');
    const pElement = document.createElement('p');
    pElement.append(word);
    divElement.append(pElement);
    divElement.onclick = () => checkTranslationsHandler(divElement);
    return divElement;
}

function addCard() {
    const fragment = new DocumentFragment();
    const newArray = [];
    wordsArray.forEach((word) => {
        newArray.push(createTestCard(word.translation));
        newArray.push(createTestCard(word.title));
    });
    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examination.innerHTML = "";
    examination.append(fragment);
}

testing.addEventListener('click', function () {
    studying.classList.add('hidden');
    addCard();
});

let selectedCard;

function checkTranslationsHandler(currentCard) {
    if (!selectedCard) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('correct');
            card.classList.remove('wrong');
        });
        currentCard.style.pointerEvents = "none";
        currentCard.classList.add('correct');
        selectedCard = currentCard;
    } else {
        const currentWordObj = wordsArray.find(word => word.translation === selectedCard.textContent || word.title === selectedCard.textContent);
        if (currentWordObj.translation === currentCard.textContent || currentWordObj.title === currentCard.textContent) {
            currentCard.style.pointerEvents = "none";
            currentCard.classList.add('correct');
            currentCard.classList.add('fade-out');
            selectedCard.classList.add('fade-out');
            const cards = document.querySelectorAll('.card');
            let cardsFaded = true;
            cards.forEach(card => {
                if (!card.classList.contains('fade-out')) {
                    cardsFaded = false;
                }
            });
            if (cardsFaded) {
                setTimeout(() => {
                    alert('Проверка знаний завершена успешно!');
                }, 1000);
            }
        } else {
            selectedCard.classList.add('correct');
            currentCard.classList.add('wrong');
            setTimeout(() => {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    card.classList.remove('correct');
                    card.classList.remove('wrong');
                });
            }, 500);
            currentCard.style.pointerEvents = "all";
            selectedCard.style.pointerEvents = "all";
        }
        selectedCard = null;
    }
}
