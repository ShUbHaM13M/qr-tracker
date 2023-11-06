"use strict";
const textInput = document.querySelector('#textInput');
const generateButton = document.querySelector('#generateButton');
if (!textInput) {
    throw "Text Input element not found!";
}
if (!generateButton) {
    throw "Generate button element not found!";
}
textInput.addEventListener('input', (e) => {
    const target = e.target;
    if (target.value) {
        generateButton.disabled = false;
        return;
    }
    generateButton.disabled = true;
});
