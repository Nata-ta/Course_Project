let fields = document.querySelectorAll('.field__file');
Array.prototype.forEach.call(fields, function (input) {
    let label = input.nextElementSibling,
        labelVal = label.querySelector('.field__file-fake').innerText;

    input.addEventListener('change', function (e) {
        let countFiles = '';
        if (this.files && this.files.length >= 1)
            countFiles = this.files.length;

        if (countFiles)
            label.querySelector('.field__file-fake').innerText = 'Choosen files: ' + countFiles;
        else
            label.querySelector('.field__file-fake').innerText = labelVal;
    });
});

let mainForm = document.createElement('form');

const onFormSubmit = (e) => {
    console.log('working');
}

mainForm.innerHTML = `

`;

mainForm.addEventListener('submit', onFormSubmit);

document.body.appendChild(mainForm);