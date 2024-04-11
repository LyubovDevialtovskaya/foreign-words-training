'use strict';

const elements = {
  studyModeSidebar: document.querySelector('#study-mode'),
  currentWordCounter: document.querySelector('#current-word'),
  totalWordCounter: document.querySelector('#total-word'),
  shuffleBtn: document.querySelector('#shuffle-words'),
  studyProgress: document.querySelector('#words-progress'),
  cardToStudy: document.querySelector('.flip-card'),
  backBtn: document.querySelector('#back'),
  nextBtn: document.querySelector('#next'),
  cardBackExampleEng: document.querySelector('#card-back .example-eng')
};

class Word {
  constructor(engWord, rusWord, example, exampleEng) {
    this.engWord = engWord;
    this.rusWord = rusWord;
    this.example = example;
    this.exampleEng = exampleEng;
  }
}

let studyWords = [];
let index = 0;
elements.cardToStudy.addEventListener('click', toggleCard);
elements.nextBtn.addEventListener('click', moveCardsForward);
elements.backBtn.addEventListener('click', moveCardsBack);
elements.shuffleBtn.addEventListener('click', shuffleStudyWords);


function initialize() {
  initializeWords();
  initializeIndex();
  printStudyCard();
  changeCounter();
  changeProgress();
  toggleBtn();
}

function initializeWords() {
  try {
    studyWords = JSON.parse(localStorage.getItem('studyWords')) || [];
  } catch (error) {
    console.error(error);
  }

  if (!studyWords.length) {
    addDefaultWords();
  }
}

function addDefaultWords() {
  addWordToStudy('juice', 'сок', 'I like orange juice.', 'Мне нравится апельсиновый сок.');
  addWordToStudy('sun', 'солнце', 'The sun gives you a good mood when it shines.', 'Солнце поднимает тебе настроение, когда оно светит.');
  addWordToStudy('life', 'жизнь', 'Life is beautiful, the main thing is to notice it!', 'Жизнь прекрасна, главное — заметить это!');
  addWordToStudy('dress', 'платье', 'A dress is the best decoration for a girl.', 'Платье — лучшее украшение для девушки.');
  addWordToStudy('journey', 'путешествие', 'Journey of a lifetime!', 'Путешествие жизни!');
  localStorage.setItem('studyWords', JSON.stringify(studyWords));
}

function initializeIndex() {
  try {
    index = JSON.parse(sessionStorage.getItem('indexToPrint')) || 0;
  } catch (error) {
    console.error(error);
  }
}

function addWordToStudy(eng, rus, ex, exEng) {
  const word = new Word(eng, rus, ex, exEng);
  studyWords.push(word);
}

function printStudyCard() {
  const word = studyWords[index];
  elements.cardFrontWord.textContent = word.engWord;
  elements.cardBackWord.textContent = word.rusWord;
  elements.cardBackExample.textContent = "";
  elements.cardBackExampleEng.textContent = word.exampleEng; 
}

function changeCounter() {
  elements.currentWordCounter.textContent = index + 1;
  elements.totalWordCounter.textContent = studyWords.length;
}

function changeProgress() {
  elements.studyProgress.value = (index + 1) * 100 / studyWords.length;
}

function toggleBtn() {
  elements.backBtn.disabled = index === 0;
  elements.nextBtn.disabled = index === studyWords.length - 1;
}

function toggleCard() {
  elements.cardToStudy.classList.toggle('active');
}

function moveCardsForward() {
  moveCards(1);
}

function moveCardsBack() {
  moveCards(-1);
}

function moveCards(step) {
  index += step;
  printStudyCard();
  sessionStorage.setItem('indexToPrint', JSON.stringify(index));
  changeCounter();
  changeProgress();
  toggleBtn();
}

function shuffleStudyWords() {
  shuffle(studyWords);
  localStorage.setItem('studyWords', JSON.stringify(studyWords));
  printStudyCard();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

initialize();
