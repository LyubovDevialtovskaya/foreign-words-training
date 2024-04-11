"use strict";

const words = [
    ['juice', 'сок', 'I like orange juice.'],
    ['sun', 'солнце', 'The sun gives you a good mood when it shines.'],
    ['life', 'жизнь', 'Life is beautiful, the main thing is to notice it!'],
    ['dress', 'платье', 'A dress is the best decoration for a girl.'],
    ['journey', 'путешествие', 'Journey of a lifetime!'],
    ['laptop', 'ноутбук', 'I use my laptop everyday.']
    
];

let counter = 0;

const studyCards = document.querySelector('.study-cards')
const flipCard = document.querySelector('.flip-card');
const slider = document.querySelector('.slider');
const button = document.querySelector('.slider-controls');
const buttonNext = document.querySelector('#next');
const buttonBack = document.querySelector('#back');
const buttonExam = document.querySelector('#exam');
const examsCard = document.querySelector('#exam-cards');
const examMode = document.querySelector('#exam-mode');
const studyMode = document.querySelector('#study-mode');
const shuffleButton = document.querySelector('#shuffle-words');


function createWord() { 

    const cardFront = document.querySelector('#card-front');
    const wordFront = cardFront.querySelector('h1');
    wordFront.textContent = words[counter][0];

    const cardBack = document.querySelector('#card-back');

    const wordTranslation = cardBack.querySelector('h1');
    wordTranslation.textContent = words[counter][1];

    const example = cardBack.querySelector('span');
    example.textContent = words[counter][2];

    const currentWord = document.querySelector('#current-word');
    currentWord.textContent = counter + 1;

    const totalWord = document.querySelector('#total-word')
    totalWord.textContent = words.length;
}

function generateWord() { 
    const randomIndex = Math.floor((Math.random() * words.length));
    let newWord = words[randomIndex];
    words[counter] = newWord;
    createWord();
}

shuffleButton.addEventListener('click', generateWord);


createWord();

slider.addEventListener('click', () => { 
    flipCard.classList.toggle('active');
});


button.addEventListener('click', (event) => { 
    let action = event.target;
    event.preventDefault();

    if (action === buttonNext) {
        counter++;
    } else if (action === buttonBack) {
        counter--;
    }

    if (action === buttonExam) { 
        studyCards.classList.add('hidden'); 
        studyMode.classList.add('hidden'); 
        examMode.classList.remove('hidden'); 
        createCards();

        const cards = document.querySelectorAll('.card');
        let hasSelectedCard = false;

        let firstCard, secondCard;

        function selectCard() {

            this.classList.add('correct');

            if (!hasSelectedCard) {
                hasSelectedCard = true;
                firstCard = this;
                return;
            }

            secondCard = this;
            hasSelectedCard = false;

            checkForMatch();

            if (Array.from(cards).every(card => card.className.includes('fade-out'))) {
                setTimeout(() => {
                    alert("Игра окончена");
                    location.reload();
                }, 1000);
            }
        }

        function checkForMatch() { 
            let numberFirst = words.indexOf(words.find(arr => arr.includes(firstCard.textContent)));
            let numberSecond = words.indexOf(words.find(arr => arr.includes(secondCard.textContent)));

            if (numberFirst == numberSecond) {
                firstCard.classList.add('fade-out');
                secondCard.classList.add('fade-out');
                return;
            }

            unSelectCard();
        }

        function unSelectCard() { 
            secondCard.classList.add('wrong');
            setTimeout(() => {
                firstCard.classList.remove('correct');
                secondCard.classList.remove('correct', 'wrong');

            }, 500);
            return;
        }

        cards.forEach(card => card.addEventListener('click', selectCard));
    }

    if (counter > 0) {
        buttonBack.disabled = false;
    } else {
        buttonBack.disabled = true;
    }

    if (counter === words.length - 1) {
        buttonNext.disabled = true;
        return;
    } else {
        buttonNext.disabled = false;
    }

    createWord();
});

function createCard(item) {
    const divWord = document.createElement('div');
    divWord.classList.add('card');
    divWord.textContent = item;
    return divWord;

}

function createCards() { 

    const fragment = new DocumentFragment();
    const newArray = [];

    words.forEach((word) => {
        newArray.push(createCard(word[0]));
        newArray.push(createCard(word[1]));
    });

    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examsCard.innerHTML = "";
    examsCard.append(fragment);
}