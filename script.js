'use strict';

const studyModeSidebar = document.querySelector('#study-mode');
const currentWordCounter = document.querySelector('#current-word');
const totalWordCounter = document.querySelector('#total-word');
const shuffleBtn = document.querySelector('#shuffle-words');
const studyProgress = document.querySelector('#words-progress');
const addNewWordBtn = document.querySelector('#add-words');
const removeWordBtn = document.querySelector('#remove-words');

const addWordPage = document.querySelector('.add-word-page');
const engInput = document.querySelector('#eng');
const rusInput = document.querySelector('#rus');
const exampleInput = document.querySelector('#example');
const addBtn = document.querySelector('#add'); 
const notAddBtn = document.querySelector('#not-add');
const modal = document.querySelector('.modal');
const okBtn = document.querySelector('#ok');

const removeWordPage = document.querySelector('#remove-word-page');
const removingTemplate = document.querySelector('#removing');
const removeContent = document.querySelector('.remove-content');
const okRemoveBtn = document.querySelector('#ok-remove');

const studyCards = document.querySelector('.study-cards');
const cardFrontWord = document.querySelector('#card-front h1');
const cardBackWord = document.querySelector('#card-back h1');
const cardBackExample = document.querySelector('#card-back p span');
const cardToStudy = document.querySelector('.flip-card');
const backBtn = document.querySelector('#back');
const nextBtn = document.querySelector('#next');
const examBtn = document.querySelector('#exam');

const examModeSidebar = document.querySelector('#exam-mode');
const correctPercent = document.querySelector('#correct-percent');
const examProgress = document.querySelector('#exam-progress');
const timer = document.querySelector('#time');
let timerId = null;
const restartBtn = document.querySelector('#restart');
const goToLearnBtn = document.querySelector('#go-learn');

const examCards = document.querySelector('#exam-cards');
const statTemplate = document.querySelector('#word-stats');
const resultsModal = document.querySelector('.results-modal');
const resultsContent = document.querySelector('.results-content');
const resultTimer = document.querySelector('#timer');

class Word {
  constructor (engWord, rusWord, example) {
    this.engWord = engWord;
    this.rusWord = rusWord;
    this.example = example;
    this.attempts = 0;
    };  
};

let wordsToLearn = [];
try {
  wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn') || '[]');
} catch (error) {
  console.log(error);
};

if (!wordsToLearn.length) {
  addWordToLearn('juice', 'сок', 'I like orange juice.');
  addWordToLearn( 'sun', 'солнце', 'The sun gives you a good mood when it shines.');
  addWordToLearn('life', 'жизнь','Life is beautiful, the main thing is to notice it!');
  addWordToLearn('dress', 'платье',  'A dress is the best decoration for a girl.');
  addWordToLearn('journey','путешествие','Journey of a lifetime!');
  localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
};

function addWordToLearn(eng, rus, ex) {
  const word = new Word(eng, rus, ex);
  wordsToLearn.push(word);
};

let studyWords = [];
try {
  studyWords = JSON.parse(sessionStorage.getItem('studyWords') || '[]');
} catch (error) {
  console.log(error);
};

if (!studyWords.length) {
  studyWords = [...wordsToLearn];
};

let index = null;
try {
  index = JSON.parse(sessionStorage.getItem('indexToPrint') || '0');
} catch (error) {
  console.log(error);
};

printStudyCard(index);
changeCounter(); 
changeProgress();
toggleBtn(); 

function printStudyCard(index) {
  const word = studyWords[index];
  
  cardFrontWord.textContent = word.engWord;
  cardBackWord.textContent = word.rusWord;
  cardBackExample.textContent = word.example;
};

function changeCounter() {
  currentWordCounter.textContent = index + 1;
  totalWordCounter.textContent = studyWords.length;
};

function changeProgress() {
  studyProgress.value = (index + 1) * 100 / studyWords.length;
};

function toggleBtn() {
  if (index === 0) {
    backBtn.disabled = true;
  };
  if (index !== 0) {
    backBtn.disabled = false;
  };
  if (index === studyWords.length - 1) {
    nextBtn.disabled = true;
  };
  if (index !== studyWords.length - 1) {
    nextBtn.disabled = false;
  };
};

cardToStudy.addEventListener('click', () => {
  cardToStudy.classList.toggle('active');
});

nextBtn.addEventListener('click', moveCardsForvard);
backBtn.addEventListener('click', moveCardsBack);

function moveCardsForvard() {
  moveCards(1);
  changeCounter();
  changeProgress();
  toggleBtn();  
};

function moveCardsBack() {
  moveCards(-1);
  changeCounter();
  changeProgress();
  toggleBtn();  
};

