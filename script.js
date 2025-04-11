// script.js
class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = (prev / 100) * current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    calculatePercentage() {
        const value = parseFloat(this.currentOperand);
        if (isNaN(value)) return;
        
        if (this.previousOperand === '') {
            // Simple percentage calculation
            this.currentOperand = (value / 100).toString();
        } else {
            // Percentage of previous value
            const prev = parseFloat(this.previousOperand);
            this.currentOperand = ((prev * value) / 100).toString();
        }
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        if (number === 'Error') return 'Error';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-number'));
            });
        });

        // Operation buttons
        document.querySelectorAll('[data-operation]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.getAttribute('data-operation'));
            });
        });

        // Equals button
        document.querySelector('[data-equals]').addEventListener('click', () => {
            this.compute();
        });

        // Clear button
        document.querySelector('[data-action="clear"]').addEventListener('click', () => {
            this.clear();
        });

        // Delete button
        document.querySelector('[data-action="delete"]').addEventListener('click', () => {
            this.delete();
        });

        // Percentage button
        document.querySelector('[data-action="%"]').addEventListener('click', () => {
            this.calculatePercentage();
        });

        // Keyboard support
        document.addEventListener('keydown', event => {
            if (/[0-9]/.test(event.key)) {
                this.appendNumber(event.key);
            } else if (event.key === '.') {
                this.appendNumber('.');
            } else if (event.key === '+') {
                this.chooseOperation('+');
            } else if (event.key === '-') {
                this.chooseOperation('-');
            } else if (event.key === '*') {
                this.chooseOperation('×');
            } else if (event.key === '/') {
                this.chooseOperation('÷');
            } else if (event.key === '%') {
                this.calculatePercentage();
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                this.compute();
            } else if (event.key === 'Backspace') {
                event.preventDefault();
                this.delete();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                this.clear();
            }
        });
    }
}

// Modal functionality
const modal = document.getElementById('info-modal');
const infoBtn = document.getElementById('info-btn');
const closeBtn = document.getElementsByClassName('close')[0];

infoBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
});