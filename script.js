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

setCard(cards[0]);

studyCards.addEventListener("click", function(activate) {
    const element = activate.target.closest(".flip-card");
    if (element) {
        element.classList.toggle('active');
    }
}); 

let count = 0;
function goBack() {
    if (count === 0) {
        backButton.disabled = true;
    } else {
        count -= 1;
        number.textContent = count + 1;
        nextButton.disabled = false;
    }
    setCard(cards[count]);
}

function goForward() {
    if (count === cards.length - 1) {
        nextButton.disabled = true;
    } else {
        count += 1;
        number.textContent = count + 1;
        backButton.disabled = false;
    }
    setCard(cards[count]);
}

backButton.addEventListener("click", goBack); 
nextButton.addEventListener("click", goForward);

examButton.addEventListener("click", function() {
    studyCards.classList.add('hidden');

    function createCardsGrid() {
        const copyCards = [...cards];
        const shuffledCards = shuffleArray(copyCards.concat(copyCards));
        shuffledCards.forEach(card => {
            const examCard = document.createElement('div');
            examCard.classList.add('card');
            const word = document.createElement('h1');
            word.textContent = card.engWord;
            word.classList.add('card');
            examCard.append(word);
            allExamCards.append(examCard);
        });
    }

    createCardsGrid();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
