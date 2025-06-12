import express from "express";
import Question from "../schema/Question.js";
import QuizAttempt from "../schema/QuizAttempt.js"
const router = express.Router();

router.post("/add-question", async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (options.length !== 4) {
      return res.status(400).json({ error: "Exactly 4 options are required" });
    }

    const newQuestion = new Question({ question, options, correctAnswer });
    await newQuestion.save();

    res.status(201).json({ message: "Question added successfully", newQuestion });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a question by ID
router.delete("/delete-question/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post('/save-attempt', async (req, res) => {
  try {
    const { score, totalQuestions } = req.body;
    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = new QuizAttempt({
      score,
      totalQuestions,
      percentage
    });

    await attempt.save();
    
    res.status(201).json({ success: true, data: attempt });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get quiz attempt count (keep this)
router.get('/quizcount', async (req, res) => {
  try {
    const count = await QuizAttempt.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

