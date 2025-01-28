import React from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";

export default function AccordionComponent() {
    const [open, setOpen] = React.useState([true, true, true]);
    const [tasks, setTasks] = React.useState([
        { id: 1, title: "Interview With Design High High High High", status: "TO_DO" },
        { id: 2, title: "Design Meeting", status: "IN_PROGRESS" },
        { id: 3, title: "Final Review", status: "COMPLETED" },
        { id: 4, title: "Interview With Design High", status: "TO_DO" },
    ]);


    const handleStatusChange = (e: any, taskId: number) => {
        const newStatus = e.target.value;
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                task.status = newStatus;
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const handleOpen = (index: number) => {
        const newOpen = [...open];
        newOpen[index] = !newOpen[index];
        setOpen(newOpen);
    };

    const renderTasksByStatus = (status: string) => {
        return tasks
            .filter((task) => task.status === status)
            .map((task) => (
                <ul key={task.id} className="border-b flex  items-center justify-between gap-4 rounded-lg pb-3 text-black-900 p-2">
                    <li className="flex  items-center w-96">
                        <input type="checkbox" id={`task-${task.id}`} className="mr-2" />
                        <span className="md:text-left ms:truncate">{task.title}</span>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">
                        <span >Due On</span>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">
                        
                        <select
                            className="border p-1 rounded"
                            onChange={(e) => handleStatusChange(e, task.id)}
                            value={task.status}
                        >
                            <option value="TO_DO">To-Do</option>
                            <option value="IN_PROGRESS">In-Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </li>
                    <li className="md:text-left truncate hidden md:grid w-80">
                        <span>Task Category</span>
                    </li>
                    <li className="hidden md:grid w-80">
                        <button className="text-lg" >
                            <i className="fa fa-ellipsis-h text-gray-600 md:text-left "></i>
                        </button>
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
                    Todo ({tasks.filter(task => task.status === "TO_DO").length})
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
                    In-Progress ({tasks.filter(task => task.status === "IN_PROGRESS").length})
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
                    Completed ({tasks.filter(task => task.status === "COMPLETED").length})
                </AccordionHeader>
                <AccordionBody className="pt-4 py-0 text-base font-normal">
                    {renderTasksByStatus("COMPLETED")}
                </AccordionBody>
            </Accordion>



        </>
    );
}
