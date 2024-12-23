let gameData = []; // To hold data from the JSON
let currentImageIndex = 0;
let score = 0;
const submittedAnswers = []; // To store user answers and results

// Fetch game data from data.json
async function fetchGameData() {
    try {
        const response = await fetch("../jsdata/data.json"); // Path to JSON file
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging step
        gameData = data.automotive; // Access the "automotive" category
        console.log("Game Data:", gameData); // Debugging step
        startGame();
    } catch (error) {
        console.error("Error loading game data:", error);
    }
}

// Start the game
function startGame() {
    loadRandomImage();
    updateScore();
}

// Load a random image
function loadRandomImage() {
    if (!gameData || gameData.length === 0) {
        console.error("Game data is empty or not loaded.");
        return;
    }
    currentImageIndex = Math.floor(Math.random() * gameData.length);
    console.log("Current Image Index:", currentImageIndex); // Debugging step
    const currentData = gameData[currentImageIndex];
    if (!currentData || !currentData.image) {
        console.error("Invalid data at index:", currentImageIndex, currentData);
        return;
    }

    // Set the image source
    const imgElement = document.getElementById("game-image");
    imgElement.src = currentData.image;
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById("user-input").value.trim().toLowerCase();
    const correctAnswer = gameData[currentImageIndex].answer;

    // Save answer and the result
    submittedAnswers.push({
        image: gameData[currentImageIndex].image,
        submitted: userInput,
        correct: correctAnswer,
    });

    // Check answer
    if (userInput === correctAnswer) {
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong! The correct answer is: ${correctAnswer}`);
    }

    // Update score and load a new image
    updateScore();
    loadRandomImage();
    document.getElementById("user-input").value = ""; // Clear the input field
}

// Update score display
function updateScore() {
    const scoreElement = document.getElementById("score-counter");
    scoreElement.textContent = `Score: ${score}`;
}

// Generate results on results page
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

// Initialize results page
if (document.getElementById("game-page")) {
    fetchGameData();
    document.getElementById("answer-form").addEventListener("submit", handleSubmit);
} else if (document.getElementById("results-page")) {
    showResults();
}