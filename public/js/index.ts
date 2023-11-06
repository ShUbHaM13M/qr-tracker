const textInput = document.querySelector('#textInput') as HTMLTextAreaElement
const generateButton = document.querySelector('#generateButton') as HTMLButtonElement;
if (!textInput) {
	throw "Text Input element not found!"
}
if (!generateButton) {
	throw "Generate button element not found!"
}
textInput.addEventListener('input', (e) => {
	const target = e.target as HTMLTextAreaElement
	if (target.value) {
		generateButton.disabled = false
		return
	}
	generateButton.disabled = true
})