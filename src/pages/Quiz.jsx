import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Star } from 'lucide-react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };
const saveQuizAttempt = async () => {
  try {
    await axios.post('http://localhost:5000/api/questions/save-attempt', {
      score,
      totalQuestions: questions.length
    });
    console.log('Quiz attempt saved successfully');
  } catch (err) {
    console.error('Error saving quiz attempt:', err);
  }
};
  const handleNextQuestion = () => {
  const currentQ = questions[currentQuestion];
  const isCorrect = currentQ.options[selectedAnswer] === currentQ.correctAnswer;

  const newUserAnswers = [
    ...userAnswers,
    {
      question: currentQuestion,
      selected: selectedAnswer,
      correct: currentQ.options.indexOf(currentQ.correctAnswer),
      isCorrect,
    },
  ];

  setUserAnswers(newUserAnswers);

  if (isCorrect) {
    setScore(score + 1);
  }

  setShowResult(true);

  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      saveQuizAttempt(); // Call the save function when quiz is completed
    }
  }, 2000);
};
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! You're a gardening expert! 🌟";
    if (percentage >= 60) return "Great job! You have solid gardening knowledge! 🌱";
    if (percentage >= 40) return "Good effort! Keep learning and growing! 🌿";
    return "Keep practicing! Every gardener starts somewhere! 🌱";
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-red-600">No questions found.</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  if (quizCompleted) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
              <p className={`text-2xl font-semibold ${getScoreColor()}`}>
                You scored {score} out of {questions.length}
              </p>
              <p className="text-lg text-gray-600 mt-2">{getScoreMessage()}</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-8 w-8 ${
                      i < Math.floor((score / questions.length) * 5)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-left mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h3>
              <div className="space-y-4">
                {userAnswers.map((answer, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {answer.isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {questions[index].question}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          Your answer: {questions[index].options[answer.selected]}
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-sm text-green-600 mb-2">
                            Correct answer: {questions[index].correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Take Quiz Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gardening Knowledge Quiz</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your gardening knowledge and learn new tips to become a better plant parent!
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>
          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  showResult
                    ? index === currentQ.options.indexOf(currentQ.correctAnswer)
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : index === selectedAnswer &&
                        index !== currentQ.options.indexOf(currentQ.correctAnswer)
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : selectedAnswer === index
                    ? 'border-purple-500 bg-purple-50 text-purple-800'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showResult
                        ? index === currentQ.options.indexOf(currentQ.correctAnswer)
                          ? 'border-green-500 bg-green-500'
                          : index === selectedAnswer &&
                            index !== currentQ.options.indexOf(currentQ.correctAnswer)
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        : selectedAnswer === index
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {showResult && index === currentQ.options.indexOf(currentQ.correctAnswer) && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                    {showResult &&
                      index === selectedAnswer &&
                      index !== currentQ.options.indexOf(currentQ.correctAnswer) && (
                        <XCircle className="h-4 w-4 text-white" />
                      )}
                    {selectedAnswer === index && !showResult && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800">
                {/* You can optionally include explanations if your backend provides them */}
                This is the correct answer because it matches optimal plant care practices.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {showResult ? (
                selectedAnswer === currentQ.options.indexOf(currentQ.correctAnswer) ? (
                  <span className="text-green-600 font-medium">✓ Correct!</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Incorrect</span>
                )
              ) : (
                'Select an answer to continue'
              )}
            </div>

            {!showResult && (
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        </div>

        {/* Optional Fun Fact */}
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">🌱 Did You Know?</h3>
          <p className="text-green-800">
            Plants can communicate through underground fungal networks — the "wood wide web"!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
