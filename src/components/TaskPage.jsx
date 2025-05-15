import React, { useState, useEffect } from 'react';
import { Card, Button, Datepicker, Checkbox, TextInput, Pagination, Table } from 'flowbite-react';

function TaskPage({ tasks, addTask, toggleTask, deleteTask }) {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;
        const deadlineString = deadline ? deadline.toISOString().split('T')[0] + 'T00:00:00.000Z' : '';
        addTask(title, deadlineString);
        setTitle('');
        setDeadline(null);
    };

    const onPageChange = (page) => setCurrentPage(page);

    // Функция для форматирования даты с днём недели
    const formatDeadline = (deadline) => {
        if (!deadline) return 'No deadline';
        const date = new Date(deadline);
        return date.toLocaleString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).replace(/(\d+) (\w+)/, '$1 $2');
    };

    // Кастомный рендер для Datepicker
    const renderCustomInput = (date) => {
        return date ? formatDeadline(date) : 'Select a date';
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full bg-beige-50">
                <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">To-Do List</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <TextInput
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Запланировать"
                        required
                    />
                    <Datepicker
                        value={deadline}
                        onSelectedDateChanged={(date) => setDeadline(date)}
                        showClearButton
                        showTodayButton
                        renderInputValue={renderCustomInput} // Кастомный рендер
                    />
                    <Button type="submit" color="purple">
                        Add
                    </Button>
                </form>
                <div className="space-y-3">
                    {currentTasks.length === 0 ? (
                        <p className="text-gray-500 text-center">Пока что нет планов. Добавим!</p>
                    ) : (
                        <Table hoverable className="w-full">
                            <Table.Head>
                                <Table.HeadCell></Table.HeadCell>
                                <Table.HeadCell>Дела</Table.HeadCell>
                                <Table.HeadCell>Дата</Table.HeadCell>
                                <Table.HeadCell></Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {currentTasks.map((task, index) => (
                                    <React.Fragment key={task._id}>
                                        <Table.Row className="bg-white">
                                            <Table.Cell className="w-1/12">
                                                <Checkbox
                                                    checked={task.completed}
                                                    onChange={() => toggleTask(task._id)}
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="w-6/12">
                                                  <span className={`font-medium truncate-text ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                      {task.title}
                                                  </span>
                                            </Table.Cell>
                                            <Table.Cell className="w-4/12">
                                                  <span className="text-gray-500 text-sm">
                                                      {formatDeadline(task.deadline)}
                                                  </span>
                                            </Table.Cell>
                                            <Table.Cell className="w-1/12 flex justify-center items-center">
                                                <button
                                                    onClick={() => deleteTask(task._id)}
                                                    className="text-red-500 hover:text-red-600 transition-colors"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 trash-icon"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M3 7h18"
                                                        />
                                                    </svg>
                                                </button>
                                            </Table.Cell>
                                        </Table.Row>

                                    </React.Fragment>
                                ))}
                            </Table.Body>
                        </Table>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}

export default TaskPage;