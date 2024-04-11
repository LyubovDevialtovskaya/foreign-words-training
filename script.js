const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front h1');
const cardBack = document.querySelector('#card-back h1');

const words = ["сок", "солнце", "жизнь", "платье", "путешествие"];
const wordsTranslate = ['juice пример: I like orange juice.',
    'sun пример: The sun gives you a good mood when it shines.',
    'life пример: Life is beautiful, the main thing is to notice it!',
    'dress пример: A dress is the best decoration for a girl.',
    'journey пример: Journey of a lifetime!'
];

let i = 0;
const titleFront = cardFront.querySelector('h1');
const titleBack = cardBack.querySelector('h1');

flipCard.addEventListener("click", function(event) {
    flipCard.classList.toggle('active');
});

cardFront.textContent = words[i];
cardBack.textContent = wordsTranslate[i];
const buttonNext = document.querySelector('#next');
const buttonBack = document.querySelector('#back');
const currentWord = document.querySelector('#current-word');

buttonNext.addEventListener("click", function(event) {
    i++;
    if (i == words.length - 1) {
        buttonNext.disabled = true;
    } else {
        buttonNext.disabled = false;
    }

    if (i === 0) {
        buttonBack.disabled = true;
    } else {
        buttonBack.disabled = false;
    }

    cardFront.textContent = words[i];
    cardBack.textContent = wordsTranslate[i];

    currentWord.textContent = i + 1;
});
buttonBack.addEventListener("click", function(event) {
  
    i--;
    if (i === 0) {
        buttonBack.disabled = true;
    } else {
        buttonBack.disabled = false;
    }

    if (i >= words.length - 1) {
        buttonNext.disabled = true;
    } else {
        buttonNext.disabled = false;
    }
    cardFront.textContent = words[i];
    cardBack.textContent = wordsTranslate[i];

    currentWord.textContent = i + 1;
});

const examButton = document.querySelector('#exam');
const firstPage = document.querySelector('.content');
const studyMode = document.querySelector('#study-mode');
examButton.addEventListener("click", function(event) {
    firstPage.classList.add('hidden');
    studyMode.classList.add('hidden');
    containerCards.classList.remove('hidden');
});

const cards = [{
        rus: "сок",
        eng: "juice",

    },
    {
        rus: "солнце",
        eng: "sun",
    },
    {
        rus: "жизнь",
        eng: "life",
    },
    {
        rus: "платье",
        eng: "dress",
    },
    {
        rus: "путешествие",
        eng: "journey",
    },
];

const containerCards = document.createElement('div');
containerCards.classList.add('container-cards');
containerCards.classList.add('hidden');
examCardsContainer.append(containerCards);
const examCardsContainer = document.querySelector('#exam-cards');

let cardTemplate = document.querySelector('#card-template');

function prepareItemCards(itemCards) {
    const { rus, eng } = itemCards;
    const item = cardTemplate.content.cloneNode(true);
    item.querySelector(".rus").textContent = rus;
    item.querySelector(".eng").textContent = eng;
    return item;
};

let copy = [...cards];

function paintCards(side) {
    side.forEach((item) => {
        containerCards.append(prepareItemCards(item));
    });
}

paintCards(copy);

const shuffledCards = [...cards];
shuffleArray(shuffledCards);

function paintShuffledCards(cards) {
    cards.forEach((item) => {
        containerCards.append(prepareItemCards(item));
    });
}

paintShuffledCards(shuffledCards);

let firstClick = null;

containerCards.addEventListener("click", function(event) {
    const clickedCard = event.target.closest('.flip-card');
    if (!firstClick) {
        firstClick = clickedCard;
        firstClick.classList.add('correct');
    } else {
        const secondClick = clickedCard;
        secondClick.classList.add('correct');

        const firstCardText = firstClick.querySelector('.eng').textContent;
        const secondCardText = secondClick.querySelector('.eng').textContent;

        if (firstCardText === secondCardText) {
            firstClick.classList.add('fade-out');
            secondClick.classList.add('fade-out');
        } else {
            secondClick.classList.add('wrong');
            setTimeout(() => {
                secondClick.classList.remove('wrong');
            }, 500);
        }

        firstClick = null;
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
