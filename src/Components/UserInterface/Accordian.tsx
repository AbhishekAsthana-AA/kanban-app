import React from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
    Button,
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,

} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import DatePicker from 'react-datepicker';
import { motion } from "framer-motion";

interface Props {
    tasks: any;
    updateStatus: (newStatus: string, taskId: number,prevtask:any) => any;
    onEdit: (id: any) => any;
    ondelete: (id: any) => any;
    onSave: (data: any) => any;

}
interface Task {
    id: number;
    taskTitle: string;
    taskCategory: string;
    dueDate: string;
    taskStatus: string;
}

export default function AccordionComponent({ tasks, updateStatus, onEdit, ondelete, onSave }: Props) {
    const [open, setOpen] = React.useState([true, true, true]);
    const [openRowTask, setOpenRowTask] = React.useState(false)
    const [selectedTasks, setSelectedTasks] = React.useState<number[]>([]);
    const [newTask, setNewTask] = React.useState<{
        taskTitle: string;
        dueDate: Date | null;
        taskStatus: string;
        taskCategory: string;
    }>({
        taskTitle: "",
        dueDate: null,
        taskStatus: "TO_DO",
        taskCategory: "Personal",
    });
    const [draggingTask, setDraggingTask] = React.useState<Task | null>(null);
    const [prevTaskStatuses, setPrevTaskStatuses] = React.useState<{ [key: number]: string }>({});


    const handleDragStart = (task: Task) => {
        setDraggingTask(task);
    };

    const handleDrop = (newStatus: string) => {
        if (draggingTask && draggingTask.taskStatus !== newStatus) {
            updateStatus(newStatus, draggingTask.id,draggingTask.taskStatus);
            setDraggingTask(null);
        }
    };

    const handleAddTask = async () => {
        // alert('s')
        try {

            if (!newTask.taskTitle.trim()) return;
            const success = await onSave(newTask)
            console.log(newTask);
            if (success) {
                setNewTask({ taskTitle: "", dueDate: null, taskStatus: "TO_DO", taskCategory: "WORK" });
            }
        } catch (error) {
            console.error("Error saving task:", error);
        }


    };

    const handleStatusDataChange = async (e: any, taskId: number,prevTask:any) => {
        // console.log(prevTask);
        const newStatus = e.target.value;
        // console.log(newStatus);
        await updateStatus(newStatus, taskId,prevTask)
    };

    const handleEdit = (id: number) => {
        onEdit(id)
    };

    const handleDelete = (id: number) => {
        ondelete(id);
    };

    const handleOpen = (index: number) => {
        const newOpen = [...open];
        newOpen[index] = !newOpen[index];
        setOpen(newOpen);
    };

    const handleAddRowTask = () => {
        setOpenRowTask(true)
    }

    // const handleCheckboxChange = (taskId: number,prevTask:any) => {

    //     console.log(prevTask);
    //     setSelectedTasks((prev) =>
    //         prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    //     );
    // };

    const handleCheckboxChange = (taskId: number, prevTaskStatus: string) => {
        setPrevTaskStatuses((prev) => {
            const updatedPrev = { ...prev };
            if (updatedPrev[taskId]) {
                delete updatedPrev[taskId];
            } else {
                updatedPrev[taskId] = prevTaskStatus;
            }
        
            return updatedPrev;
        });
    
        setSelectedTasks((prev) =>
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        );
    };
    

    const handleStatusChange = (newStatus: string) => {
        selectedTasks.forEach((id: any) => {
            // console.log(newStatus,id,prevTaskStatuses[Number(id)]);
            updateStatus(newStatus,id,prevTaskStatuses[Number(id)])
        });
        setSelectedTasks([]);
        setPrevTaskStatuses({})
    };

    const handleBulkDelete = () => {
        selectedTasks.forEach((id) => ondelete(id));
        setSelectedTasks([]);
    };

    const renderTasksByStatus = (status: string) => {
    
        return tasks
            .filter((task: any) => task.taskStatus === status)
            .map((task: any) => (
                <motion.div
                key={task.id}
                    className=" cursor-pointer"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                >
                <ul key={task.id} className="border-b flex  items-center justify-between gap-4 rounded-lg pb-3 text-black-900 p-2">
                    <li className="flex  items-center w-96">
                        <input type="checkbox" id={`task-${task.id}`} className="mr-2"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleCheckboxChange(task.id,task.taskStatus)} />
                      <span className="md:text-left truncate w-[200px]">{task.taskTitle}</span>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">
                        <span >{task.date}</span>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">

                        <select
                            className="border p-1 rounded"
                            onChange={(e) => handleStatusDataChange(e, task.id, task.taskStatus)}
                            value={task.taskStatus}
                        >
                            <option value="TO_DO">To-Do</option>
                            <option value="IN_PROGRESS">In-Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">
                        <span>{task.taskCategory}</span>
                    </li>
                    <li className="flex hidden md:grid w-80">
                        <span className="flex gap-2 ">
                            <button className="text-lg" onClick={() => handleEdit(task)} >
                                <i className="fa fa-edit text-blue-600 md:text-left "></i>
                            </button>
                            <button className="text-lg" onClick={() => handleDelete(task.id)}>
                                <i className="fa fa-trash text-red-600 md:text-left "></i>
                            </button>
                        </span>
                    </li>

                </ul>
                </motion.div>
            ));
    };

    return (
        <>
        
            {/* Todo Accordion */}
            <motion.div
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop("TO_DO")}
           
            >
            <Accordion open={open[0]} className="mb-2 rounded-lg border border-blue-gray-100"
                {...(undefined as any)}>
                <AccordionHeader onClick={() => handleOpen(0)} className={`border-b-0 transition-colors rounded-t-lg px-4 py-2 text-base`} style={{ backgroundColor: "#fac3ff" }}
                    {...(undefined as any)}>
                    Todo ({tasks.filter((task: any) => task.taskStatus === "TO_DO").length})
                </AccordionHeader>
                <AccordionBody className="pt-4 py-0 text-base font-normal">
                    <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg">
                        {/* Task Title & Due Date */}
                        <div className="flex items-center gap-4">
                        </div>
                        {
                            openRowTask ? (
                                <>
                                    <ul className="flex gap-2 items-center justify-between">
                                        {/* Task Title Input */}
                                        <li className="text-center md:text-left w-60">
                                            <Input
                                                size="sm"
                                                label="Task Title"
                                                value={newTask.taskTitle}
                                                onChange={(e) => setNewTask({ ...newTask, taskTitle: e.target.value })}
                                                className="w-[250px] w-48 h-1 w-0 min-w-[200px] "
                                                {...(undefined as any)}
                                            />
                                        </li>

                                        {/* Date Picker */}
                                        <li className="text-center md:text-left w-60">
                                            <DatePicker
                                                dateFormat="dd-MM-yyyy"
                                                className="border border-gray-300 rounded-md p-2 w-[150px] text-base"
                                                placeholderText="Select Date"
                                                selected={newTask.dueDate || undefined} // Convert null to undefined
                                                onChange={(value: Date | null) => setNewTask({ ...newTask, dueDate: value || null })}

                                                {...(undefined as any)}
                                            />
                                        </li>

                                        {/* Status Dropdown */}
                                        <li className="text-center md:text-left w-80">
                                            <Menu>
                                                <MenuHandler>
                                                    <Button variant="outlined" size="sm" className="flex items-center gap-2 w-[40px]"  {...(undefined as any)}>
                                                        <PlusIcon className="w-4 h-4" />
                                                    </Button>
                                                </MenuHandler>
                                                <MenuList  {...(undefined as any)}>
                                                    {["TO_DO", "IN_PROGRESS", "COMPLETED"].map((taskStatus) => (
                                                        <MenuItem key={taskStatus} onClick={() => setNewTask({ ...newTask, taskStatus })}  {...(undefined as any)}>
                                                            {taskStatus.replace("_", "-")}
                                                        </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </Menu>
                                        </li>

                                        {/* Category Dropdown */}
                                        <li className="text-center md:text-left w-80">
                                            <Menu>
                                                <MenuHandler>
                                                    <Button variant="outlined" size="sm" className="flex items-center gap-2 w-[40px]"  {...(undefined as any)}>
                                                        <PlusIcon className="w-4 h-4" />
                                                    </Button>
                                                </MenuHandler>
                                                <MenuList  {...(undefined as any)}>
                                                    {["Work", "Personal"].map((taskCategory) => (
                                                        <MenuItem key={taskCategory} onClick={() => setNewTask({ ...newTask, taskCategory })}  {...(undefined as any)}>
                                                            {taskCategory}
                                                        </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </Menu>
                                        </li>
                                    </ul>

                                    <div className="flex gap-2">
                                        <Button onClick={handleAddTask} color="purple" size="sm" className="rounded-full w-[80px]"
                                            disabled={!newTask.taskTitle || !newTask.dueDate || !newTask.taskStatus || !newTask.taskCategory}

                                            {...(undefined as any)}>
                                            ADD ↩️
                                        </Button>

                                        {/* Cancel Button */}
                                        <Button variant="text" size="sm" className="w-[80px]"  {...(undefined as any)}
                                            onClick={() => { setNewTask({ taskTitle: "", dueDate: null, taskStatus: "TO_DO", taskCategory: "WORK" }); setOpenRowTask(false) }}
                                        >
                                            CANCEL
                                        </Button>
                                    </div>
                                </>
                            ) : <Button onClick={handleAddRowTask} color="purple" size="sm" className="w-[80px] bg-white-800 text-blue-800"

                                {...(undefined as any)}>
                                <i className="fa fa-plus "></i>  ADD
                            </Button>
                        }
                    </div>

                    {renderTasksByStatus("TO_DO")}
                </AccordionBody>
            </Accordion>
            </motion.div>

            {/* In-Progress Accordion */}
            <motion.div
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop("IN_PROGRESS")}
            
            >
            <Accordion open={open[1]} className="mb-2 rounded-lg border border-blue-gray-100"
                {...(undefined as any)}>
                <AccordionHeader onClick={() => handleOpen(1)} className={`border-b-0 transition-colors rounded-t-lg px-4 py-2 text-base`} style={{ backgroundColor: "#85d9f1" }}
                    {...(undefined as any)}>
                    In-Progress ({tasks.filter((task: any) => task.taskStatus === "IN_PROGRESS").length})
                </AccordionHeader>
                <AccordionBody className="pt-4 py-0 text-base font-normal">
                    {renderTasksByStatus("IN_PROGRESS")}
                </AccordionBody>
            </Accordion>
            </motion.div>

            {/* Completed Accordion */}
            <motion.div
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop("COMPLETED")}
             
            >

            <Accordion open={open[2]} className="rounded-lg border border-blue-gray-100"
                {...(undefined as any)}>
                <AccordionHeader onClick={() => handleOpen(2)} className={`border-b-0 transition-colors rounded-t-lg px-4 py-2 text-base`} style={{ backgroundColor: "#ceffcc" }}
                    {...(undefined as any)}>
                    Completed ({tasks.filter((task: any) => task.taskStatus === "COMPLETED").length})
                </AccordionHeader>
                <AccordionBody className="pt-4 py-0 text-base font-normal">
                    {renderTasksByStatus("COMPLETED")}
                </AccordionBody>
            </Accordion>
            </motion.div>


            {selectedTasks.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded-lg flex items-center gap-4 shadow-lg">
                    <span className="rounded-full border p-2">{selectedTasks.length} Tasks Selected</span>
                    <Menu>
                        <MenuHandler>
                            <Button variant="text" className="text-white rounded-full border"  {...(undefined as any)}>Status</Button>
                        </MenuHandler>
                        <MenuList className="bg-white text-black"   {...(undefined as any)}>
                            {["TO_DO", "IN_PROGRESS", "COMPLETED"].map((status) => (
                                <MenuItem key={status} onClick={() => handleStatusChange(status)}   {...(undefined as any)}>
                                    {status.replace("_", " ")}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Button color="red" className="rounded-full" onClick={handleBulkDelete}   {...(undefined as any)}>
                        Delete
                    </Button>
                    
                </div>
            )}

        </>
    );
}
