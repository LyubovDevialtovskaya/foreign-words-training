document.addEventListener('DOMContentLoaded', function() {
    const studyMode = document.getElementById('study-mode');
    const examMode = document.getElementById('exam-mode');
    const shuffleButton = document.getElementById('shuffle-words');
    const studyCards = document.querySelector('.study-cards');
    const examCards = document.getElementById('exam-cards');
    const flipCards = document.querySelectorAll('.flip-card');
    const backBtn = document.getElementById('back');
    const nextBtn = document.getElementById('next');
    const examBtn = document.getElementById('exam');
  
    let currentWordIndex = 1;
  
  
    function toggleModes() {
      studyMode.classList.toggle('hidden');
      examMode.classList.toggle('hidden');
    }
  
    function shuffleCards() {
      const cardsArray = Array.from(flipCards);
      cardsArray.forEach(card => studyCards.appendChild(card));
    }
  
    function flipCard() {
      this.classList.toggle('active');
    }
  
    
    function handleBackButtonClick() {
      if (currentWordIndex > 1) {
        currentWordIndex--;
        updateWordDisplay();
      }
    }
  
   
    function handleNextButtonClick() {
      if (currentWordIndex < flipCards.length) {
        currentWordIndex++;
        updateWordDisplay();
      }
    }
  
    function updateWordDisplay() {
      document.getElementById('current-word').textContent = currentWordIndex;
      flipCards.forEach((card, index) => {
        if (index + 1 === currentWordIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
  
      backBtn.disabled = currentWordIndex === 1;
      nextBtn.disabled = currentWordIndex === flipCards.length;
    }
  
    
    function startExam() {
      toggleModes();
      shuffleCards();
      examBtn.removeEventListener('click', startExam);
      examCards.innerHTML = '';
      flipCards.forEach(card => {
        const clonedCard = card.cloneNode(true);
        clonedCard.classList.remove('active');
        examCards.appendChild(clonedCard);
        clonedCard.addEventListener('click', handleExamCardClick);
      });
    }
  
    function handleExamCardClick() {
      const selectedCard = this;
      const selectedWord = selectedCard.querySelector('#card-front h1').textContent.trim();
      const selectedDefinition = selectedCard.querySelector('#card-back h1').textContent.trim();
  
      if (selectedCard.classList.contains('correct')) return;
  
      selectedCard.classList.add('active');
  
      const correctCard = examCards.querySelector('.correct');
  
      if (!correctCard) {
        selectedCard.classList.add('correct');
      } else {
        if (selectedWord === correctCard.querySelector('#card-back h1').textContent.trim()) {
          selectedCard.classList.add('fade-out');
          correctCard.classList.add('fade-out');
          setTimeout(() => {
            selectedCard.remove();
            correctCard.remove();
            checkExamCompletion();
          }, 500);
        } else {
          selectedCard.classList.add('wrong');
          setTimeout(() => {
            selectedCard.classList.remove('active', 'wrong');
            correctCard.classList.remove('active', 'correct');
          }, 500);
        }
      }
    }
  
    function checkExamCompletion() {
      const remainingCards = examCards.querySelectorAll('.flip-card');
      if (remainingCards.length === 0) {
        alert('Поздравляем! Вы успешно завершили проверку знаний.');
      }
    }

    shuffleButton.addEventListener('click', shuffleCards);
    flipCards.forEach(card => card.addEventListener('click', flipCard));
    backBtn.addEventListener('click', handleBackButtonClick);
    nextBtn.addEventListener('click', handleNextButtonClick);
    examBtn.addEventListener('click', startExam);
  });
  