function moveCards(step) {
  cardToStudy.classList.remove('active');  
  index += step;
  printStudyCard(index);
  sessionStorage.setItem('indexToPrint', JSON.stringify(index));  
};


shuffleBtn.addEventListener('click', () => {
  shuffle(studyWords);
  sessionStorage.setItem('studyWords', JSON.stringify(studyWords));
  printStudyCard(index);
});

function shuffle(arr) {  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i +1));
    const storage = arr[j];
    arr[j] = arr[i];
    arr[i] = storage;
  };
  return arr;
};


addNewWordBtn.addEventListener('click', addNewWord);

function addNewWord() {
  showForm();
  
  function showForm() {
    studyCards.classList.add('hidden');
    removeWordPage.classList.add('hidden');
    removeContent.innerHTML = '';
    shuffleBtn.disabled = true; // чтобы случайно не перемешать слова, пока мы их не видим
    addWordPage.classList.remove('hidden');
  };

  addBtn.addEventListener('click', () => {
    const engW = engInput.value;
    const rusW = rusInput.value;
    const example = exampleInput.value;

    if (!(engW && rusW && example)) {
      showModal();
      return;
    };

    addWordToLearn(engW, rusW, example);
    localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));

    studyWords = [...wordsToLearn];
    sessionStorage.setItem('studyWords', JSON.stringify(studyWords)); 

    examWords = makeExamWords(); 
    sessionStorage.setItem('examWords', JSON.stringify(examWords));

    document.location.reload();
  });

  notAddBtn.addEventListener('click', () => {
    addWordPage.classList.add('hidden');
    studyCards.classList.remove('hidden');
    shuffleBtn.disabled = false;
  });

  function showModal() {
    modal.classList.remove('hidden');
    okBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  };
};

removeWordBtn.addEventListener(('click'), showRemoveModal);

function showRemoveModal() {
  printRemoveModal();
  studyCards.classList.add('hidden');
  addWordPage.classList.add('hidden');
  shuffleBtn.disabled = true; 
  removeWordPage.classList.remove('hidden');    
  
  function printRemoveModal() {   
    const fragment = new DocumentFragment();
  
    wordsToLearn.forEach((item) => {   
      fragment.append(makeRowByTemplate(item));
    });
    
    removeContent.append(fragment);
  };

  function makeRowByTemplate(word) { 
    const removeRow = removingTemplate.content.cloneNode(true);
    removeRow.querySelector('.word span').textContent = word.engWord;    
    return removeRow;  
  };


  removeContent.addEventListener(('click'), (event) => {
    if (!event.target.id ==='remove') {
      return;
    };
    const deletedRow = event.target.closest('.word-row');
    const deletedWord = deletedRow.querySelector('.word span').textContent;


    const newArr = wordsToLearn.filter((item) => item.engWord !== deletedWord);
    wordsToLearn = newArr; 
    localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));

    studyWords = [...wordsToLearn];
    sessionStorage.setItem('studyWords', JSON.stringify(studyWords)); 
    
    examWords = makeExamWords();
    sessionStorage.setItem('examWords', JSON.stringify(examWords));
    
    sessionStorage.removeItem('indexToPrint');

    deletedRow.querySelector('.btn-wrapper').innerHTML = '';
  });


  okRemoveBtn.addEventListener(('click'), closeRemoveModal);

  function closeRemoveModal() {
    removeWordPage.classList.add('hidden');
    studyCards.classList.remove('hidden');
    document.location.reload();
  };
};

let examWords = [];
try {
  examWords = JSON.parse(sessionStorage.getItem('examWords') || '[]');
} catch (error) {
  console.log(error);
};

if (!examWords.length) {
  examWords = makeExamWords(); 
  sessionStorage.setItem('examWords', JSON.stringify(examWords));
};

function makeExamWords() {
  const words = [];
  studyWords.forEach((item) => {
    const obj1 = {'examWord': item.engWord};
    const obj2 = {'examWord': item.rusWord};
    words.push(obj1, obj2);
  });
  shuffle(words);
  return words;
};
let isExamModeOn = false;
try {
  isExamModeOn = JSON.parse(sessionStorage.getItem('examModeMark') || 'false');
} catch (error) {
  console.log(error);
};

let fadedCardCounter = 0; 
try {
  fadedCardCounter = JSON.parse(sessionStorage.getItem('fadedCardCounter') || '0');
} catch (error) {
  console.log(error);
};

if (isExamModeOn) {
  switchExamMode();
};

examBtn.addEventListener('click', switchExamMode);

function switchExamMode() {
  studyCards.classList.add('hidden');
  studyModeSidebar.classList.add('hidden');
  examModeSidebar.classList.remove('hidden');
  printExamCards();
  printCorrectPercent();
  runTimer();
  sessionStorage.setItem('examModeMark', JSON.stringify(true));
};

