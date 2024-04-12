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

        flipCard.classList.add('active');

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
            addCard();
        });

        function createTestCard(title) {
            const divElement = document.createElement('div');
            divElement.classList.add('card');
            const pElement = document.createElement('p');
            pElement.append(title);
            divElement.append(pElement);
            divElement.onclick = () => checkTranslationsHandler(divElement);
            return divElement;
        }
        
        function addCard() {
            resetCardsState();
            const fragment = new DocumentFragment();
            arr.forEach(word => {
                fragment.appendChild(createTestCard(word.translation));
            });
            examCards.innerHTML = "";
            examCards.appendChild(fragment);
            examCards.addEventListener('click', function(event) {
                const clickedCard = event.target.closest('.card');
                if (clickedCard) {
                    checkTranslationsHandler(clickedCard);
                }
            });
        }
        
        testing.addEventListener('click', function() {
            addCard();
        });
        
        let selectedCard;

        function checkTranslationsHandler(currentCard) {
            if (!selectedCard) {
                selectedCard = currentCard;
                selectedCard.classList.add('correct');
            } else {
                const selectedWord = arr.find(word => word.translation === selectedCard.textContent);
                const currentWord = arr.find(word => word.translation === currentCard.textContent);
                if (selectedWord && currentWord && selectedWord.title === currentWord.title) {
                    currentCard.classList.add('correct', 'fade-out');
                    selectedCard.classList.add('fade-out');
                    selectedCard = null;
                    const remainingCards = document.querySelectorAll('.card:not(.fade-out)');
                    if (remainingCards.length === 0) {
                        setTimeout(() => {
                            alert('Проверка знаний завершена успешно!');
                        }, 1000);
                    }
                } else {
                    currentCard.classList.add('wrong');
                    setTimeout(() => {
                        currentCard.classList.remove('wrong');
                    }, 500);
                }
            }
        } 