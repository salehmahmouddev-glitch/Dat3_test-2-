'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function createTodo(formData: FormData) {
  try {
    await connectDB();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title || !description) {
      return { success: false, error: 'Title and description are required' };
    }

    await Todo.create({ title, description });
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create todo' };
  }
}

export async function updateTodo(id: string, data: { title?: string; description?: string; completed?: boolean }) {
  try {
    await connectDB();

    const todo = await Todo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return { success: false, error: 'Todo not found' };
    }

    revalidatePath('/');
    return { success: true, data: JSON.parse(JSON.stringify(todo)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update todo' };
  }
}

export async function deleteTodo(id: string) {
  try {
    await connectDB();

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return { success: false, error: 'Todo not found' };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete todo' };
  }
}

export async function toggleTodoComplete(id: string, completed: boolean) {
  try {
    await connectDB();

    const todo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    if (!todo) {
      return { success: false, error: 'Todo not found' };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to toggle todo' };
  }
}
