"use strict"

const words = [
    {
        word: 'juice',
        translation: 'сок',
        example: "I like orange juice.",
    },
    {
        word: 'sun',
        translation: 'солнце',
        example: "The sun gives you a good mood when it shines.",
    },
    {
        word: 'life',
        translation: 'жизнь',
        example: "Life is beautiful, the main thing is to notice it"
    },
    {
        word: 'dress',
        translation: 'платье',
        example: "A dress is the best decoration for a girl."
    },
    {
        word: 'journey',
        translation: 'путешествие',
        example: "Journey of a lifetime!"
    },
    {
        word: 'pilates',
        translation: 'пилатес',
        example: "I have pilates everyday"
    }
]

const card = document.querySelector(".flip-card");
const prevButton = document.querySelector("#back");
const nextButton = document.querySelector("#next");
const testButton = document.querySelector("#exam");
const wordNumberElement = document.querySelector("#current-word");
let idx = 0;

function prepareCard({ word, translation, example }) {
    renderCard({ word, translation, example });
    card.addEventListener("click", (event) => {
        if (idx !== words.length - 1) {
            event.currentTarget.classList.toggle("active");
        }
    });
}

function renderCard({ word, translation, example }) {
    card.querySelector("#card-front h1").textContent = word || "Default Word";
    card.querySelector("#card-back h1").textContent = translation || "Default Translation";
    card.querySelector("#card-back p span").textContent = example || "Default Example";

}

function updateButtons() {
    prevButton.disabled = idx === 0;
    nextButton.disabled = idx === words.length - 1;
}
function updateWordNumber() {
    wordNumberElement.textContent = `${idx + 1} из ${words.length}`;
}
prevButton.addEventListener("click", () => {
    idx = Math.max(0, idx - 1);
    prepareCard(words[idx]);
    updateButtons();
});

nextButton.addEventListener("click", () => {
    idx = Math.min(words.length - 1, idx + 1);
    prepareCard(words[idx]);
    updateButtons();
});

testButton.addEventListener("click", () => {
    
});


prepareCard(words[idx]);

updateButtons();
updateWordNumber()
