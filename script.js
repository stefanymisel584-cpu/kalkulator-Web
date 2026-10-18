
const display = document.getElementById("display");

let expression = "";
let finished = false;

function updateDisplay() {
    display.value = expression || "0";
}

function appendNumber(number) {
    if (finished) {
        expression = "";
        finished = false;
    }

    expression += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (!expression || finished && operator === "=") return;

    finished = false;

    if (/[+\-*/.]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }

    expression += operator;
    updateDisplay();
}

function appendDecimal() {
    if (finished) {
        expression = "";
        finished = false;
    }

    const currentNumber = expression.split(/[+\-*/]/).pop();

    if (!currentNumber.includes(".")) {
        expression += currentNumber === "" ? "0." : ".";
    }

    updateDisplay();
}

function clearDisplay() {
    expression = "";
    finished = false;
    updateDisplay();
}

function deleteLast() {
    if (finished) {
        expression = "";
        finished = false;
    } else {
        expression = expression.slice(0, -1);
    }

    updateDisplay();
}

function calculate() {
    if (!expression) return;

    try {
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error("Ekspresi tidak valid");
        }

        if (/[+\-*/.]$/.test(expression)) {
            throw new Error("Ekspresi belum lengkap");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Hasil tidak valid");
        }

        expression = String(
            Number(result.toPrecision(12))
        );

        finished = true;
        updateDisplay();
    } catch (error) {
        display.value = "Error";
        expression = "";
        finished = true;
    }
}

document.addEventListener("keydown", function(event) {
    if (/^[0-9]$/.test(event.key)) {
        appendNumber(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        appendOperator(event.key);
    } else if (event.key === ".") {
        appendDecimal();
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteLast();
    } else if (event.key === "Escape") {
        clearDisplay();
    }
});

updateDisplay();
