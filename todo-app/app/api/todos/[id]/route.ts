import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import mongoose from 'mongoose';

// GET single todo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: todo }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// PUT update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const todo = await Todo.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: todo }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
