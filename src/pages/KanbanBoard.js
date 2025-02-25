import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from '../components/TaskCard';
import './KanbanBoard.css';
import AddTaskButton from '../components/AddTaskButton';
import AddColumnButton from '../components/AddColumnButton';
import EditableColumnTitle from '../components/EditableColumnTitle';
import EditableTaskCard from '../components/EditableTaskCard';
import EditableBoardTitle from '../components/EditableBoardTitle';
import flowLogo from '../assets/images/flow-logo.png';

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [boardTitle, setBoardTitle] = useState('Kanban Board');
  const [columns, setColumns] = useState([
    'Backlog',
    'Sprint 2',
    'Doing',
    'Completed',
  ]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const handleMessage = (event) => {
      if (event.data.type === 'TASKS_UPDATED') {
        setTasks(event.data.tasks);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(
      updatedTasks.findIndex((task) => task.id.toString() === draggableId),
      1
    );
    movedTask.status = destination.droppableId;

    const destinationTasks = updatedTasks.filter(
      (task) => task.status === destination.droppableId
    );
    destinationTasks.splice(destination.index, 0, movedTask);

    const newTasks = updatedTasks
      .filter((task) => task.status !== destination.droppableId)
      .concat(destinationTasks);

    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const handleAddTask = (column, title) => {
    const newTask = {
      id: Date.now().toString(),
      title: title,
      status: column,
      description: '',
      urgency: 'medium',
      storyPoints: '3',
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleAddColumn = (columnTitle) => {
    setColumns([...columns, columnTitle]);
  };

  const handleColumnTitleChange = (oldTitle, newTitle) => {
    const updatedColumns = columns.map((col) =>
      col === oldTitle ? newTitle : col
    );
    setColumns(updatedColumns);

    // Update tasks with the new column title
    const updatedTasks = tasks.map((task) => ({
      ...task,
      status: task.status === oldTitle ? newTitle : task.status,
    }));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id.toString() === updatedTask.id.toString() ? updatedTask : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <div className="board-title-container">
          <img src={flowLogo} alt="Board Logo" className="board-logo" />
          <EditableBoardTitle
            title={boardTitle}
            onTitleChange={setBoardTitle}
          />
        </div>
        <AddColumnButton onAddColumn={handleAddColumn} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columns.map((column) => (
            <div key={column} className="kanban-column">
              <div className="column-header">
                <EditableColumnTitle
                  title={column}
                  onTitleChange={(newTitle) =>
                    handleColumnTitleChange(column, newTitle)
                  }
                />
              </div>
              <AddTaskButton column={column} onAddTask={handleAddTask} />
              <Droppable droppableId={column}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="task-list"
                  >
                    {tasks
                      .filter((task) => task.status === column)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <EditableTaskCard
                                task={task}
                                onTaskUpdate={handleTaskUpdate}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
