document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('output');
  const userInput = document.getElementById('user-input');
  const submitBtn = document.getElementById('submit-btn');
  const buttonsDiv = document.getElementById('buttons');
  const closeBtn = document.getElementById('close-btn');
  const inputArea = document.getElementById('input-area');

  let state = JSON.parse(localStorage.getItem('marsBotState')) || { step: 0, name: '' };

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
      }
    }

    typeCharacter();
  }

  // Save the current state to localStorage
  function saveState() {
    localStorage.setItem('marsBotState', JSON.stringify(state));
  }

  // Hide input field and submit button
  function hideInputArea() {
    inputArea.classList.add('hidden');
  }

  // Show input area when asking for the name
  function askForName() {
    inputArea.classList.remove('hidden');
    displayMessage("Welcome stranger, how should I call you?");
  }



  // Handle name input and hide input field afterward
  function handleNameInput() {
    state.name = userInput.value.trim();
    if (state.name) {
      saveState();
      userInput.value = '';
      inputArea.classList.add('hidden'); // Hide the input area after entering the name
      displayMessage(`Good to know you, ${state.name}. Ready to settle on Mars?`);

      setButtons([
        { text: 'Huh? Why?', action: showLore },
        { text: 'Hell Yeah', action: promptWalletConnection }
      ]);
    } else {
      displayMessage("Please enter a valid name.");
    }
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

  // Show lore about Mars settlement
  function showLore() {
    displayMessage("Mars settlement is humanity's next great adventure. It's time to take part.");
    setButtons([
      { text: "Ok got it, let's do it", action: promptWalletConnection }
    ]);
  }

  // Prompt wallet connection
  function promptWalletConnection() {
    displayMessage("Let's get you settled! Please connect your wallet to proceed.");
    setButtons([
      { text: 'Connect Wallet', action: mintLandPlot }
    ]);
  }

  // Mint land plot
  function mintLandPlot() {
    displayMessage("Mint your land plot on the Mars globe.");
    setButtons([
      { text: 'Mint Land Plot', action: landMinted }
    ]);
  }

  // After minting land plot
  function landMinted() {
    displayMessage("Congrats! Your land plot is now yours. Time to build your colony.");
  }

  // Event listeners
  submitBtn.addEventListener('click', handleNameInput);
  userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleNameInput();
    }
  });
  closeBtn.addEventListener('click', () => {
    displayMessage("Mars terminal shutting down. See you soon, pioneer.");
    hideInputArea();
    clearButtons();
  });

  // Initial launch logic
  if (state.name) {
    hideInputArea(); // Ensure input field is hidden if name is already set
    displayMessage(`Welcome back, ${state.name}. Ready to continue settling Mars?`);
    setButtons([{ text: 'Continue', action: promptWalletConnection }]);
  } else {
    askForName();
  }
});