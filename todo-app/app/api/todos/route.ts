import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';

// GET all todos
export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: todos }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST create new todo
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const todo = await Todo.create({ title, description });
    return NextResponse.json({ success: true, data: todo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create todo' },
      { status: 500 }
    );
  }
}
