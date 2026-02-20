const questionBank = [
    {
        type: "multiple",
        question: "You see a military training route labeled VR1467. What does the 4-digit number indicate?",
        choices: [
            "The route is at or below 1,500 feet AGL.",
            "High-speed training occurs only during daylight hours.",
            "The route is reserved for instrument flight only."
        ],
        answer: "The route is at or below 1,500 feet AGL.",
        explanation: "MTRs with 4-digit identifiers are conducted at or below 1,500 feet AGL; 3-digit identifiers include segments above 1,500 feet AGL.",
        image: null
    },
    {
        type: "multiple",
        question: "Responsibility for collision avoidance in an Alert Area rests with:",
        choices: [
            "Manned aircraft pilots only.",
            "The controlling agency.",
            "All pilots (participating and transiting)."
        ],
        answer: "All pilots (participating and transiting).",
        explanation: "In Alert Areas, both participating and transiting pilots are responsible for collision avoidance.",
        image: null
    },
    {
        type: "multiple",
        question: "A tower is marked 1049 (1036). How high is the top of the tower above sea level?",
        choices: [
            "1,049 feet MSL.",
            "1,036 feet MSL.",
            "13 feet MSL."
        ],
        answer: "1,049 feet MSL.",
        explanation: "On sectional charts, the number outside parentheses is the MSL height; the number in parentheses is AGL.",
        image: null
    },
    {
        type: "multiple",
        question: "Which airspace requires prior authorization via LAANC or DroneZone?",
        choices: [
            "Class G.",
            "Class C.",
            "MOAs."
        ],
        answer: "Class C.",
        explanation: "Controlled airspace such as Class B, C, D, and E-sfc requires prior authorization; Class C is one example.",
        image: null
    },
    {
        type: "multiple",
        question: "A magenta dashed circle around an airport indicates:",
        choices: [
            "Class D airspace.",
            "Class E airspace starting at the surface.",
            "An Alert Area."
        ],
        answer: "Class E airspace starting at the surface.",
        explanation: "A dashed magenta line around an airport indicates Class E to surface.",
        image: null
    },
    {
        type: "multiple",
        question: "What is the floor of a Victor Airway?",
        choices: [
            "700 feet AGL.",
            "1,200 feet AGL.",
            "The surface."
        ],
        answer: "1,200 feet AGL.",
        explanation: "Victor airways are in Class E airspace that generally begins at 1,200 feet AGL.",
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
