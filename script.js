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

const word1 = new Word("сок", "juice", "I like orange juice.");
const word2 = new Word("солнце", "sun", "The sun gives you a good mood when it shines.");
const word3 = new Word("жизнь", "life", "Life is beautiful, the main thing is to notice it");
const word4 = new Word("платье", "dress", "A dress is the best decoration for a girl.");
const word5 = new Word("путешествие", "journey", "Journey of a lifetime!");

const arr = [word1, word2, word3, word4, word5];

flipCard.classList.add('active');

slider.addEventListener("click", function() {
    if (flipCard.classList.contains("active")) {
        flipCard.classList.remove("active");
    }else {
        flipCard.classList.contains("active");
    }
} );

let currentIndex = 0;

//готовим карточки со словами
function prepareCard({title, translation, example} ) {
    currentWord.textContent = currentIndex + 1;
    frontTitle.textContent = title
    backTitle.textContent = translation
    example.textContent = example
    wordsProgress.value = (currentIndex + 1) / arr.length * 100;
};
prepareCard(arr[currentIndex]);
//переход к следующему слову при клике на стрелку вперед, стрелка блокируется если слова закончились
next.addEventListener("click", function() {
    currentIndex++;
    prepareCard(arr[currentIndex]);
    back.removeAttribute('disabled');
   if (currentIndex == arr.lang - 1) {
    next.disabled = true;
   }
});
//переход к предыдущему слову по стрелке назад
back.addEventListener("click", function() {
    currentIndex--;
    prepareCard(arr[currentIndex]);
    next.removeAttribute('disabled');
   if (currentIndex == 0) {
    back.disabled = false;
   }
});
//дабавдяем обработчик при клике на кнопку перемешать
shuffleWords.addEventListener('click', function() {
    arr.sort(() => Math.random() - 0.5);
    prepareCard(arr[currentIndex]);
});
totalWord.textContent = arr.length;

let selectedCard;
//функция тестирования карточек
function createTestCard(object) {
    const divElement = document.createElement('div');
    divElement.classList.add('card');
    const pElement = document.createElement('p');
    pElement.append(object);
    divElement.append(pElement);
    divElement.onclick = () => checkTranslationsHandler(divElement);
    return divElement;
};

function addCard() {
    const fragment = new DocumentFragment();
    const newArray = [];
    arr.forEach((array) => {
        newArray.push(createTestCard(array.translation));
        newArray.push(createTestCard(array.title));
    });
    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examination.innerHTML = "";
    examination.append(fragment);
};
testing.addEventListener('click', function() {
    studying.classList.add('hidden');
    addCard();
});

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
        } else {
            selectedCard.classList.add('correct');
            currentCard.classList.add('wrong');
            setTimeout(() => {
                const cards = document.querySelectorAll('card');
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