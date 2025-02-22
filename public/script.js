document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.question__form');
    forms.forEach(form => {
        form.addEventListener('submit', submitHandler);
    });
});

function submitHandler(e) {
    e.preventDefault();
    const form = e.target;
    const correctAnswer = form.querySelector('input[data-correct="true"]');
    const selectedAnswer = form.querySelector('input:checked');

    if (!correctAnswer) {
        console.error('Correct answer not found');
        return;
    }

    if (selectedAnswer && selectedAnswer !== correctAnswer) {
        selectedAnswer.parentElement.classList.add('answer--incorrect');
    }

    correctAnswer.parentElement.classList.add('answer--correct');

    form.querySelectorAll('input').forEach(input => input.setAttribute('disabled', 'disabled'));
    form.querySelector('button')?.setAttribute('disabled', 'disabled');
}