const questionBank = [
    {
        type: "multiple",
        question: "What is the maximum altitude you can fly a drone under Part 107?",
        choices: ["200 feet AGL", "400 feet AGL", "500 feet AGL", "600 feet AGL"],
        answer: "400 feet AGL",
        explanation: "Part 107 limits drone operations to a maximum of 400 feet above ground level (AGL) unless within 400 feet of a structure.",
        image: null
    },
    {
        type: "truefalse",
        question: "You must always keep your drone within visual line-of-sight (VLOS).",
        answer: "True",
        explanation: "VLOS is required so the remote pilot can see and avoid obstacles, people, and other aircraft.",
        image: null
    },
    {
        type: "multiple",
        question: "What is the minimum age to obtain a Remote Pilot Certificate?",
        choices: ["14", "16", "18", "21"],
        answer: "16",
        explanation: "You must be at least 16 years old to be eligible for a Remote Pilot Certificate under Part 107.",
        image: null
    },
    {
        type: "truefalse",
        question: "You can fly a drone over people under Part 107 without any restrictions.",
        answer: "False",
        explanation: "Flying over people is restricted unless the operation meets specific requirements for Category 1-4 operations.",
        image: null
    },
    {
        type: "multiple",
        question: "What is the maximum groundspeed allowed for a drone under Part 107?",
        choices: ["50 knots", "87 knots", "100 knots", "120 knots"],
        answer: "87 knots",
        explanation: "The maximum allowed groundspeed is 87 knots (100 mph).",
        image: null
    },
    {
        type: "multiple",
        question: "What does this symbol mean on a sectional chart?",
        choices: ["Airport", "Heliport", "Restricted Area", "Obstacle"],
        answer: "Airport",
        explanation: "This symbol represents an airport on a sectional chart.",
        image: "images/airport_symbol.png"
    }
    // Add more questions as needed
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
    // If the question section doesn't exist, create it in the first column
    if (!document.getElementById('question-section')) {
        const col1 = document.querySelector('.flex-1.bg-white.shadow-lg.rounded-xl.p-6');
        if (col1) {
            const questionDiv = document.createElement('div');
            questionDiv.id = 'question-section';
            questionDiv.className = 'mt-8 p-4 bg-blue-50 rounded-lg';
            questionDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Practice Question</h3>
                <div id="question-text" class="mb-4 text-gray-800"></div>
                <div id="answer-section" class="mb-4"></div>
                <button id="next-question" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next Question</button>
            `;
            col1.appendChild(questionDiv);
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