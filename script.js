// LINKING HTML ELEMENTS | CONSTANT VARIABLES WILL NOT BE CHANGED BY THE PROGRAM
const htmlInput = document.getElementById('html-code');
const cssInput = document.getElementById('css-code');
const jsInput = document.getElementById('js-code');
const runButton = document.getElementById('run-Btn');
const previewFrame = document.getElementById('preview');
const consoleOutput = document.getElementById('console-output');
const autoRunToggle = document.getElementById('auto-run-toggle');
const saveButton = document.getElementById('save-Btn');      // SAVE BUTTON
const loadButton = document.getElementById('load-Btn');      // LOAD BUTTON

// LISTENING FOR CONSOLE LOGS FROM THE IFRAME
window.addEventListener('message', function (event) {
  if (event.data.type === 'console') {
    const logLine = document.createElement('div');
    logLine.textContent = '> ' + event.data.message;
    consoleOutput.appendChild(logLine);
  }
});

// MAIN FUNCTION TO RUN USER CODE
function runCode() {
  const html = htmlInput.value;

  const css = `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: white; }
    ${cssInput.value}
  </style>`;

  consoleOutput.innerHTML = '<p><strong>Console:</strong></p>';

  const js = `<script>
    window.console.log = function(...args) {
      parent.postMessage({
        type: 'console',
        message: args.join(' ')
      }, '*');
    };

    ${jsInput.value}
  <\\/script>`;

  const completeCode = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${css}
      </head>
      <body>
        ${html}
        ${js}
      </body>
    </html>
  `;

  const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(completeCode);
  iframeDoc.close();
}

// EVENT LISTENER FOR MANUAL RUN BUTTON
runButton.addEventListener('click', runCode);

// AUTO-RUN ON INPUT
[htmlInput, cssInput, jsInput].forEach(input => {
  input.addEventListener('input', () => {
    if (autoRunToggle.checked) {
      runCode();
    }
  });
});

// FUNCTION TO UPDATE LINE NUMBERS FOR A TEXTAREA
function updateLineNumbers(textarea, lineNumberBox) {
  const lines = textarea.value.split('\n').length;
  let lineHTML = '';
  for (let i = 1; i <= lines; i++) {
    lineHTML += i + '<br>';
  }
  lineNumberBox.innerHTML = lineHTML;
}

// INITIALIZE LINE NUMBER SUPPORT FOR EACH EDITOR
document.querySelectorAll('.editor-container').forEach(container => {
  const textarea = container.querySelector('textarea');
  const lineNumbers = container.querySelector('.line-numbers');

  // Initial line count
  updateLineNumbers(textarea, lineNumbers);

  // Update on input
  textarea.addEventListener('input', () => {
    updateLineNumbers(textarea, lineNumbers);
  });

  // Sync scroll position
  textarea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = textarea.scrollTop;
  });
});

// SAVE USER CODE TO LOCAL STORAGE
saveButton.addEventListener('click', () => {
  localStorage.setItem('saved-html', htmlInput.value);
  localStorage.setItem('saved-css', cssInput.value);
  localStorage.setItem('saved-js', jsInput.value);
  alert('Code saved locally.');
});

// LOAD USER CODE FROM LOCAL STORAGE
loadButton.addEventListener('click', () => {
  htmlInput.value = localStorage.getItem('saved-html') || '';
  cssInput.value = localStorage.getItem('saved-css') || '';
  jsInput.value = localStorage.getItem('saved-js') || '';

  // Trigger line number update
  document.querySelectorAll('.editor-container').forEach(container => {
    const textarea = container.querySelector('textarea');
    const lineNumbers = container.querySelector('.line-numbers');
    updateLineNumbers(textarea, lineNumbers);
  });

  runCode();
});
