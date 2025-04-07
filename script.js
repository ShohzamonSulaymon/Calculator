const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');
const historyList = document.getElementById('history-list');
const buttons = document.querySelectorAll('.btn');
const historyBtn = document.getElementById('history-btn');
const historyPanel = document.getElementById('history-panel');
const closeBtn = document.getElementById('close-btn');

let currentInput = '';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

updateHistoryDisplay();
updateHistoryPanel();

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');

        if (value) {
            const lastOperatorIndex = Math.max(
                currentInput.lastIndexOf('+'),
                currentInput.lastIndexOf('-'),
                currentInput.lastIndexOf('*'),
                currentInput.lastIndexOf('/')
            );
            const currentSegment = lastOperatorIndex === -1 ? currentInput : currentInput.slice(lastOperatorIndex + 1);
            const digitCount = (currentSegment.match(/\d/g) || []).length;

            if ((!isNaN(value) && digitCount < 10) || value === '(' || value === ')' || value === '.') {
                if (value === '(') {
                    if (currentInput.length > 0) {
                        const lastChar = currentInput[currentInput.length - 1];
                        if (/\d/.test(lastChar)) {
                            currentInput += '*(';
                        } else {
                            currentInput += '(';
                        }
                    } else {
                        currentInput += '(';
                    }
                } else {
                    if (value === '.' && currentSegment.includes('.')) {
                        // Не добавляем вторую точку в одном сегменте
                    } else {
                        currentInput += value;
                        if (!isNaN(value) && currentInput.length > 1) {
                            const secondLastChar = currentInput[currentInput.length - 2];
                            if (secondLastChar === ')') {
                                currentInput = currentInput.slice(0, -1) + '*' + value;
                            }
                        }
                    }
                }

                resultDisplay.textContent = currentInput;
            }
        } else if (action === 'operator') {
            let operator = button.textContent;
            if (operator === '×') operator = '*';
            if (operator === '÷') operator = '/';
            if (operator === '+') operator = '+';
            if (operator === '-') operator = '-';

            if (currentInput.length > 0) {
                const lastChar = currentInput[currentInput.length - 1];
                if (['+', '-', '*', '/'].includes(lastChar)) {
                    currentInput = currentInput.slice(0, -1) + operator;
                } else {
                    currentInput += operator;
                }
            } else {
                currentInput += operator;
            }

            resultDisplay.textContent = currentInput;
        } else if (action === 'clear') {
            currentInput = currentInput.slice(0, -1);
            resultDisplay.textContent = currentInput || '0';
        } else if (action === 'equals') {
            try {
                const result = eval(currentInput);
                if (typeof result === 'number' && isFinite(result)) {
                    resultDisplay.textContent = result;
                    history.push(`${currentInput} = ${result}`);
                    localStorage.setItem('calcHistory', JSON.stringify(history));
                    updateHistoryDisplay();
                    updateHistoryPanel();
                    currentInput = result.toString();
                }
            } catch (e) {
            }
        }
    });
});

historyBtn.addEventListener('click', () => {
    historyPanel.classList.add('open');
});

closeBtn.addEventListener('click', () => {
    historyPanel.classList.remove('open');
});

function updateHistoryDisplay() {
    if (history.length > 0) {
        historyDisplay.textContent = history[history.length - 1];
    } else {
        historyDisplay.textContent = '';
    }
}

function updateHistoryPanel() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}