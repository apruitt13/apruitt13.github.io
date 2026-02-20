const questionBank = [
    {
        type: "multiple",
        question: "What is the antidote for the \"Macho\" hazardous attitude?",
        choices: [
            "Follow the rules.",
            "Taking risks is foolish.",
            "It could happen to me."
        ],
        answer: "Taking risks is foolish.",
        explanation: "Hazardous attitude antidote for Macho is recognizing that taking risks is foolish.",
        image: null
    },
    {
        type: "multiple",
        question: "Which frequency should a pilot monitor at a non-towered airport to hear traffic calls?",
        choices: [
            "ATIS.",
            "CTAF.",
            "Flight Service Station."
        ],
        answer: "CTAF.",
        explanation: "CTAF is used for self-announce/traffic advisories at non-towered airports.",
        image: null
    },
    {
        type: "multiple",
        question: "An aircraft hears a call: \"midfield left downwind for Runway 13.\" Where is the aircraft relative to the runway?",
        choices: [
            "Northwest of the airport.",
            "Parallel to the runway on a heading of 310°.",
            "On a landing approach heading of 130°."
        ],
        answer: "Parallel to the runway on a heading of 310°.",
        explanation: "Runway 13 aligns ~130°; left downwind is reciprocal ~310°, parallel opposite direction.",
        image: null
    },
    {
        type: "multiple",
        question: "What is the \"bottle to throttle\" rule for a Remote PIC?",
        choices: [
            "8 hours and a blood alcohol concentration of less than 0.04%.",
            "12 hours and a BAC of 0.00%.",
            "24 hours after any consumption."
        ],
        answer: "8 hours and a blood alcohol concentration of less than 0.04%.",
        explanation: "Part 107 prohibits operations within 8 hours of alcohol with BAC ≥ 0.04%.",
        image: null
    },
    {
        type: "multiple",
        question: "Symptoms of hyperventilation include tingling and lightheadedness. The best treatment is:",
        choices: [
            "Breathe supplemental oxygen.",
            "Slow the breathing rate or breathe into a paper bag.",
            "Increase physical activity."
        ],
        answer: "Slow the breathing rate or breathe into a paper bag.",
        explanation: "Rebreathe CO2 or slow breathing to correct respiratory alkalosis from hyperventilation.",
        image: null
    },
    {
        type: "multiple",
        question: "What does the \"V\" in the PAVE checklist stand for?",
        choices: [
            "Visual observer.",
            "Visibility.",
            "environment"
        ],
        answer: "environment",
        explanation: "PAVE mnemonic: Pilot, Aircraft, enVironment, External pressures.",
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
