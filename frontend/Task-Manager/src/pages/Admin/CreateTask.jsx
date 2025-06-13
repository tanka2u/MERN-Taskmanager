import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuTable2 } from 'react-icons/lu';
import { PRIORITY_DATA } from '../../utils/data';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';
import moment from 'moment';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';


const CreateTask = () => {
  const location = useLocation();
  const {taskId} = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title:"",
    description:"",
    priority: "Low",
    dueDate:null,
    assignedTo:[],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange= (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]:value}));
  };
  
  const clearData = () => {
    // Reset form
    setTaskData({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
    });
  };

  // Create Task
  const createTask = async () =>{
    setLoading(true);

    try {
      const todoList= taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task Created Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false)
    }
  };

  // Update Task
  const updateTask = async () =>{
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const preTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = preTodoChecklist.find((task) => task.txt == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        }
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todolist,
        }
      );

      toast.success("Task updated Successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false)
    }
  };

  const handleSubmit = async () =>{
    setError(null);

    // Input validation
    if(!taskData.title.trim()) {
      setError("Title is Required.");
      return;
    }
    if(!taskData.description.trim()) {
      setError("Description is Required.");
      return;
    }
    if(!taskData.dueDate) {
      setError("Due date is Required.");
      return;
    }
    if(taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member.");
      return;
    }
    if(taskData.todoChecklist?.length === 0) {
      setError("Add at least one tot task.");
      return;
    }
    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  // Get Task info by ID
  const getTaskDetailsByID = async () =>{
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Delete Task
  const deleteTask = async () =>{
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Expenses details deleted successfully");
      navigate('/admin/tasks')
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if(taskId) {
      getTaskDetailsByID(taskId)
    }

    return () => {
      
    }
  }, [taskId])

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {taskId ? "Update Task" : "Create Task" }
              </h2>

              {taskId && (
                <button
                  className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTable2 className='text-base' /> Delete
                </button>
              )}
            </div>

            <div className='mt-4'>
              <label className='text-xs font-medium text-slate-600'>
                Task Title
              </label>

              <input
                placeholder='Create App UI'
                className='form-input'
                value={taskData.title}
                onChange={({target}) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Description
              </label>

              <textarea
                placeholder='Describe Task'
                className= 'form-input'
                rows={4}
                value={taskData.description}
                onChange={({target}) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className='grid grid-cols-12 gap-4 mt-2'>
              <div className='col-span-6 md:col-span-4'>
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder = "Select Priority"
                />
              </div>

              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>
                  Due Date
                </label>

                <input
                  placeholder='Create App UI'
                  className='form-input'
                  value={taskData.dueDate}
                  onChange={({target}) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type='date'
                />
              </div>

              <div className='col-span-12 md:col-span-3'>
                <label className='text-sx font-medium text-slate-600'>
                  Assign To
                </label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>{
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>
            
            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                TODO Checklist
              </label>

              <TodoListInput
                todoList = {taskData.todoChecklist}
                setTodoList = {(value) => 
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className='text-xs font-medium text-slate-600'>
                Add Attachments
              </label>

              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) => 
                  handleValueChange("attachments", value)
                }
                />
            </div>
            
            {error && (
              <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK":"CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
       isOpen={openDeleteAlert}
       onClose={() => setOpenDeleteAlert(false)}
       title="Delete Task"
      >
        <DeleteAlert
          content= "Are you sure you want to delete this task ?"
          onDelete = {() => deleteTask()}
        />
      </Modal>
    

    </DashboardLayout>
  )
}

export default CreateTask;