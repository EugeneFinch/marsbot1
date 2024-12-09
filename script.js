document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('output');
  const userInput = document.getElementById('user-input');
  const submitBtn = document.getElementById('submit-btn');
  const buttonsDiv = document.getElementById('buttons');
  const closeBtn = document.getElementById('close-btn');
  const rebootOptions = document.getElementById('reboot-options');
  const rebootContinueBtn = document.getElementById('reboot-continue-btn');
  const rebootNewBtn = document.getElementById('reboot-new-btn');
  const inputArea = document.getElementById('input-area');

  let state = JSON.parse(localStorage.getItem('marsBotState')) || { step: 0, name: '' };
  let answers = JSON.parse(localStorage.getItem('userAnswers')) || {};

  // Function to simulate typing animation
  function displayMessage(message) {
    output.innerHTML = '';
    const typingSpan = document.createElement('span');
    typingSpan.classList.add('typing');
    output.appendChild(typingSpan);

    let index = 0;
    function typeCharacter() {
      if (index < message.length) {
        typingSpan.textContent += message[index];
        index++;
        setTimeout(typeCharacter, 50);
      } else {
        typingSpan.classList.remove('typing');
      }
    }

    typeCharacter();
  }

  // Save the current state to localStorage
  function saveState() {
    localStorage.setItem('marsBotState', JSON.stringify(state));
  }

  // Save user answers to localStorage
  function saveAnswer(key, value) {
    answers[key] = value;
    localStorage.setItem('userAnswers', JSON.stringify(answers));
  }

  // Clear button options
  function clearButtons() {
    buttonsDiv.innerHTML = '';
    buttonsDiv.classList.add('hidden');
  }

  // Display buttons for user choices
  function setButtons(options) {
    clearButtons();
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option.text;
      btn.addEventListener('click', option.action);
      buttonsDiv.appendChild(btn);
    });
    buttonsDiv.classList.remove('hidden');
  }

  // Show input area when asking for the name
  function askForName() {
    inputArea.classList.remove('hidden');
    submitBtn.classList.remove('hidden');
    displayMessage("Welcome stranger, how should I call you?");
  }

  // Handle name input and hide input field afterward
  function handleNameInput() {
    state.name = userInput.value.trim();
    if (state.name) {
      saveState();
      userInput.value = '';
      
      const inputArea = document.getElementById('input-area');
      inputArea.classList.add('hidden');
      
      // Force redraw
      inputArea.offsetHeight; 

      displayMessage(`Good to know you, ${state.name}. Ready to settle on Mars?`);

      setButtons([
        { text: 'Huh? Why?', action: showLore },
        { text: 'Hell Yeah', action: promptWalletConnection }
      ]);
    } else {
      displayMessage("Please enter a valid name.");
    }
  }

  // Show lore about Mars settlement
  function showLore() {
    displayMessage("Mars settlement is humanity's next great adventure. It's time to take part.");
    saveAnswer('selectedOption', 'showLore');
    setButtons([
      { text: "Ok got it, let's do it", action: promptWalletConnection },
      { text: "Nah, another time", action: shutdownBot }
    ]);
  }

  // Prompt wallet connection
  function promptWalletConnection() {
    displayMessage("Let's get you settled! Please connect your wallet to proceed.");
    saveAnswer('selectedOption', 'promptWalletConnection');
    setButtons([
      { text: 'Connect Wallet', action: mintLandPlot },
      { text: 'Do it Later', action: shutdownBot }
    ]);
  }

  // Mint land plot
  function mintLandPlot() {
    displayMessage("Mint your land plot on the Mars globe.");
    saveAnswer('selectedOption', 'mintLandPlot');
    setButtons([
      { text: 'Mint Land Plot', action: landMinted },
      { text: 'Do it Later', action: shutdownBot }
    ]);
  }

  // After minting land plot
  function landMinted() {
    displayMessage("Congrats, Ser! Your land plot is now yours. Now it’s time to start building on your land to settle it fully. To build, you need Colony Tokens.");
    saveAnswer('landMinted', true);
    setButtons([
      { text: 'Buy Tokens on DEX', action: buyTokens },
      { text: 'Wait to Earn Tokens', action: waitForTokens }
    ]);
  }

  // Redirect to buy tokens on DEX
  function buyTokens() {
    displayMessage("Redirecting to the DEX to buy Colony Tokens...");
    saveAnswer('selectedOption', 'buyTokens');
    window.open('https://example-dex.com', '_blank');
  }

  // Wait to earn tokens over time
  function waitForTokens() {
    displayMessage("You will earn 1 Colony Token per day. Your next token will be available tomorrow.");
    saveAnswer('selectedOption', 'waitForTokens');
  }

  // Shut down the bot
  function shutdownBot() {
    displayMessage("Mars terminal shutting down. See you soon, pioneer.");
    setTimeout(() => {
      document.getElementById('mars-bot').classList.add('hidden');
    }, 1500);
  }

  // Event listeners
  submitBtn.addEventListener('click', handleNameInput);
  userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleNameInput();
    }
  });
  
  closeBtn.addEventListener('click', shutdownBot);

  // Initial launch logic
  if (state.name) {
    inputArea.classList.add('hidden'); // Hide input area if the name exists
    displayMessage(`Welcome back, ${state.name}. Ready to continue settling Mars?`);
    setButtons([{ text: 'Continue', action: promptWalletConnection }]);
  } else {
    askForName(); // Prompt the user for their name
  }
});