import React from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { ToastContainer } from 'react-toastify';

interface Props {
    tasks: any;
    updateStatus: (newStatus: string, taskId: number) => any;
    onEdit:(id:any)=>any;
    ondelete:(id:any)=>any;

}

export default function AccordionComponent({ tasks, updateStatus,onEdit, ondelete }: Props) {
    const [open, setOpen] = React.useState([true, true, true]);
    // const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);


    const handleStatusDataChange = async (e: any, taskId: number) => {
        const newStatus = e.target.value;
        await updateStatus(newStatus, taskId)
    };

    // const toggleDropdown = () => {
    //     setIsDropdownOpen(!isDropdownOpen);
    //   };

      const handleEdit = (id:number) => {
        onEdit(id)
      };

      const handleDelete = (id:number) => {
        ondelete(id);
      };


    const handleOpen = (index: number) => {
        const newOpen = [...open];
        newOpen[index] = !newOpen[index];
        setOpen(newOpen);
    };

    const renderTasksByStatus = (status: string) => {
        // console.log(tasks);
        return tasks
            .filter((task: any) => task.taskStatus === status)
            .map((task: any) => (
                <ul key={task.id} className="border-b flex  items-center justify-between gap-4 rounded-lg pb-3 text-black-900 p-2">
                    <li className="flex  items-center w-96">
                        <input type="checkbox" id={`task-${task.id}`} className="mr-2" />
                        <span className="md:text-left ms:truncate">{task.taskTitle}</span>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">
                        <span >{task.date}</span>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">

                        <select
                            className="border p-1 rounded"
                            onChange={(e) => handleStatusDataChange(e, task.id)}
                            value={task.taskStatus}
                        >
                            <option value="TO_DO">To-Do</option>
                            <option value="IN_PROGRESS">In-Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">
                        <span>Task Category</span>
                    </li>
                    {/* <li className="hidden md:grid w-80">
                        <button className="text-lg" >
                            <i className="fa fa-ellipsis-h text-gray-600 md:text-left "></i>
                        </button>
                    </li> */}
                   <li className="flex hidden md:grid w-80">
                       <span className="flex gap-2 ">
                       <button className="text-lg" onClick={()=>handleEdit(task) } >
                            <i className="fa fa-edit text-blue-600 md:text-left "></i>
                        </button>
                        <button className="text-lg" onClick={()=>handleDelete(task.id)}>
                            <i className="fa fa-trash text-red-600 md:text-left "></i>
                        </button>
                       </span>
                    </li>
                
                </ul>
            ));
    };

    return (
        <>
            {/* Todo Accordion */}
            <Accordion open={open[0]} className="mb-2 rounded-lg border border-blue-gray-100"
                {...(undefined as any)}>
                <AccordionHeader onClick={() => handleOpen(0)} className={`border-b-0 transition-colors rounded-t-lg px-4 py-2 text-base`} style={{ backgroundColor: "#fac3ff" }}
                    {...(undefined as any)}>
                    Todo ({tasks.filter((task: any) => task.taskStatus === "TO_DO").length})
                </AccordionHeader>
                <AccordionBody className="pt-4 py-0 text-base font-normal">
                    {renderTasksByStatus("TO_DO")}
                </AccordionBody>
            </Accordion>

            {/* In-Progress Accordion */}
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

            {/* Completed Accordion */}
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

            <ToastContainer />

        </>
    );
}
