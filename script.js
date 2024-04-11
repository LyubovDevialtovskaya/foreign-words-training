const testCards = document.querySelector('.test-cards');
const cards = [
    { engWord: 'juice', translateWord: 'сок', example: 'I like orange juice.' },
    { engWord: 'sun', translateWord: 'солнце', example: 'The sun gives you a good mood when it shines.' },
    { engWord: 'life', translateWord: 'жизнь', example: 'Life is beautiful, the main thing is to notice it!' },
    { engWord: 'dress', translateWord: 'платье', example: 'A dress is the best decoration for a girl.' },
    { engWord: 'journey', translateWord: 'путешествие', example: 'Journey of a lifetime!' },
];

let firstCard = null;
let secondCard = null;

function createTestCards() {
    const shuffledCards = shuffleArray(cards.concat(cards));
    shuffledCards.forEach(card => {
        const testCard = document.createElement('div');
        testCard.classList.add('test-card');
        const word = document.createElement('p');
        word.textContent = card.engWord;
        word.classList.add('word');
        testCard.appendChild(word);
        const translation = document.createElement('p');
        translation.textContent = card.translateWord;
        translation.classList.add('translation');
        testCard.appendChild(translation);
        testCard.addEventListener('click', () => handleCardClick(testCard, card));
        testCards.appendChild(testCard);
    });
}

function handleCardClick(cardElement, card) {
    if (!firstCard) {
        firstCard = card;
        cardElement.classList.add('selected');
        cardElement.classList.add('correct');
    } else if (!secondCard) {
        secondCard = card;
        cardElement.classList.add('selected');
        if (firstCard.translateWord === secondCard.translateWord) {
            setTimeout(() => {
                cardElement.classList.add('fade-out');
                const matchedCards = document.querySelectorAll('.selected');
                matchedCards.forEach(matchedCard => {
                    matchedCard.classList.add('fade-out');
                });
                setTimeout(() => {
                    checkAllCardsMatched();
                }, 500);
            }, 500);
        } else {
            cardElement.classList.add('wrong');
            setTimeout(() => {
                const selectedCards = document.querySelectorAll('.selected');
                selectedCards.forEach(selectedCard => {
                    selectedCard.classList.remove('selected');
                    selectedCard.classList.remove('correct');
                    selectedCard.classList.remove('wrong');
                });
                firstCard = null;
                secondCard = null;
            }, 500);
        }
    }
}

function checkAllCardsMatched() {
    const remainingCards = document.querySelectorAll('.test-card');
    if (remainingCards.length === 0) {
        alert('Поздравляем! Вы успешно завершили проверку знаний.');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

createTestCards();
