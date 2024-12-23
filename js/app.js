let gameData = []; // To hold data from the JSON
let currentImageIndex = null;
let score = 0;
const submittedAnswers = []; // To store user answers and results

async function fetchGameData() {
    try {
        const response = await fetch("../jsdata/data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        gameData = [...data.automotive]; // Ensure a copy of the data is used
        startGame();
    } catch (error) {
        console.error("Error loading game data:", error);
    }
}

function startGame() {
    loadRandomImage();
    updateScore();
}

function loadRandomImage() {
    if (gameData.length === 0) {
        alert("Game Over! You've completed all the logos.");
        return;
    }

    currentImageIndex = Math.floor(Math.random() * gameData.length);
    const currentData = gameData[currentImageIndex];

    if (currentData) {
        const imgElement = document.getElementById("game-image");
        imgElement.src = currentData.image;
    } else {
        console.error("Invalid data at index:", currentImageIndex, currentData);
    }
}

function handleSubmit(event) {
    event.preventDefault();

    if (currentImageIndex === null || gameData.length === 0) return;

    const userInput = document.getElementById("user-input").value.trim().toLowerCase();
    const currentData = gameData[currentImageIndex];
    const correctAnswer = currentData.answer;

    submittedAnswers.push({
        image: currentData.image,
        submitted: userInput,
        correct: correctAnswer,
    });

    const feedbackElement = document.getElementById("feedback");

    if (userInput === correctAnswer) {
        score++;
        feedbackElement.textContent = "Correct! Great job!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = `Wrong! The correct answer is: ${correctAnswer}`;
        feedbackElement.style.color = "red";
    }

    gameData.splice(currentImageIndex, 1);
    currentImageIndex = null;
    updateScore();
    loadRandomImage();
    document.getElementById("user-input").value = "";
}

function updateScore() {
    const scoreElement = document.getElementById("score-counter");
    scoreElement.textContent = `Score: ${score}`;
}

function showResults() {
    const resultsContainer = document.getElementById("results-container");
    submittedAnswers.forEach(({ image, submitted, correct }) => {
        const resultDiv = document.createElement("div");
        resultDiv.className = "result-item";
        const img = document.createElement("img");
        img.src = image;
        img.alt = correct;
        const text = document.createElement("p");
        text.textContent = `Your Answer: ${submitted} | Correct Answer: ${correct}`;
        resultDiv.appendChild(img);
        resultDiv.appendChild(text);
        resultsContainer.appendChild(resultDiv);
    });
}

if (document.getElementById("game-page")) {
    fetchGameData();
    document.getElementById("answer-form").addEventListener("submit", handleSubmit);
} else if (document.getElementById("results-page")) {
    showResults();
}