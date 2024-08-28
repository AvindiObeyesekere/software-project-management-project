import React from "react";

const TaskForm = ({ taskName, setTaskName, description, setDescription }) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskName">
        Task Name
      </label>
      <input
        type="text"
        id="taskName"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
        Description
      </label>
      <textarea
        id="description"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        rows="4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  </>
);

export default TaskForm;
