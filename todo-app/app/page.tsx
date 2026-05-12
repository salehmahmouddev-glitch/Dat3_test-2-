import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';

async function getTodos() {
  try {
    await connectDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(todos)) };
  } catch {
    return { success: false, data: [] };
  }
}

export default async function Home() {
  const { success, data: todos } = await getTodos();

  const completed = todos.filter((t: any) => t.completed).length;
  const pending = todos.length - completed;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
           Todo App
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
           .................
          </p>
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{todos.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{completed}</p>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{pending}</p>
              <p className="text-xs text-gray-500 mt-1">Pending</p>
            </div>
          </div>
        )}

        {/* Add Todo Form */}
        <TodoForm />

        {/* Error state */}
        {!success && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 text-sm">
             Failed to connect to the database. Please check your connection and try again.
          </div>
        )}

        {/* Todo List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {todos.length > 0 ? `Your Todos (${todos.length})` : ''}
          </h2>

          {todos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🗒️</div>
              <p className="text-lg font-medium">No todos yet</p>
              <p className="text-sm mt-1">Add your first todo above to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo: any) => (
                <TodoItem key={todo._id} todo={todo} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
