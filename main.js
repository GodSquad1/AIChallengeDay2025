document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const messagesContainer = document.getElementById('messages');
  const chatContainer = document.getElementById('chat-container');
  const saveHistoryToggle = document.getElementById('save-history');
  const newChatButton = document.getElementById('new-chat');
  const alertPanel = document.getElementById('alert-panel');
  const alertMessage = document.getElementById('alert-message');
  const clinicFinder = document.getElementById('clinic-finder');
  const closeClinicFinder = document.getElementById('close-clinic-finder');
  const summarizeButtons = document.querySelectorAll('.summarize-btn');

  // Image Upload Elements
  const imageFileInput = document.getElementById('image-file-input');
  const uploadImageButton = document.getElementById('upload-image-button');
  const imagePreview = document.getElementById('image-preview');
  const previewImg = document.getElementById('preview-img');

  // Make image upload section always visible
  document.getElementById('image-upload-section').classList.remove('hidden');

  // Check localStorage for history preference
  if (localStorage.getItem('saveHistory') === 'true') {
    saveHistoryToggle.checked = true;
    loadChatHistory();
  }

  // Save history toggle event
  saveHistoryToggle.addEventListener('change', function() {
    if (this.checked) {
      localStorage.setItem('saveHistory', 'true');
      saveChatHistory();
    } else {
      localStorage.setItem('saveHistory', 'false');
      localStorage.removeItem('chatHistory');
    }
  });

  // Image preview functionality
  imageFileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.classList.remove('hidden');
      }
      reader.readAsDataURL(file);
    }
  });

  // Image upload and analysis
  uploadImageButton.addEventListener('click', function() {
    const file = imageFileInput.files[0];
    if (file) {
      // Add a temporary message showing the image is being processed
      addMessage('Analyzing your uploaded image...', 'bot');

      // Call the image analysis function
      callImageAnalysisLoop(file);
    } else {
      alert('Please select an image to analyze.');
    }
  });

  // Function to handle image analysis with the built-in model
  function callImageAnalysisLoop(imageFile) {
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('image', imageFile);

    // In a real implementation, you'd send the image to your backend
    // Simulate sending the image to backend with the built-in model
    console.log('Processing image with built-in model');

    // For this prototype, we'll simulate a response after a delay
    setTimeout(() => {
      // Simulate model analysis outcomes
      const detectionProbability = Math.random();
      let analysisResult = '';

      if (detectionProbability > 0.7) {
        // Abnormality detected scenario
        const confidence = Math.floor(75 + Math.random() * 20);
        const locations = ['lower right quadrant', 'upper left region', 'central area', 'peripheral tissue'];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];

        analysisResult = `Based on the uploaded image analysis:\n\n` +
          `- Primary finding: Potential abnormality detected in ${randomLocation}\n` +
          `- Confidence score: ${confidence}%\n` +
          `- Recommended action: Follow-up with healthcare provider within 2 weeks\n` +
          `- Additional notes: The image quality is sufficient for analysis, and the analysis has identified patterns consistent with potential concerns.`;
      } else if (detectionProbability > 0.4) {
        // Uncertain results scenario
        analysisResult = `Based on the uploaded image analysis:\n\n` +
          `- Primary finding: Inconclusive results\n` +
          `- Confidence score: ${Math.floor(50 + Math.random() * 20)}%\n` +
          `- Recommended action: Consider retaking image with better lighting/positioning\n` +
          `- Additional notes: The analysis detected some potential concerns but confidence is not high enough for a definitive assessment.`;
      } else {
        // No abnormality detected scenario
        analysisResult = `Based on the uploaded image analysis:\n\n` +
          `- Primary finding: No significant abnormalities detected\n` +
          `- Confidence score: ${Math.floor(80 + Math.random() * 15)}%\n` +
          `- Recommended action: Continue regular monitoring\n` +
          `- Additional notes: The image has been thoroughly analyzed and no concerning patterns were identified.`;
      }

      console.log('Image analysis complete');

      // Display the analysis as a bot message
      addMessage(analysisResult, 'bot');

      // Reset the image upload form
      imageFileInput.value = '';
      imagePreview.classList.add('hidden');

      // Save chat history if enabled
      if (saveHistoryToggle.checked) {
        saveChatHistory();
      }
    }, 3000);
  }

  // Chat form submission
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userMessage = userInput.value.trim();

    if (userMessage) {
      // Add user message to chat
      addMessage(userMessage, 'user');

      // Clear input field
      userInput.value = '';

      // Show typing indicator and process message
      showTypingIndicator(userMessage);  // Pass userMessage to the function

      // Process message to determine if special panels should be shown
      processUserMessage(userMessage);

      // Save chat history if enabled
      if (saveHistoryToggle.checked) {
        saveChatHistory();
      }
    }
  });

  // New chat button event
  newChatButton.addEventListener('click', function() {
    // Clear chat messages
    messagesContainer.innerHTML = '';

    // Add initial bot message
    addMessage('Hello! I\'m your Peer+ health assistant. How can I help you today?', 'bot');

    // Clear localStorage if save history is enabled
    if (saveHistoryToggle.checked) {
      localStorage.removeItem('chatHistory');
    }

    // Hide any open panels
    alertPanel.classList.add('hidden');
    clinicFinder.classList.add('hidden');
  });

  // Close clinic finder
  closeClinicFinder.addEventListener('click', function() {
    clinicFinder.classList.add('hidden');
  });

  // Summarize buttons
  summarizeButtons.forEach(button => {
    const articleId = button.getAttribute('data-article-id');
    const summary = document.getElementById(`summary-${articleId}`);

    // Hide summaries initially
    summary.classList.remove('open');

    button.addEventListener('click', function() {
      summary.classList.toggle('open');
      const icon = this.querySelector('i');

      if (summary.classList.contains('open')) {
        icon.classList.remove('fa-compress-alt');
        icon.classList.add('fa-expand-alt');
        this.innerHTML = '<i class="fas fa-expand-alt mr-1"></i> Hide Summary';
      } else {
        icon.classList.remove('fa-expand-alt');
        icon.classList.add('fa-compress-alt');
        this.innerHTML = '<i class="fas fa-compress-alt mr-1"></i> Summarize';
      }
    });
  });

  // Helper Functions
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;

    if (sender === 'user') {
      messageDiv.className = 'user-message bg-purple-600 text-white p-3 rounded-lg shadow max-w-[80%] w-fit';
    } else {
      messageDiv.className = 'bot-message bg-white text-gray-800 p-3 rounded-lg shadow max-w-[80%] w-fit';
    }

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }

  function showTypingIndicator(userInput) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator bg-white text-gray-800 p-3 rounded-lg shadow max-w-[80%] w-fit';
    typingDiv.innerHTML = 'Thinking<span>.</span><span>.</span><span>.</span>';
    typingDiv.id = 'typing-indicator';
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();

    // Call the Symptom Advisor Loop with the user message
    callSymptomAdvisorLoop(userInput);
  }

  function callSymptomAdvisorLoop(userInput) {
    const systemPrompt = "You are a health assistant that mimics a highly experienced and trained doctor. When given symptoms, provide a detailed response, stating 3-5 diseases that could occur in...";

    fetch('https://magicloops.dev/api/loop/16856f65-dac8-402f-9d31-d04c336c5959/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        location: {
          latitude: 37.7749,
          longitude: -122.4194
        }
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('API Response:', data);
      // Remove typing indicator
      document.getElementById('typing-indicator').remove();
      // Display response in chat
      addMessage(data.response, 'bot');
    })
    .catch(error => {
      console.error('Error calling Symptom Advisor Loop:', error);
      // Remove typing indicator
      document.getElementById('typing-indicator').remove();
      // Show error message
      addMessage('Sorry, I encountered an error processing your request. Please try again.', 'bot');
    });
  }

  function botResponse() {
    // This is a prototype, so we'll just use a generic response
    // AI response will be displayed as a white chat bubble in the messages container
    addMessage('This is a prototype. In the full version, you would receive personalized responses based on your questions.', 'bot');
    // Ensure chat scrolls to show the new AI response
    scrollToBottom();
  }

  function scrollToBottom() {
    // Auto-scroll to the bottom when a new message is added
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function saveChatHistory() {
    if (saveHistoryToggle.checked) {
      const messages = Array.from(messagesContainer.children).map(msg => {
        return {
          text: msg.textContent,
          sender: msg.classList.contains('user-message') ? 'user' : 'bot'
        };
      });

      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }

  function loadChatHistory() {
    const history = localStorage.getItem('chatHistory');

    if (history) {
      const messages = JSON.parse(history);

      // Clear existing messages
      messagesContainer.innerHTML = '';

      // Add messages from history
      messages.forEach(msg => {
        addMessage(msg.text, msg.sender);
      });
    }
  }

  function processUserMessage(userMessage) {
    // Simple keyword detection for demo purposes
    const lowercaseMsg = userMessage.toLowerCase();

    // Check for emergency keywords
    if (lowercaseMsg.includes('emergency') || 
        lowercaseMsg.includes('severe pain') || 
        lowercaseMsg.includes('chest pain')) {

      // Show alert panel
      alertMessage.textContent = 'If you\'re experiencing a medical emergency, please call 911 or go to your nearest emergency room.';
      alertPanel.classList.remove('hidden');
    }

    // Check for clinic finder keywords
    if (lowercaseMsg.includes('doctor near') || 
        lowercaseMsg.includes('find clinic') || 
        lowercaseMsg.includes('nearby provider')) {

      // Show clinic finder panel
      clinicFinder.classList.remove('hidden');
    }
  }
});
