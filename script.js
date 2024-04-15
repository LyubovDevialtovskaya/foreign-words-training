const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');
const wordsProgress = document.querySelector('#words-progress');
const shuffleWords = document.querySelector('#shuffle-words');
const testing = document.querySelector('#testing');
const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front');
const frontTitle = cardFront.querySelector('h1');
const cardBack = document.querySelector('#card-back');
const backTitle = cardBack.querySelector('h1');
const example = cardBack.querySelector('span');
const back = document.querySelector('#back');
const next = document.querySelector('#next');
const studyCards = document.querySelector('.study-cards');
const examCards = document.querySelector('#exam-cards');


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

const word1 = new Word("сок", "juice", "I like orange juice.");
const word2 = new Word("солнце", "sun", "The sun gives you a good mood when it shines.");
const word3 = new Word("жизнь", "life", "Life is beautiful, the main thing is to notice it");
const word4 = new Word("платье", "dress", "A dress is the best decoration for a girl.");
const word5 = new Word("путешествие", "journey", "Journey of a lifetime!");

const arr = [word1, word2, word3, word4, word5];

flipCard.addEventListener("click", function() {
    this.classList.toggle('active');
});

let currentIndex = 0;

function prepareCard(word) {
    currentWord.textContent = currentIndex + 1;
    frontTitle.textContent = word.title;
    backTitle.textContent = word.translation;
    example.textContent = word.example;
    wordsProgress.value = (currentIndex + 1) / arr.length * 100;
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

testing.addEventListener('click', function() {
    studyCards.classList.add('hidden');
    examCards.classList.remove('hidden');
    addTestCards();
});

function createTestCard(wordObject) {
    const divElement = document.createElement('div');
    divElement.classList.add('card', 'back'); // Добавляем класс back для обратной стороны
    const pElement = document.createElement('p');
    pElement.append(wordObject.translation);
    divElement.append(pElement);
    divElement.onclick = () => checkTranslationsHandler(divElement, wordObject);
    return divElement;
}
function addTestCards() {
    const fragment = new DocumentFragment();
    const shuffledWords = arr.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < 5; i++) {
        const index = i; 
        fragment.appendChild(createTestCard(shuffledWords[index])); 
        fragment.appendChild(createTestCard(new Word(shuffledWords[index].translation, shuffledWords[index].title, shuffledWords[index].example))); // English translation
    }
    const examCards = document.querySelector('#exam-cards');
    examCards.innerHTML = "";
    examCards.appendChild(fragment);
}



let selectedCard = null; 

function checkTranslationsHandler(currentCard) {
    if (!selectedCard) {
        const card = document.querySelectorAll('.card');
        card.forEach(card => {
            card.classList.remove('correct');
            card.classList.remove('wrong');
        });
        currentCard.style.pointerEvents = "none";
        currentCard.classList.add('correct');
        selectedCard = currentCard;
        
    }else {
        const wordObject = arr.find(word => word.translation === selectedCard.textContent || word.title === selectedCard.textContent);
        if (wordObject.translation === currentCard.textContent || wordObject.title === currentCard.textContent) {
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
        } else {selectedCard.classList.add('correct');
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
    };
    selectedCard = null;
}
}