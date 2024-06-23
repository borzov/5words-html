// app.js

// Загружаем словарь асинхронно при загрузке страницы
let words = [];
fetch('dictionary.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(text => {
        words = text.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length === 5);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

const knownInput = document.getElementById('known');
const unknownInput = document.getElementById('unknown');
const excludedInput = document.getElementById('excluded');

[knownInput, unknownInput, excludedInput].forEach(input => {
    input.addEventListener('input', () => {
        if (knownInput.value || unknownInput.value || excludedInput.value) {
            const filteredWords = findWords(words, knownInput.value, unknownInput.value, excludedInput.value);
            displayResults(filteredWords);
        }
    });
});

function findWords(words, known = '', unknown = '', excluded = '') {
    const pattern = generatePattern(known);
    let filteredWords = filterWordsByPattern(words, pattern);

    if (unknown) {
        filteredWords = filterWordsByInclusion(filteredWords, unknown);
    }

    if (excluded) {
        filteredWords = filterWordsByExclusion(filteredWords, excluded);
    }

    return filteredWords;
}

function generatePattern(known) {
    return known.replace(/_/g, '.');
}

function filterWordsByPattern(words, pattern) {
    const regex = new RegExp(`^${pattern}$`);
    return words.filter(word => regex.test(word));
}

function filterWordsByInclusion(words, unknown) {
    return words.filter(word => [...unknown].every(letter => word.includes(letter)));
}

function filterWordsByExclusion(words, excluded) {
    return words.filter(word => [...excluded].every(letter => !word.includes(letter)));
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (results.length) {
        resultsDiv.innerHTML = `<p>Подходящие слова:</p><ul class="list-disc pl-5">${results.map(word => `<li>${word}</li>`).join('')}</ul>`;
    } else {
        resultsDiv.innerHTML = '<p>Подходящих слов не найдено.</p>';
    }
}
