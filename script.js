const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');
const historyList = document.getElementById('history-list');
const buttons = document.querySelectorAll('.btn');
const historyBtn = document.getElementById('history-btn');
const historyPanel = document.getElementById('history-panel');
const closeBtn = document.getElementById('close-btn');

let currentInput = '';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// Загрузка истории при старте
updateHistoryDisplay();
updateHistoryPanel();

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');

        if (value) {
            currentInput += value;
            resultDisplay.textContent = currentInput;
        } else if (action === 'operator') {
            // Заменяем символы для eval
            let operator = button.textContent;
            if (operator === '×') operator = '*';
            if (operator === '/') operator = '/';
            if (operator === '+') operator = '+';
            if (operator === '-') operator = '-';
            currentInput += operator;
            resultDisplay.textContent = currentInput;
        } else if (action === 'clear') {
            currentInput = '';
            resultDisplay.textContent = '0';
        } else if (action === 'equals') {
            try {
                // Проверяем корректность выражения
                const result = eval(currentInput);
                // Проверяем, является ли результат числом и конечным
                if (typeof result === 'number' && isFinite(result)) {
                    resultDisplay.textContent = result;
                    history.push(`${currentInput} = ${result}`);
                    localStorage.setItem('calcHistory', JSON.stringify(history));
                    updateHistoryDisplay();
                    updateHistoryPanel();
                    currentInput = result.toString();
                }
                // Если результат некорректен (NaN, Infinity), ничего не делаем
            } catch (e) {
                // При ошибке (например, синтаксической) ничего не меняем
            }
        }
    });
});

// Открытие/закрытие панели
historyBtn.addEventListener('click', () => {
    historyPanel.classList.add('open');
});

closeBtn.addEventListener('click', () => {
    historyPanel.classList.remove('open');
});

// Обновление истории на экране (последний результат)
function updateHistoryDisplay() {
    if (history.length > 0) {
        historyDisplay.textContent = history[history.length - 1];
    } else {
        historyDisplay.textContent = '';
    }
}

// Обновление полной истории в боковой панели
function updateHistoryPanel() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}
