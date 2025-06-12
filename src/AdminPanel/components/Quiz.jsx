import React, { useState } from "react";
const AdminPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addQuestion = async () => {
    if (question.trim() === "" || options.some(opt => opt.trim() === "") || correctAnswer.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    const newQuestion = { question, options, correctAnswer };

    try {
      const response = await fetch("http://localhost:5000/api/questions/add-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        alert("Question added successfully!");
        // Clear inputs
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
      } else {
        const errorData = await response.json();
        alert(`Failed to add question: ${errorData.error}`);
      }
    } catch (error) {
      alert("An error occurred while adding the question.");
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Quiz</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        /> <br />
        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))} <br />
        <input
          type="text"
          placeholder="Enter correct answer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
        <button className="button" onClick={addQuestion}>Add Question</button>
      </div>
    </div>
  );
};

export default AdminPage;
