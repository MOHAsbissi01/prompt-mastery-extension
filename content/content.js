const LABELS = ["Task:", "Context:", "Constraints:", "Output format:"];
let templateActive = false;

/**
 * 1. UI Creation: Injects the "Magic" button near the send button
 */
function injectToggleButton() {
  if (document.querySelector('#prompt-pro-toggle')) return;

  const sendButton = document.querySelector('#composer-submit-button') || 
                     document.querySelector('[data-testid="send-button"]') ||
                     document.querySelector('button[aria-label="Send prompt"]');

  if (sendButton) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'prompt-pro-toggle';
    toggleBtn.innerHTML = '✨'; // Sparkle icon
    toggleBtn.title = "Apply TCREI Structure";
    toggleBtn.type = "button";
    
    // Insert it right before the send button
    sendButton.parentNode.insertBefore(toggleBtn, sendButton);

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      templateActive = !templateActive;
      applyTemplateState();
    });
  }
}

function applyTemplateState() {
  const promptBox = document.querySelector('#prompt-textarea') || 
                    document.querySelector('div[contenteditable="true"]');
  if (!promptBox) return;

  if (templateActive) {
    const template = LABELS.map(label => `<div><span class="prompt-pro-label">${label}</span>&nbsp;</div>`).join('');
    promptBox.innerHTML = template;
  } else {
    promptBox.innerHTML = "<div><br></div>";
  }
}

/**
 * 2. Background Safety: Forces the send button to stay active
 */
function forceEnableSend() {
  const sendButton = document.querySelector('#composer-submit-button') || 
                     document.querySelector('[data-testid="send-button"]') ||
                     document.querySelector('button[aria-label="Send prompt"]');
  
  if (sendButton && sendButton.hasAttribute('disabled')) {
    sendButton.removeAttribute('disabled');
    sendButton.style.opacity = "1"; 
    sendButton.style.cursor = "pointer";
    sendButton.setAttribute("aria-disabled", "false");
  }
}

/**
 * 3. Cleaning logic on submission
 */
function handleSubmission(e) {
  const promptBox = document.querySelector('#prompt-textarea') || 
                    document.querySelector('div[contenteditable="true"]');
  if (!promptBox) return;

  if ((e.type === 'keydown' && e.key === 'Enter' && !e.shiftKey) || e.type === 'click') {
    // Only clean if the template was actually active
    if (templateActive) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = promptBox.innerHTML;
      const lines = tempDiv.innerText.split('\n');
      const cleaned = lines.filter(line => {
        return LABELS.some(label => line.startsWith(label) && line.replace(label, "").trim().length > 0);
      }).join('\n');

      if (cleaned !== "") {
        promptBox.innerText = cleaned;
      }
      templateActive = false; // Reset after sending
    }
  }
}

window.addEventListener('keydown', handleSubmission, true);
document.addEventListener('click', (e) => {
  if (e.target.closest('#composer-submit-button, [data-testid="send-button"]')) {
    handleSubmission(e);
  }
}, true);

// Background Loop
setInterval(() => {
  injectToggleButton();
  forceEnableSend();
}, 1000);