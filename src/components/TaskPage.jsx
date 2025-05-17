import React, { useState } from 'react';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Pagination } from './ui/pagination';
import { DatePicker } from './ui/date-picker';
import { motion, AnimatePresence } from 'framer-motion';

function TaskPage({ tasks, addTask, toggleTask, deleteTask }) {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    // Сортировка задач по дедлайну
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

    const formatDeadline = (deadline) => {
        if (!deadline) return 'No deadline';
        const date = new Date(deadline);
        return date.toLocaleString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-3/5 h-[600px] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-center text-gray-800 p-4">To-Do List</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 px-4">
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Запланировать"
                        required
                        maxLength={30}
                        className="w-full"
                    />
                    <DatePicker value={deadline} onChange={(date) => setDeadline(date)} />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Add
                    </button>
                </form>
                <div className="px-4">
                    {currentTasks.length === 0 ? (
                        <p className="text-gray-500 text-center">Пока что нет планов. Добавим!</p>
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/12"></TableHead>
                                    <TableHead className="w-6/12">Дела</TableHead>
                                    <TableHead className="w-4/12">Дата</TableHead>
                                    <TableHead className="w-1/12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {currentTasks.map((task) => (
                                        <motion.tr
                                            key={task._id}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <TableCell className="w-1/12">
                                                <Checkbox
                                                    checked={task.completed}
                                                    onCheckedChange={() => toggleTask(task._id)}
                                                />
                                            </TableCell>
                                            <TableCell className="w-6/12">
                                                <span
                                                    className={`font-medium ${
                                                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                                    }`}
                                                    style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                >
                                                    {task.title}
                                                </span>
                                            </TableCell>
                                            <TableCell className="w-4/12">
                                                <span className="text-gray-500 text-sm">{formatDeadline(task.deadline)}</span>
                                            </TableCell>
                                            <TableCell className="w-1/12 flex justify-center">
                                                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                                                    <button
                                                        onClick={() => deleteTask(task._id)}
                                                        className="text-red-500 hover:text-red-600 p-1 rounded-full transition-colors duration-200"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
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
                                                </motion.div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
                    </div>
                )}
            </Card>
        </div>
    );
}

export default TaskPage;