import mongoose, { Schema, model, models } from 'mongoose';

export interface ITodo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = models.Todo || model<ITodo>('Todo', TodoSchema);

export default Todo;
