const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

updateHistoryDisplay();

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');

        if (value) {
            currentInput += value;
            resultDisplay.textContent = currentInput;
        } else if (action === 'operator') {
            currentInput += button.textContent;
            resultDisplay.textContent = currentInput;
        } else if (action === 'clear') {
            currentInput = '';
            resultDisplay.textContent = '0';
        } else if (action === 'equals') {
            try {
                const result = eval(currentInput);
                resultDisplay.textContent = result;
                history.push(`${currentInput} = ${result}`);
                localStorage.setItem('calcHistory', JSON.stringify(history));
                updateHistoryDisplay();
                currentInput = result.toString();
            } catch (error) {
                resultDisplay.textContent = 'Ошибка';
                currentInput = '';
            }
        }
    });
});

function updateHistoryDisplay() {
    if (history.length > 0) {
        historyDisplay.textContent = history[history.length - 1];
    } else {
        historyDisplay.textContent = '';
    }
}
