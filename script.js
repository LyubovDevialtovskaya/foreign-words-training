const currentWordElement = document.querySelector('#current-word');
const totalWordElement = document.querySelector('#total-word');
const wordsProgressElement = document.querySelector('#words-progress');
const shuffleWordsButton = document.querySelector('#shuffle-words');
const sliderElement = document.querySelector('.slider');
const flipCardElement = document.querySelector('.flip-card');
const cardFrontElement = document.querySelector('#card-front');
const frontTitleElement = cardFrontElement.querySelector('h1');
const cardBackElement = document.querySelector('#card-back');
const backTitleElement = cardBackElement.querySelector('h1');
const exampleElement = cardBackElement.querySelector('span');
const backButton = document.querySelector('#back');
const testingButton = document.querySelector('#exam');
const nextButton = document.querySelector('#next');
const studyingSection = document.querySelector('.study-cards');
const examinationSection = document.querySelector('#exam-cards');

function randomInteger(max) {
    return Math.floor(Math.random() * (max + 1));
}

class Word {
    constructor(translation, title, example) {
        this.translation = translation;
        this.title = title;
        this.example = example;
    }
}

const words = [
    new Word("сок", "juice", "I like orange juice."),
    new Word("солнце", "sun", "The sun gives you a good mood when it shines."),
    new Word("жизнь", "life", "Life is beautiful, the main thing is to notice it"),
    new Word("платье", "dress", "A dress is the best decoration for a girl."),
    new Word("путешествие", "journey", "Journey of a lifetime!")
];

let currentIndex = 0;

function prepareCard(word) {
    currentWordElement.textContent = currentIndex + 1;
    if (flipCardElement.classList.contains('active')) {
        frontTitleElement.textContent = word.title;
        backTitleElement.textContent = word.translation;
        exampleElement.textContent = word.example; 
    } else {
        frontTitleElement.textContent = word.translation;
        backTitleElement.textContent = word.title;
        exampleElement.textContent = ''; 
    }
    wordsProgressElement.value = (currentIndex + 1) / words.length * 100;
}

function goToNextWord() {
    currentIndex++;
    prepareCard(words[currentIndex]);
    backButton.disabled = false;
    if (currentIndex === words.length - 1) {
        nextButton.disabled = true;
    }
}

function goToPreviousWord() {
    currentIndex--;
    prepareCard(words[currentIndex]);
    nextButton.disabled = false;
    if (currentIndex === 0) {
        backButton.disabled = true;
    }
}

function toggleCardView() {
    flipCardElement.classList.toggle("active");
    cardFrontElement.classList.toggle("active"); 
    cardBackElement.classList.toggle("active"); 
}

function shuffleWords() {
    words.sort(() => Math.random() - 0.5);
    prepareCard(words[currentIndex]);
}

function createTestCard(wordText) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    const paragraphElement = document.createElement('p');
    paragraphElement.textContent = wordText;
    cardElement.append(paragraphElement);
    cardElement.onclick = () => checkTranslationsHandler(cardElement);
    return cardElement;
}

function addCardsToExamination() {
    const fragment = document.createDocumentFragment();
    const newCardElements = [];
    words.forEach((word) => {
        newCardElements.push(createTestCard(word.translation));
        newCardElements.push(createTestCard(word.title));
    });
    fragment.append(...newCardElements.sort(() => Math.random() - 0.5));
    examinationSection.innerHTML = "";
    examinationSection.append(fragment);
}

function checkTranslationsHandler(currentCard) {
    if (!selectedCard) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('correct', 'wrong');
        });
        currentCard.style.pointerEvents = "none";
        currentCard.classList.add('correct');
        selectedCard = currentCard;
    } else {
        const wordObject = words.find(word => word.translation === selectedCard.textContent || word.title === selectedCard.textContent);
        if (wordObject.translation === currentCard.textContent || wordObject.title === currentCard.textContent) {
            currentCard.style.pointerEvents = "none";
            currentCard.classList.add('correct', 'fade-out');
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
            selectedCard.classList.add('wrong');
            currentCard.classList.add('wrong');
            setTimeout(() => {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    card.classList.remove('correct', 'wrong');
                });
            }, 500);
            currentCard.style.pointerEvents = "all";
            selectedCard.style.pointerEvents = "all";
        }
        selectedCard = null;
    }
}

let selectedCard;

backButton.addEventListener("click", goToPreviousWord);
nextButton.addEventListener("click", goToNextWord);
sliderElement.addEventListener("click", toggleCardView);
shuffleWordsButton.addEventListener('click', shuffleWords);
testingButton.addEventListener('click', () => {
    studyingSection.classList.add('hidden');
    addCardsToExamination();
});
