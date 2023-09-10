import { useState, useEffect } from "react";
import { authState } from "../store/authState.js";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

interface Todo {
  _id: string;
  title: string;
  description: string;
  done: boolean;
}

type TodoArray = Todo[];

const TodoList = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<TodoArray>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const authStateValue = useRecoilValue(authState);

  useEffect(() => {
    const getTodos = async () => {
      const response = await fetch("http://localhost:3000/todo/todos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Todo: Create a type for the response that you get back from the server
      const data: Todo[] = await response.json();
      setTodos(data);
    };
    getTodos();
  }, []);

  const addTodo = async () => {
    const response = await fetch("http://localhost:3000/todo/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();

    const newTodos = [];
    for (let i = 0; i < todos.length; i++) {
      newTodos.push(todos[i]);
    }

    newTodos.push(data);
    setTodos(newTodos);
  };

  const markDone = async (id) => {
    const response = await fetch(
      `http://localhost:3000/todo/todos/${id}/done`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const updatedTodo = await response.json();
    setTodos(
      todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
    );
  };

  return (
    <div className="bg-indigo-400 h-screen flex flex-col justify-center items-center">
      <div>
        <h2>Welcome {authStateValue.username}</h2>
        <div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login")
            //   window.location = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="text-gray-700 text-2xl font-bold p-4">Todo List</h2>
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            {/* <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p> */}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Todo
            </button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {todos.map((todo) => (
          <div key={todo._id} className="flex justify-between pt-6">
            <div className="flex flex-col">
              <h3 className={todo.done ? "text-gray-900 font-bold text-lg line-through" : "text-gray-900 font-bold text-lg"}>{todo.title}</h3>
              {/* <p>{todo.description}</p> */}
              <p className={todo.done ? "w-full text-gray-900 line-through" : "w-full text-gray-900"}>{todo.description}</p>
            </div>
            <button
              onClick={() => markDone(todo._id)}
              className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green-800 border-green-800 hover:bg-green-800"
            >
              {todo.done ? "Done" : "Mark as Done"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
