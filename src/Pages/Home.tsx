
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button
} from "@material-tailwind/react";
import AccordionComponent from "../Components/UserInterface/Accordian";
import Board from "../Components/UserInterface/Board";
import AddEditTask from "../Components/UserInterface/AddEditTask";
import { auth, db } from "../Firebase/firebase";
import { doc, setDoc, serverTimestamp, collection, deleteDoc, getDocs, query, where, orderBy, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
// import { taskCategories } from "../Utils/data";
import { Select, Option, Typography, Input } from "@material-tailwind/react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { startAt, endAt, writeBatch } from "firebase/firestore";
import { useAuth } from "../Hooks/auth";
import { ToastContainer } from 'react-toastify';
import DatePicker from "react-datepicker";
// import { Timestamp } from "firebase/firestore";
const categories = ["Work", "Personal"];
interface Task {
  id: string;
  taskStatus: string;
  taskTitle: string;
  timeStamp: {
    seconds: number;
    nanoseconds: number;
  };
  uid: string;
  description: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTaskData, setEditTaskData] = useState({});
  const [payload, setPayload] = useState({
    taskCategory: '',
    taskTitle: '',
    startDate: null as Date | null,  // Ensure this is Date | null
    endDate: null as Date | null     // Ensure this is Date | null
  });
  const user: any = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (end !== null) {
      // console.log(end);
      handleFilterChange("startDate", start);
      handleFilterChange("endDate", end);
    }


  };

  useEffect(() => {
    fetchDocuments();
  }, [payload, sortOrder])

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchDocuments = async () => {

    // console.log(payload);

    try {
      const taskDataRef = collection(db, "taskdata");

      let filters: any[] = [];
      filters.push(where("uid", "==", user.uid));
      if (payload.taskCategory) {
        filters.push(where("taskCategory", "==", payload.taskCategory));
      }
      if (payload.taskTitle) {
        filters.push(orderBy('taskTitle'));
        filters.push(startAt(payload.taskTitle));
        filters.push(endAt(payload.taskTitle + '\uf8ff'));
      }

      // if (payload.startDate && payload.endDate) {
      //   const startTimestamp = Timestamp.fromDate(new Date(payload.startDate)); // Convert to Date
      //   const endTimestamp = Timestamp.fromDate(new Date(payload.endDate)); // Convert to Date

      //   filters.push(orderBy("dueDate"));
      //   filters.push(startAt(startTimestamp));
      //   filters.push(endAt(endTimestamp));

      // }

      let q;
      if (filters.length > 0) {
        q = query(taskDataRef, ...filters);
      } else {
        q = taskDataRef;
      }
      const querySnapshot = await getDocs(q);
      let data: any = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          date: new Date(docData.dueDate.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          statusChangeTime: docData.statusChangeTime ? new Date(docData.statusChangeTime.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }) : '',
          timeStamp: new Date(docData.timeStamp.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }),
          uploadImgTime: docData.uploadImgTime ? new Date(docData.uploadImgTime.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }) : '',
        };
      });

      if (payload.startDate && payload.endDate) {
        const startDate = new Date(payload.startDate);
        const endDate = new Date(payload.endDate);

        data = data.filter((task: any) => {
          const taskDueDate = new Date(task.date);
          return taskDueDate >= startDate && taskDueDate <= endDate;
        });
        // setTasks(filteredTasks);
      }

      data.sort((a: any, b: any) => {
        const dateA = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate.seconds * 1000);
        const dateB = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate.seconds * 1000);

        return sortOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });

      setTasks(data);
      toast.success('Data Fetch Successfully');
    } catch (error: any) {
      toast.error(error.message || "Error fetching tasks");
    }
  };

  const handleFilterChange = (fieldName: any, value: any) => {
    setPayload((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };


  const formatStatus = (status: string) => {
    switch (status) {
      case "TO_DO":
        return "To-Do";
      case "IN_PROGRESS":
        return "In-Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  //status Change
  const handleStatusChange = async (newStatus: any, taskId: number, prevTask: any) => {
    try {
      const formattedPrevStatus = formatStatus(prevTask);
      const formattedNewStatus = formatStatus(newStatus);
      const taskDocRef = doc(db, "taskdata", taskId.toString());
      await updateDoc(taskDocRef, {
        taskStatus: newStatus,
        statusChangeTrack: `You Changed status from ${formattedPrevStatus} to ${formattedNewStatus}`,
        statusChangeTime: serverTimestamp()
      });
      fetchDocuments();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleEditTask = async (data: any) => {
    console.log(data);
    setEditTaskData(data)
    toggleModal();
  }

  const handleResetEditTask = () => {
    setEditTaskData({})
  }

  const handleDeleteTask = async (id: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this task?');
    if (isConfirmed) {
      try {
        const taskDocRef = doc(db, 'taskdata', id);
        await deleteDoc(taskDocRef);
        fetchDocuments();
        toast.success('Task deleted successfully');
      } catch (error: any) {
        toast.error('Error deleting task: ' + error.message);
        console.log(error);
      }
    } else {
      toast.info('Task deletion canceled');
    }
  };


  const handleBulkDelete = async (selectedTasks: any) => {
    if (selectedTasks.length === 0) {
      toast.info("No tasks selected for deletion.");
      return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`);
    if (!isConfirmed) {
      toast.info("Bulk delete canceled.");
      return;
    }

    try {
      const batch = writeBatch(db);
      selectedTasks.forEach((taskId: any) => {
        const taskDocRef = doc(db, "taskdata", taskId);
        batch.delete(taskDocRef);
      });
      await batch.commit();
      fetchDocuments();
      toast.success("Tasks deleted successfully.");
    } catch (error: any) {
      toast.error("Error deleting tasks: " + error.message);
      console.log(error);
    }
  };

  //save task
  const handleSaveTask = async (data: any) => {

    const res: any = await auth.currentUser
    const taskId = data.id;
    try {
      if (taskId) {
        const taskDocRef = doc(db, 'taskdata', taskId);
        await updateDoc(taskDocRef, {
          ...data,
          uid: res.uid,
          timeStamp: serverTimestamp(),
        });
        toast.success('Task updated successfully');
      } else {
        const id = Date.now().toString()
        await setDoc(doc(db, 'taskdata', id), {
          ...data,
          id: id,
          uid: res.uid,
          timeStamp: serverTimestamp(),
        })
      }

      fetchDocuments();
      toast.success('Data Save Successfully');
      return true;
    } catch (error: any) {
      toast.error(error);
      console.log(error);
      return false;
    }
  };

  const data = [
    {
      label: "List",
      value: "list",
      icon: 'fa fa-list',
      desc: <AccordionComponent tasks={tasks} updateStatus={handleStatusChange} onEdit={handleEditTask} ondelete={handleDeleteTask}
        onSave={handleSaveTask} bulkDelete={handleBulkDelete} />,
    },
    {
      label: " Board",
      value: "board",
      icon: 'fa fa-file',
      desc: <Board tasks={tasks} onEdit={handleEditTask} ondelete={handleDeleteTask}
        onUpdateTasks={handleStatusChange} />
    },
  ];


  return (
    <>
      <div className="p-4">
        <Tabs value={activeTab} className="">
          <TabsHeader
            className="rounded-none border-blue-gray-50 bg-transparent p-0 w-48 hidden md:flex"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
            {...(undefined as any)} >
            {data.map(({ label, value, icon }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value ? "text-black-900" : "text-gray-500"
                }
                {...(undefined as any)} >
                <i className={icon} aria-hidden="true"></i> {label}

              </Tab>
            ))}
          </TabsHeader>

          <TabsBody {...(undefined as any)}>
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>

                {/* Flter By */}
                <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-4">

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <Typography variant="paragraph" color="blue-gray" className="font-medium w-48"
                      {...(undefined as any)}>
                      Filter by:
                    </Typography>

                    <Select size="md" label="Category" className="overflow-hidden "
                      value={payload.taskCategory}
                      onChange={(value) => {
                        handleFilterChange("taskCategory", value);
                      }}
                      {...(undefined as any)}>
                      {categories.map((category: any) => (
                        <Option key={category} value={category} className="truncate">
                          {category}
                        </Option>
                      ))}
                    </Select>

                    <DatePicker
                      selected={startDate}
                      onChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      isClearable
                      placeholderText="Select date range"
                      dateFormat="yyyy-MM-dd"
                      className="border p-2 rounded"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Input type="text" placeholder="Search" className="w-52 pl-10 rounded-full"
                        value={payload.taskTitle}
                        onChange={(e) => {
                          handleFilterChange("taskTitle", e.target.value);
                        }}
                        {...(undefined as any)} />
                      <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <Button      {...(undefined as any)}
                      variant="gradient"
                      onClick={toggleModal}
                      className="rounded-full"
                      color="purple"
                    >
                      ADD TASK
                    </Button>
                  </div>
                </div>

                {/* Header */}
                {value === "list" ? (
                  <ul className="border-t flex  items-center justify-between gap-4 p-2 hidden md:flex">
                    <li className="text-center md:text-left w-96">Task Name</li>
                    <li className="text-center md:text-left w-80">
                      Due On
                      <button
                        className="ml-2 text-sm font-bold cursor-pointer"
                        onClick={() => {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                      >
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </button>
                    </li>
                    <li className="text-center md:text-left w-80">Task Status</li>
                    <li className="text-center md:text-left w-80">Task Category</li>
                    <li className="text-center md:text-left w-80"></li>

                  </ul>
                ) : null}

                {/* Accordian */}
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
        <AddEditTask open={isModalOpen} handleToggle={toggleModal}
          onSave={handleSaveTask} taskEditData={editTaskData} resetEdit={handleResetEditTask} />
      </div>

      <ToastContainer />
    </>
  );
}
