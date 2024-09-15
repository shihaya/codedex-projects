import './App.css'
import Header from "./components/Header.jsx";
import {useEffect, useState} from "react";
import {UserProvider} from "./components/UserContext.jsx";
import {Route, Routes} from "react-router-dom";
import UserForm from "./components/UserForm.jsx";
import Results from "./components/Results.jsx";
import Question from "./components/Question.jsx";

function App() {
    const questions = [
        {
            question: "What’s your favorite coding environment?",
            options: ["Bustling cafe ☕", "Outdoors 🌳", "Quiet room 🕯️", "Office 🖥️"],
        },
        {
            question: "What’s your ideal side project?",
            options: ["Open-source contribution 👩‍💻", "Outdoor adventure tracker 🌲", "Storytelling app 💖", "Puzzle game 🧩"],
        },
        {
            question: "What language would you love to master?",
            options: ["C++ 💻", "Kotlin 🦗", "Go 🐹", "Haskell 🎩"],
        },
        {
            question: "What’s your coding soundtrack?",
            options: ["Deep house 🎧", "Classical 🎻", "Ambient sounds 🌿", "Lofi beats 🌙"],
        },
        {
            question: "How do you solve bugs?",
            options: ["Debugging tools 🔧", "Documentation deep dive 📚", "Take a break first 🚶", "Coffee and persistence 🌑"],
        },
        {
            question: "How do you celebrate finishing a project?",
            options: ["Build something new 🔄", "Share it online 💬", "Take a well-deserved break 🏔️", "Quiet reflection 🧘‍♂️"],
        },
        {
            question: "What type of challenge do you enjoy most?",
            options: ["Design challenge 🤖", "Hackathon 💬", "PC building 💻", "Reverse-engineering 🧠"],
        }
    ];

    const keywords = {
        Passion: "passion",
        Innovation: "innovation",
        Nature: "nature",
        Mystery: "mystery",
    };

    // noinspection JSNonASCIINames
    const elements = {
        "Bustling cafe ☕": "passion",
        "Outdoors 🌳": "nature",
        "Quiet room 🕯️": "mystery",
        "Office 🖥️": "innovation",

        "Open-source contribution 👩‍💻": "innovation",
        "Outdoor adventure tracker 🌲": "nature",
        "Storytelling app 💖": "passion",
        "Puzzle game 🧩": "mystery",

        "C++ 💻": "innovation",
        "Kotlin 🦗": "passion",
        "Go 🐹": "nature",
        "Haskell 🎩": "mystery",

        "Deep house 🎧": "innovation",
        "Classical 🎻": "passion",
        "Ambient sounds 🌿": "nature",
        "Lofi beats 🌙": "mystery",

        "Debugging tools 🔧": "innovation",
        "Documentation deep dive 📚": "mystery",
        "Take a break first 🚶": "nature",
        "Coffee and persistence 🌑": "passion",

        "Build something new 🔄": "innovation",
        "Share it online 💬": "passion",
        "Tale a well-deserved break 🏔️": "nature",
        "Quiet reflection 🧘‍♂️": "mystery",

        "Design challenge 🤖": "innovation",
        "Hackathon 💬": "passion",
        "PC building 💻": "nature",
        "Reverse-engineering 🧠": "mystery",
    };

    // State variables
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const { userName, setUserName } = useState("");
    const [element, setElement] = useState("");
    const [artwork, setArtwork] = useState(null);

    // Handle the answer to the question
    function handleAnswer(answer) {
        setAnswers([...answers, answer]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    }

    // Set the user name
    function handleUserFormSubmit(name) {
        setUserName(name);
    }

    // Determine the element based on the answers
    function determineElement(answers) {
        const counts = {};
        answers.forEach(function(answer) {
            const element = elements[answer];
            counts[element] = (counts[element] || 0) + 1;
        });
        return Object.keys(counts).reduce(function(a, b) {
            return counts[a] > counts[b] ? a : b
        });
    }

    // Fetch the artwork for the selected element from the MET museum API
    function fetchArtwork(keyword) {
        fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`
        )
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const objectIDs = data.objectIDs;
                const randomObjectID = objectIDs[Math.floor(Math.random() * objectIDs.length)];
                console.log(randomObjectID);
                return fetch(
                    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectID}`
                );
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                setArtwork(data);
            }
        );
    }

    // Fetch the artwork when reaching the end of the quiz
    useEffect(
        function () {
            if (currentQuestionIndex === questions.length) {
                const selectedElement = determineElement(answers);
                setElement(selectedElement);
                fetchArtwork(keywords[selectedElement]);
            }
        },
        [currentQuestionIndex]
    );

  return (
    <div className="container">
        <UserProvider value={{ name: userName, setName: setUserName }}>
            <Header />
            <Routes>
                <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
                <Route
                    path="/quiz"
                    element={
                        currentQuestionIndex < questions.length ? (
                            <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
                        ) : (
                            <Results element={element} artwork={artwork} />
                        )
                    }
                />
            </Routes>
        </UserProvider>
    </div>
  )
}

export default App
