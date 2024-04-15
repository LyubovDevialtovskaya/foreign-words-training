const elements = {
    currentWord: document.querySelector('#current-word'),
    totalWord: document.querySelector('#total-word'),
    wordsProgress: document.querySelector('#words-progress'),
    shuffleWords: document.querySelector('#shuffle-words'),
    testing: document.querySelector('#testing'),
    flipCard: document.querySelector('.flip-card'),
    cardFront: document.querySelector('#card-front'),
    frontTitle: document.querySelector('#card-front h1'),
    cardBack: document.querySelector('#card-back'),
    backTitle: document.querySelector('#card-back h1'),
    example: document.querySelector('#card-back span'),
    back: document.querySelector('#back'),
    next: document.querySelector('#next'),
    studyCards: document.querySelector('.study-cards'),
    examCards: document.querySelector('#exam-cards')
};

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

const words = [
    new Word("сок", "juice", "I like orange juice."),
    new Word("солнце", "sun", "The sun gives you a good mood when it shines."),
    new Word("жизнь", "life", "Life is beautiful, the main thing is to notice it"),
    new Word("платье", "dress", "A dress is the best decoration for a girl."),
    new Word("путешествие", "journey", "Journey of a lifetime!")
];

const state = {
    currentIndex: 0,
    selectedCard: null
};

elements.flipCard.addEventListener("click", function() {
    this.classList.toggle('active');
});

function prepareCard(word) {
    elements.currentWord.textContent = state.currentIndex + 1;
    elements.frontTitle.textContent = word.title;
    elements.backTitle.textContent = word.translation;
    elements.example.textContent = word.example;
    elements.wordsProgress.value = (state.currentIndex + 1) / words.length * 100;
}

prepareCard(words[state.currentIndex]);

elements.next.addEventListener("click", function() {
    state.currentIndex++;
    prepareCard(words[state.currentIndex]);
    elements.back.disabled = false;
    if (state.currentIndex === words.length - 1) {
        elements.next.disabled = true;
    }
});

elements.back.addEventListener("click", function() {
    state.currentIndex--;
    prepareCard(words[state.currentIndex]);
    elements.next.disabled = false;
    if (state.currentIndex === 0) {
        elements.back.disabled = true;
    }
});

elements.shuffleWords.addEventListener('click', function() {
    words.sort(() => Math.random() - 0.5);
    prepareCard(words[state.currentIndex]);
});

elements.totalWord.textContent = words.length;

elements.testing.addEventListener('click', function() {
    const studyModeBlock = document.querySelector('#study-mode');
    studyModeBlock.classList.add('hidden');
    elements.studyCards.classList.add('hidden');
    elements.examCards.classList.remove('hidden');
    addTestCards();
});

function createTestCard(wordObject) {
    const divElement = document.createElement('div');
    divElement.classList.add('card', 'back');
    const pElement = document.createElement('p');
    pElement.textContent = wordObject.translation;
    divElement.appendChild(pElement);
    divElement.addEventListener('click', () => checkTranslationsHandler(divElement, wordObject));
    return divElement;
}

function addTestCards() {
    const fragment = new DocumentFragment();
    const shuffledWords = words.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < 5; i++) {
        fragment.appendChild(createTestCard(shuffledWords[i])); 
        fragment.appendChild(createTestCard(new Word(shuffledWords[i].translation, shuffledWords[i].title, shuffledWords[i].example))); // English translation
    }
    elements.examCards.innerHTML = "";
    elements.examCards.appendChild(fragment);
}

function clearCardClasses() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('correct');
        card.classList.remove('wrong');
    });
}

function disableCard(card) {
    card.style.pointerEvents = "none";
}

function enableCard(card) {
    card.style.pointerEvents = "all";
}

function checkMatch(currentCard, wordObject) {
    return (wordObject.translation === currentCard.textContent || wordObject.title === currentCard.textContent);
}

function fadeOutCards(cards) {
    cards.forEach(card => {
        card.classList.add('fade-out');
    });
}

function checkTranslationsHandler(currentCard) {
    if (!state.selectedCard) {
        clearCardClasses();
        disableCard(currentCard);
        currentCard.classList.add('correct');
        state.selectedCard = currentCard;
    } else {
        const wordObject = words.find(word => word.translation === state.selectedCard.textContent || word.title === state.selectedCard.textContent);
        if (checkMatch(currentCard, wordObject)) {
            disableCard(currentCard);
            currentCard.classList.add('correct');
            fadeOutCards([currentCard, state.selectedCard]);
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
            state.selectedCard.classList.add('correct');
            currentCard.classList.add('wrong');
            setTimeout(() => {
                clearCardClasses();
            }, 500);
            enableCard(currentCard);
            enableCard(state.selectedCard);
        }
        state.selectedCard = null;
    }
}
