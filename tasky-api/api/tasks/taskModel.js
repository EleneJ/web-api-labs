import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: (date) => date > new Date(),
      message: 'Deadline must be in the future.'
    }
  },
  done: Boolean,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
});

const dateValidator = (date) => {
  return date > new Date();
}
TaskSchema.path("deadline").validate(dateValidator);

export default mongoose.model('Task', TaskSchema);