import React, { useState } from 'react';
import { HiOutlineTrash, HiMiniPlus } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    return (
        <div>
            {/* Input Field and Add Button */}
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    placeholder="Add a new todo..."
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                    onClick={handleAddOption}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                >
                    <HiMiniPlus className="text-lg" />
                </button>
            </div>

            {/* Todo List */}
            {todoList.map((item, index) => (
                <div
                    key={`${item}-${index}`} // safer key
                    className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'
                >
                    <p className='text-xs text-black'>
                        <span className='text-xs text-gray-400 font-semibold mr-2'>
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>
                    <button
                        className='cursor-pointer'
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className='text-lg text-red-500' />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TodoListInput;
