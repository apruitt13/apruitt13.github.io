const questionBank = [
    {
        type: "multiple",
        question: "Which stage of a thunderstorm is characterized almost exclusively by downdrafts?",
        choices: [
            "Mature.",
            "Cumulus.",
            "Dissipating."
        ],
        answer: "Dissipating.",
        explanation: "In the dissipating stage, downdrafts dominate as the storm weakens.",
        image: null
    },
    {
        type: "multiple",
        question: "What are the characteristics of an unstable air mass?",
        choices: [
            "Stratiform clouds and steady precipitation.",
            "Cumuliform clouds and turbulent air.",
            "Hazy conditions and smooth air."
        ],
        answer: "Cumuliform clouds and turbulent air.",
        explanation: "Unstable air favors vertical motion, producing cumuliform clouds, showery precip, and turbulence.",
        image: null
    },
    {
        type: "multiple",
        question: "What type of fog requires wind to form and is common along coastal areas?",
        choices: [
            "Radiation fog.",
            "Advection fog.",
            "Upslope fog."
        ],
        answer: "Advection fog.",
        explanation: "Advection fog forms when moist air is transported over a cooler surface by wind.",
        image: null
    },
    {
        type: "multiple",
        question: "According to standard lapse rates, what is the expected pressure at 2,000 feet MSL if the surface pressure is 29.92\" Hg?",
        choices: [
            "31.92\" Hg.",
            "27.92\" Hg (drops 1\" per 1,000 feet).",
            "29.92\" Hg."
        ],
        answer: "27.92\" Hg (drops 1\" per 1,000 feet).",
        explanation: "Pressure decreases roughly 1\" Hg per 1,000 feet; at 2,000 feet it's ~2\" lower than 29.92.",
        image: null
    },
    {
        type: "multiple",
        question: "Minimum distance to fly below a cloud is:",
        choices: [
            "1,000 feet.",
            "500 feet.",
            "2,000 feet."
        ],
        answer: "500 feet.",
        explanation: "Part 107 requires 500 ft below clouds and 2,000 ft horizontal clearance.",
        image: null
    },
    {
        type: "multiple",
        question: "In a METAR, what does the code \"RA\" indicate?",
        choices: [
            "Fog.",
            "Rain.",
            "Thunderstorm."
        ],
        answer: "Rain.",
        explanation: "METAR precipitation codes: RA=rain, SN=snow, DZ=drizzle, FG=fog, TS=thunderstorm (phenomenon).",
        image: null
    }
];

let currentQuestionIndex = 0;

function showQuestion(index) {
    const q = questionBank[index];
    document.getElementById('question-text').textContent = q.question;
    const answerSection = document.getElementById('answer-section');
    const explanationSection = document.getElementById('explanation-section');
    const imageSection = document.getElementById('image-section');
    answerSection.innerHTML = '';
    explanationSection.innerHTML = '';
    imageSection.innerHTML = '';

    // Show image if present
    if (q.image) {
        imageSection.innerHTML = `<img src="${q.image}" alt="Question image" class="max-w-full h-auto rounded shadow">`;
    }

    if (q.type === "multiple") {
        q.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.textContent = choice;
            btn.className = "block w-full text-left px-4 py-2 mb-2 bg-white border rounded hover:bg-blue-100";
            btn.onclick = () => checkAnswer(choice, q.answer, btn, q.explanation);
            answerSection.appendChild(btn);
        });
    } else if (q.type === "truefalse") {
        ["True", "False"].forEach(choice => {
            const btn = document.createElement('button');
            btn.textContent = choice;
            btn.className = "block w-full text-left px-4 py-2 mb-2 bg-white border rounded hover:bg-blue-100";
            btn.onclick = () => checkAnswer(choice, q.answer, btn, q.explanation);
            answerSection.appendChild(btn);
        });
    }
}

function checkAnswer(selected, correct, btn, explanation) {
    // Disable all buttons
    Array.from(document.getElementById('answer-section').children).forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('bg-green-200');
        btn.classList.remove('hover:bg-blue-100');
    } else {
        btn.classList.add('bg-red-200');
        btn.classList.remove('hover:bg-blue-100');
        // Highlight the correct answer
        Array.from(document.getElementById('answer-section').children).forEach(b => {
            if (b.textContent === correct) b.classList.add('bg-green-100');
        });
    }
    // Show explanation
    document.getElementById('explanation-section').textContent = explanation || '';
}

document.addEventListener('DOMContentLoaded', function() {
    // Ensure a question section exists; if not, create one as a side panel like the regulations page
    if (!document.getElementById('question-section')) {
        const container = document.querySelector('.flex.flex-col.lg\\:flex-row.gap-6');
        const questionDiv = document.createElement('div');
        questionDiv.id = 'question-section';
        questionDiv.className = 'w-full lg:w-96 shrink-0 mt-8 p-4 bg-blue-50 rounded-lg';
        questionDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Practice Question</h3>
                <div id="question-text" class="mb-4 text-gray-800"></div>
                <div id="answer-section" class="mb-4"></div>
                <div id="explanation-section" class="mb-4 text-green-900"></div>
                <div id="image-section" class="mb-4"></div>
                <button id="next-question" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next Question</button>
            `;
        if (container) {
            container.appendChild(questionDiv);
        } else {
            // Fallback: append to the first column if container not found
            const col1 = document.querySelector('.flex-1.bg-white.shadow-lg.rounded-xl.p-6');
            if (col1) col1.appendChild(questionDiv);
        }
    }

    showQuestion(currentQuestionIndex);

    const nextBtn = document.getElementById('next-question');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentQuestionIndex = (currentQuestionIndex + 1) % questionBank.length;
            showQuestion(currentQuestionIndex);
        });
    }
});
