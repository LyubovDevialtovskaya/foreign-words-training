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

class Word {
    constructor(title, translation, example) {
        this.title = title;
        this.translation = translation;
        this.example = example;
    }
}

const word1 = new Word("juice", "сок", "I like orange juice.");
const word2 = new Word("sun", "солнце", "The sun gives you a good mood when it shines.");
const word3 = new Word("life", "жизнь", "Life is beautiful, the main thing is to notice it");
const word4 = new Word("dress", "платье", "A dress is the best decoration for a girl.");
const word5 = new Word("journey", "путешествие", "Journey of a lifetime!");

const arr = [word1, word2, word3, word4, word5];

flipCard.addEventListener("click", function() {
    flipCard.classList.toggle("active");
});

let currentIndex = 0;

function prepareCard(word) {
    currentWord.textContent = currentIndex + 1;
    if (flipCard.classList.contains("active")) {
        frontTitle.textContent = word.translation;
        backTitle.textContent = word.title;
        example.textContent = word.example;
    } else {
        frontTitle.textContent = word.title;
        backTitle.textContent = word.translation;
        example.textContent = ""; 
    }
    wordsProgress.value = (currentIndex + 1) / arr.length * 100;

    if (!flipCard.classList.contains("active")) {
        flipCard.classList.add("active");
    }
}

prepareCard(arr[currentIndex]);

next.addEventListener("click", function() {
    currentIndex++;
    prepareCard(arr[currentIndex]);
    back.disabled = false;
    if (currentIndex === arr.length - 1) {
        next.disabled = true;
    }
});

back.addEventListener("click", function() {
    currentIndex--;
    prepareCard(arr[currentIndex]);
    next.disabled = false;
    if (currentIndex === 0) {
        back.disabled = true;
    }
});

shuffleWords.addEventListener('click', function() {
    arr.sort(() => Math.random() - 0.5);
    prepareCard(arr[currentIndex]);
});
totalWord.textContent = arr.length;

let selectedCard;

function createTestCard(text) {
    const divElement = document.createElement('div');
    divElement.classList.add('card');
    const pElement = document.createElement('p');
    pElement.textContent = text;
    divElement.append(pElement);
    divElement.onclick = () => checkTranslationsHandler(divElement);
    return divElement;
}

flipCard.addEventListener("click", function() {
    flipCard.classList.toggle("active");
});

function addCard() {
    const fragment = new DocumentFragment();
    const newArray = [];
    arr.forEach((word) => {
        newArray.push(createTestCard(word.translation));
        newArray.push(createTestCard(word.title));
    });
    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examination.innerHTML = "";
    examination.append(fragment);
}

testing.addEventListener('click', function() {
    studying.classList.add('hidden');
    examination.classList.remove('hidden');
    addCard();
});

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
        const wordObject = arr.find(word => word.translation.trim() === selectedCard.textContent.trim() || word.title.trim() === selectedCard.textContent.trim());
        if (wordObject.translation.trim() === currentCard.textContent.trim() || wordObject.title.trim() === currentCard.textContent.trim()) {
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

function saveProgress() {
    localStorage.setItem('currentIndex', currentIndex);
}
function loadProgress() {
    const savedIndex = localStorage.getItem('currentIndex');
    if (savedIndex !== null) {
        currentIndex = parseInt(savedIndex);
        prepareCard(arr[currentIndex]);
    }
}
window.addEventListener('load', loadProgress);
window.addEventListener('beforeunload', saveProgress);