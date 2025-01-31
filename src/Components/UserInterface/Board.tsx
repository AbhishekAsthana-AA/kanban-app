import { useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem
} from "@material-tailwind/react";
import { motion } from "framer-motion";

interface Task {
    id: number;
    taskTitle: string;
    taskCategory: string;
    date: string;
    taskStatus: string;
}

interface Props {
    tasks: any;
    onEdit: (task: Task) => void;
    ondelete: (id: any) => any;
    onUpdateTasks: (newStatus: string, taskId: number,prevTask:any) => void;
}

export default function Board({ tasks, onEdit, ondelete, onUpdateTasks }: Props) {
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);

    const columns = [
        { id: "TO_DO", title: "To Do", color: "#fac3ff", tasks: tasks.filter((task:any) => task.taskStatus === "TO_DO") },
        { id: "IN_PROGRESS", title: "In Progress", color: "#85d9f1", tasks: tasks.filter((task:any)  => task.taskStatus === "IN_PROGRESS") },
        { id: "COMPLETED", title: "Completed", color: "#ceffcc", tasks: tasks.filter((task:any)  => task.taskStatus === "COMPLETED") }
    ];

    // Start dragging a task
    const handleDragStart = (task: Task) => {
        setDraggingTask(task);
    };

    // Drop task into a new column
    const handleDrop = (newStatus: string) => {
        if (draggingTask && draggingTask.taskStatus !== newStatus) {
            onUpdateTasks(newStatus, draggingTask.id,draggingTask.taskStatus);
            setDraggingTask(null);
        }
    };
    

    return (
        <div className="grid grid-cols-3 gap-4">
            {columns.map((column) => (
                <motion.div
                    key={column.id}
                    className="p-2 border rounded-lg min-h-[300px] bg-gray-100"
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={() => handleDrop(column.id)} 
                    whileHover={{ scale: 1.02 }}
                >
                    <Typography
                        className="mb-2 text-center font-semibold p-2 rounded-md text-black"
                        style={{ backgroundColor: column.color }}
                        {...(undefined as any)}>
                        {column.title}
                    </Typography>

                    {column.tasks.length > 0 ? (
                        column.tasks.map((task:any) => (
                            <motion.div
                                key={task.id}
                                layout // Makes items smoothly transition
                                drag
                                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
                                whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                                onDragStart={() => handleDragStart(task)} 
                            >
                                <Card
                                    className="mb-2 shadow-md cursor-pointer"
                                    draggable
                                    onDragStart={() => handleDragStart(task)} 
                                    {...(undefined as any)}
                                >
                                    <CardBody className="p-3" {...(undefined as any)}>
                                        <div className="bg-white rounded-2xl">
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-lg font-semibold text-black truncate w-[200px]">{task.taskTitle}</h1>
                                                <Menu placement="bottom-end">
                                                    <MenuHandler>
                                                        <button className="text-gray-600 focus:outline-none">
                                                            <i className="fa fa-ellipsis-h text-lg"></i>
                                                        </button>
                                                    </MenuHandler>
                                                    <MenuList className="shadow-lg rounded-lg p-2 w-36 bg-white" {...(undefined as any)}>
                                                        {task.taskStatus !='COMPLETED' ?<MenuItem {...(undefined as any)}
                                                            className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                                                            onClick={() => onEdit(task)}
                                                        >
                                                            <i className="fa fa-edit text-blue-600"></i> Edit
                                                        </MenuItem>:''
                                                        
                                                    
                                                    }
                                                        <MenuItem {...(undefined as any)}
                                                            className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                                                            onClick={() => ondelete(task.id)}
                                                        >
                                                            <i className="fa fa-trash text-red-600"></i> Delete
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </div>
                                            <div className="flex justify-between text-gray-500 text-xs mt-4">
                                                <p>{task.taskCategory}</p>
                                                <p>{task.date}</p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center">No tasks</p>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
