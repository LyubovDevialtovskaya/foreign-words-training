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

let currentIndex = 0;
const titleFront = cardFront.querySelector('h1');
const titleBack = cardBack.querySelector('h1');

flipCard.addEventListener("click", function(event) {
    flipCard.classList.toggle('active');
});

function showCard(index) {
    if (index >= 0 && index < words.length) {
        cardFront.textContent = words[index];
        cardBack.textContent = wordsTranslate[index];
        currentIndex = index;
    }
}

function showNextCard() {
    currentIndex++;
    showCard(currentIndex);
    updateNavigationButtons();
}

function showPreviousCard() {
    currentIndex--;
    showCard(currentIndex);
    updateNavigationButtons();
}

function updateNavigationButtons() {
    document.querySelector('#next').disabled = currentIndex === words.length - 1;
    document.querySelector('#back').disabled = currentIndex === 0;
    document.querySelector('#current-word').textContent = currentIndex + 1;
}

showCard(currentIndex);
updateNavigationButtons();

const examButton = document.querySelector('#exam');
const firstPage = document.querySelector('.content');
const studyMode = document.querySelector('#study-mode');
const containerCards = document.querySelector('#exam-cards');

examButton.addEventListener("click", function(event) {
    firstPage.classList.add('hidden');
    studyMode.classList.add('hidden');
    containerCards.classList.remove('hidden');
    containerCards.innerHTML = ''; // Clear container before showing cards

    const shuffledWords = shuffleArray([...words]);
    const shuffledTranslations = shuffleArray([...wordsTranslate]);

    for (let i = 0; i < shuffledWords.length; i++) {
        const card = document.createElement('div');
        card.classList.add('flip-card');
        card.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <h1>${shuffledWords[i]}</h1>
                </div>
                <div class="flip-card-back">
                    <h1>${shuffledTranslations[i]}</h1>
                </div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        containerCards.appendChild(card);
    }
});

function flipCard(event) {
    const clickedCard = event.currentTarget;
    clickedCard.classList.toggle('active');

    const allCards = document.querySelectorAll('.flip-card');
    const selectedCards = Array.from(allCards).filter(card => card.classList.contains('active'));

    if (selectedCards.length === 2) {
        const firstCard = selectedCards[0];
        const secondCard = selectedCards[1];

        if (firstCard.querySelector('h1').textContent === secondCard.querySelector('h1').textContent) {
            setTimeout(() => {
                firstCard.classList.add('fade-out');
                secondCard.classList.add('fade-out');
            }, 500);
        } else {
            setTimeout(() => {
                selectedCards.forEach(card => card.classList.remove('active'));
                secondCard.classList.add('wrong');
                setTimeout(() => {
                    secondCard.classList.remove('wrong');
                }, 500);
            }, 1000);
        }
    }

    const remainingCards = document.querySelectorAll('.flip-card:not(.fade-out)');
    if (remainingCards.length === 0) {
        alert('Проверка знаний завершена успешно!');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
