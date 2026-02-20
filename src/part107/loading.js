const questionBank = [
    {
        type: "multiple",
        question: "If an sUAS has a level stall speed of 30 knots, what is its stall speed in a 60-degree banked turn?",
        choices: [
            "30 knots.",
            "42.3 knots (30 × 1.41).",
            "60 knots."
        ],
        answer: "42.3 knots (30 × 1.41).",
        explanation: "In a 60° bank, load factor is 2 Gs; stall speed increases by √2 ≈ 1.41, so 30 × 1.41 ≈ 42.3 knots.",
        image: null
    },
    {
        type: "multiple",
        question: "What effect does high density altitude have on a drone?",
        choices: [
            "Increases lift.",
            "Decreases lift and propeller efficiency.",
            "Improves battery performance."
        ],
        answer: "Decreases lift and propeller efficiency.",
        explanation: "Lower air density reduces rotor/prop efficiency and lift, increasing takeoff distance and reducing performance.",
        image: null
    },
    {
        type: "multiple",
        question: "Which CG position makes the aircraft less stable at all speeds?",
        choices: [
            "Forward CG.",
            "Aft (Rear) CG.",
            "CG within manufacturer limits."
        ],
        answer: "Aft (Rear) CG.",
        explanation: "An aft CG reduces longitudinal stability and can make recovery from stalls more difficult.",
        image: null
    },
    {
        type: "multiple",
        question: "How is the Center of Gravity (CG) calculated?",
        choices: [
            "Total Weight divided by Total Moment.",
            "Total Moment divided by Total Weight.",
            "Weight multiplied by Arm."
        ],
        answer: "Total Moment divided by Total Weight.",
        explanation: "CG = Σ(moment) / Σ(weight). Moment is weight × arm.",
        image: null
    },
    {
        type: "multiple",
        question: "What is the load factor for an aircraft in a 60-degree banked turn?",
        choices: [
            "1.41 Gs.",
            "2.0 Gs.",
            "5.76 Gs."
        ],
        answer: "2.0 Gs.",
        explanation: "At 60° bank in coordinated level flight, the load factor is 2 Gs (effective weight doubles).",
        image: null
    },
    {
        type: "multiple",
        question: "A stall occurs when the wing exceeds the:",
        choices: [
            "Maximum groundspeed.",
            "Critical Angle of Attack.",
            "Weight limit."
        ],
        answer: "Critical Angle of Attack.",
        explanation: "Stalls are caused by exceeding the critical AOA regardless of airspeed.",
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
