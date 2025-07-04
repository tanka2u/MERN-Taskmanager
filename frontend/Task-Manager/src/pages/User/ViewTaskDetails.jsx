import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';
import { toast } from 'react-toastify';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
      case 'Completed':
        return 'text-lime-500 bg-lime-50 border border-lime-500/20';
      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error("Failed to load task.");
    }
  };

  const updateTodoChecklist = useCallback(
    async (index) => {
      const taskId = id;
      const updatedChecklist = task?.todoChecklist.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      );

      try {
        const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), {
          todoChecklist: updatedChecklist,
        });

        if (response.status === 200) {
          setTask(response.data?.task || task);
        }
      } catch (error) {
        console.error('Checklist update failed:', error);
        toast.error("Failed to update todo item.");
      }
    },
    [task, id]
  );

  const handleLinkClick = (link) => {
    try {
      const safeUrl = new URL(link.startsWith('http') ? link : `https://${link}`);
      window.open(safeUrl.toString(), '_blank');
    } catch {
      alert('Invalid URL');
    }
  };

  useEffect(() => {
    if (id) getTaskDetailsByID();
    return () => {};
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {!task ? (
          <p className="text-gray-500 text-sm">Loading task details...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">{task?.title}</h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate ? moment(task?.dueDate).format('Do MMM YYYY') : 'N/A'
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">Assigned To</label>
                  <AvatarGroup
                    avatars={task?.assignedTo?.map((u) => u?.profileImageUrl) || []}
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-slate-500">Todo Checklist</label>
                <div className="space-y-2 mt-1">
                  {task?.todoChecklist?.map((item, index) => (
                    <TodoChecklist
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                </div>
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-medium text-slate-500">Attachments</label>
                  {task.attachments.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

// Reusable Components
const InfoBox = ({ label, value }) => (
  <>
    <label className="text-lg font-medium text-slate-500">{label}</label>
    <p className="text-[14px] font-medium text-gray-700 mt-0.5">{value}</p>
  </>
);

const TodoChecklist = ({ text, isChecked, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm cursor-pointer"
    />
    <p className="text-[13px] text-gray-800">{text}</p>
  </div>
);

const Attachment = ({ link, index, onClick }) => (
  <div
    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex-1 flex items-center gap-3">
      <span className="text-xs text-gray-400 font-semibold">
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className="text-xs text-black break-words">{link}</p>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-400" />
  </div>
);