function printExamCards() {
  const fragment = new DocumentFragment();

  examWords.forEach((item) => {
    const cardToExam = document.createElement('div');
    cardToExam.textContent = item.examWord;
    cardToExam.classList.add('card');
    if(item.isFadedOut) { 
      cardToExam.classList.add('faded');
    };
    fragment.append(cardToExam);
  });

  examCards.append(fragment);    
};

let seconds = null;
try {
  seconds = JSON.parse(sessionStorage.getItem('time') || '0');
} catch (error) {
  console.log(error);
};

function runTimer() { 
  timerId = setInterval(() => {
    seconds += 1;
    sessionStorage.setItem('time', JSON.stringify(seconds));
    timer.textContent = getTimeStr(seconds);
  }, 1000);
};

function getTimeStr(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;

  const addZero = (unit) => {
    if (unit < 10) {
      return `0${unit}`;
    } else {
      return `${unit}`;
    };
  };

  return addZero(m) + ':' + addZero(s);
};


restartBtn.addEventListener('click', restartExamMode);

function restartExamMode() {
  reset();
  switchExamMode();
};

function reset() {
 
  clearInterval(timerId);
  seconds = 0;
  examCards.innerHTML = "";
  clearStorage();

  removeStatMarks();  
  
  examWords = makeExamWords();  
  
  fadedCardCounter = 0;


  resultsModal.classList.add('hidden');
  resultsContent.innerHTML = '';
};

goToLearnBtn.addEventListener('click', restartLearnMode);

function restartLearnMode() {
  reset();
  switchLearnMode();
};

function switchLearnMode() {
  studyCards.classList.remove('hidden');
  examCards.innerHTML = '';
  studyModeSidebar.classList.remove('hidden');
  examModeSidebar.classList.add('hidden');  
};


let isCardSelected = false;
let isCardWrong = false;
let firstCard = null;
let secondCard = null;

examCards.addEventListener('click', (event) => {

  if (event.target.className !== 'card') {
    return;
  };

  if (isCardWrong) {
    return;
  };
  
  if (!isCardSelected) {
    firstCard = event.target;    
    firstCard.classList.add('correct');
    isCardSelected = true;
    countAttempts(firstCard.textContent);
  } else {
    secondCard = event.target;
    if (checkAnswer(firstCard.textContent, secondCard.textContent)) {
      fadeOutWord(firstCard.textContent); 
      fadeOutWord(secondCard.textContent);
      secondCard.classList.add('correct', 'fade-out');
      firstCard.classList.add('fade-out');      
      fadedCardCounter += 2; 
      sessionStorage.setItem('fadedCardCounter', JSON.stringify(fadedCardCounter));
      printCorrectPercent();
      isCardSelected = false;
      if (fadedCardCounter === examWords.length) {
        finishExam();
      };
    } else {
      secondCard.classList.add('wrong');
      isCardWrong = true;
      setTimeout(() => {
        secondCard.classList.remove('wrong');
        firstCard.classList.remove('correct');
        isCardSelected = false;
        isCardWrong = false;
      }, 500);            
    };
  };
});

function fadeOutWord(text) {
  examWords.forEach((item) => {
    if(text === item.examWord) {
      item.isFadedOut = true;
      sessionStorage.setItem('examWords', JSON.stringify(examWords));
    };
  });  
};

function checkAnswer(word1, word2) {
  for (let word of wordsToLearn) {
    if (word1 === word.engWord && word2 === word.rusWord) {          
      return true;
    } else if (word1 === word.rusWord && word2 === word.engWord) {
      return true;
    };      
  };
  return false;
};

function countAttempts(word) {
  studyWords.forEach((item) => {
    if (word === item.engWord || word === item.rusWord) {
      item.attempts += 1;
      sessionStorage.setItem('studyWords', JSON.stringify(studyWords));
    };
  });
};

function printCorrectPercent() {
  const percent = Math.round(fadedCardCounter / examWords.length * 100);
  correctPercent.textContent = `${percent}%`;
  examProgress.value = percent;
};

function finishExam() {
  clearInterval(timerId);
  clearStorage();
  printStat();
  removeStatMarks();  
};

function clearStorage() {
  sessionStorage.removeItem('time');
  sessionStorage.removeItem('studyWords');
  sessionStorage.removeItem('fadedCardCounter');
  sessionStorage.removeItem('examModeMark');
  sessionStorage.removeItem('indexToPrint');
  sessionStorage.removeItem('examWords');
};

function removeStatMarks() {
  studyWords.forEach((item) => item.attempts = 0);  
  sessionStorage.setItem('studyWords', JSON.stringify(studyWords));
};
