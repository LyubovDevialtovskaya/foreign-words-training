'use strict';

const elements = {
  studyModeSidebar: document.querySelector('#study-mode'),
  currentWordCounter: document.querySelector('#current-word'),
  totalWordCounter: document.querySelector('#total-word'),
  shuffleBtn: document.querySelector('#shuffle-words'),
  studyProgress: document.querySelector('#words-progress'),
  addNewWordBtn: document.querySelector('#add-words'),
  removeWordBtn: document.querySelector('#remove-words'),
  addWordPage: document.querySelector('.add-word-page'),
  removeWordPage: document.querySelector('#remove-word-page'),
  engInput: document.querySelector('#eng'),
  rusInput: document.querySelector('#rus'),
  exampleInput: document.querySelector('#example'),
  studyCards: document.querySelector('.study-cards'),
  cardFrontWord: document.querySelector('#card-front h1'),
  cardBackWord: document.querySelector('#card-back h1'),
  cardBackExample: document.querySelector('#card-back p span'),
  cardToStudy: document.querySelector('.flip-card'),
  backBtn: document.querySelector('#back'),
  nextBtn: document.querySelector('#next'),
  examBtn: document.querySelector('#exam'),
  examModeSidebar: document.querySelector('#exam-mode'),
  correctPercent: document.querySelector('#correct-percent'),
  examProgress: document.querySelector('#exam-progress'),
  timer: document.querySelector('#time'),
  restartBtn: document.querySelector('#restart'),
  goToLearnBtn: document.querySelector('#go-learn'),
  examCards: document.querySelector('#exam-cards')
};

// Classes
class Word {
  constructor(engWord, rusWord, example) {
    this.engWord = engWord;
    this.rusWord = rusWord;
    this.example = example;
    this.attempts = 0;
  }
}

// State variables
let wordsToLearn = [];
let studyWords = [];
let examWords = [];
let index = 0;
let timerId = null;
let isExamModeOn = false;
let fadedCardCounter = 0;
let seconds = 0;

// Event listeners
elements.cardToStudy.addEventListener('click', toggleCard);
elements.nextBtn.addEventListener('click', moveCardsForward);
elements.backBtn.addEventListener('click', moveCardsBack);
elements.shuffleBtn.addEventListener('click', shuffleStudyWords);
elements.addNewWordBtn.addEventListener('click', showAddWordForm);
elements.removeWordBtn.addEventListener('click', showRemoveWordForm);
elements.goToLearnBtn.addEventListener('click', restartLearnMode);
elements.examBtn.addEventListener('click', switchExamMode);
elements.restartBtn.addEventListener('click', restartExamMode);

// Functions
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
    wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn')) || [];
    studyWords = JSON.parse(sessionStorage.getItem('studyWords')) || [];
    examWords = JSON.parse(sessionStorage.getItem('examWords')) || [];
  } catch (error) {
    console.error(error);
  }

  if (!wordsToLearn.length) {
    addDefaultWords();
  }

  if (!studyWords.length) {
    studyWords = [...wordsToLearn];
  }
}

function addDefaultWords() {
  addWordToLearn('juice', 'сок', 'I like orange juice.');
  addWordToLearn('sun', 'солнце', 'The sun gives you a good mood when it shines.');
  addWordToLearn('life', 'жизнь', 'Life is beautiful, the main thing is to notice it!');
  addWordToLearn('dress', 'платье', 'A dress is the best decoration for a girl.');
  addWordToLearn('journey', 'путешествие', 'Journey of a lifetime!');
  localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
}

function initializeIndex() {
  try {
    index = JSON.parse(sessionStorage.getItem('indexToPrint')) || 0;
  } catch (error) {
    console.error(error);
  }
}

function addWordToLearn(eng, rus, ex) {
  const word = new Word(eng, rus, ex);
  wordsToLearn.push(word);
}

function printStudyCard() {
  const word = studyWords[index];
  elements.cardFrontWord.textContent = word.engWord;
  elements.cardBackWord.textContent = word.rusWord;
  elements.cardBackExample.textContent = word.example;
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
  sessionStorage.setItem('studyWords', JSON.stringify(studyWords));
  printStudyCard();
}

function showAddWordForm() {
  elements.studyCards.classList.add('hidden');
  elements.removeWordPage.classList.add('hidden');
  elements.shuffleBtn.disabled = true;
  elements.addWordPage.classList.remove('hidden');
}

function showRemoveWordForm() {
  elements.studyCards.classList.add('hidden');
  elements.addWordPage.classList.add('hidden');
  elements.shuffleBtn.disabled = true;
  elements.removeWordPage.classList.remove('hidden');
}

function restartLearnMode() {
  sessionStorage.removeItem('indexToPrint');
  window.location.reload();
}

function switchExamMode() {
  sessionStorage.setItem('indexToPrint', JSON.stringify(0));
  window.location.href = './exam.html'; 
}

function restartExamMode() {
  clearInterval(timerId);
  sessionStorage.removeItem('time');
  sessionStorage.removeItem('fadedCardCounter');
  sessionStorage.removeItem('examModeMark');
  sessionStorage.removeItem('indexToPrint');
  sessionStorage.removeItem('examWords');
  window.location.reload();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
