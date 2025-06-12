import mongoose from "mongoose";


const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, "Options must have exactly 4 items"],
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

function arrayLimit(val) {
  return val.length === 4;
}
export default mongoose.model("Question", questionSchema);

