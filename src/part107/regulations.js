const questionBank = [
    {
        type: "multiple",
        question: "According to 14 CFR Part 107, an sUAS must weigh:",
        choices: [
            "Exactly 55 pounds.",
            "Less than 55 pounds on takeoff including everything attached.",
            "More than 0.55 pounds but less than 25 pounds."
        ],
        answer: "Less than 55 pounds on takeoff including everything attached.",
        explanation: "Part 107 applies to small UAS weighing less than 55 lb at takeoff, including all attachments.",
        image: null
    },
    {
        type: "multiple",
        question: "When must a Remote PIC report an sUAS accident to the FAA?",
        choices: [
            "Within 24 hours of any incident.",
            "Within 10 calendar days if property damage (excluding the drone) exceeds $500.",
            "Within 30 days of any injury requiring a first aid kit."
        ],
        answer: "Within 10 calendar days if property damage (excluding the drone) exceeds $500.",
        explanation: "Report to the FAA within 10 calendar days for serious injury, loss of consciousness, or >$500 property damage (not including the UA).",
        image: null
    },
    {
        type: "multiple",
        question: "To notify the FAA of a change of permanent mailing address, a pilot has:",
        choices: ["30 days.", "60 days.", "10 business days."],
        answer: "30 days.",
        explanation: "Pilots must update the FAA within 30 days of a change of permanent mailing address.",
        image: null
    },
    {
        type: "multiple",
        question: "During night operations, anti-collision lights must be visible for at least:",
        choices: ["1 statute mile.", "2 statute miles.", "3 statute miles."],
        answer: "3 statute miles.",
        explanation: "Anti-collision lighting must be visible for at least 3 SM during night operations.",
        image: null
    },
    {
        type: "multiple",
        question: "Which subpart of Part 107 covers the issuance of a Remote Pilot Certificate?",
        choices: ["Subpart A.", "Subpart B.", "Subpart C."],
        answer: "Subpart C.",
        explanation: "Subpart C addresses Remote Pilot Certification requirements.",
        image: null
    },
    {
        type: "multiple",
        question: "What is the maximum groundspeed permitted for a small UA?",
        choices: ["87 miles per hour.", "100 miles per hour (87 knots).", "100 knots."],
        answer: "100 miles per hour (87 knots).",
        explanation: "Maximum groundspeed under Part 107 is 87 knots (100 mph).",
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