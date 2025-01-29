
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
import { doc, setDoc, serverTimestamp, collection,deleteDoc, getDocs, query, where, orderBy, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { taskCategories } from "../Utils/data";
import { Select, Option, Typography, Input } from "@material-tailwind/react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { startAt, endAt } from "firebase/firestore";
import { useAuth } from "../Hooks/auth";

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
    taskStatus:'',
    taskTitle:''
  });
  const  user  = useAuth();


  useEffect(() => {
    fetchDocuments();
  }, [payload])

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchDocuments = async () => {
    try {
      const taskDataRef = collection(db, "taskdata");

      let filters: any[] = [];
      filters.push(where("uid", "==", user.uid));
      if (payload.taskStatus) {
        filters.push(where("taskStatus", "==", payload.taskStatus));
      }
      if (payload.taskTitle) {
        filters.push(orderBy('taskTitle'));
        filters.push(startAt(payload.taskTitle));
        filters.push(endAt(payload.taskTitle + '\uf8ff'));
      }

      let q;
      if (filters.length > 0) {
        q = query(taskDataRef, ...filters);
      } else {
        q = taskDataRef;
      }
      const querySnapshot = await getDocs(q);
      const data:any = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          date: new Date(docData.dueDate.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };
      });

      setTasks(data);
      toast.success('Data Fetch Successfully');
    } catch (error:any) {
      toast.error(error.message || "Error fetching tasks");
    }
  };

  const handleFilterChange = (fieldName: any, value: any) => {
    setPayload((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  //status Change
  const handleStatusChange = async (newStatus: any, taskId: number) => {
    try {
      const taskDocRef = doc(db, "taskdata", taskId.toString());
      await updateDoc(taskDocRef, { taskStatus: newStatus });
      fetchDocuments();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleEditTask =async (data:any)=>{
    console.log(data);
    setEditTaskData(data)
    toggleModal();
  }

  const handleResetEditTask=()=>{
    setEditTaskData({})
  }

  const handleDeleteTask = async (id: string) => {
    try {
        const taskDocRef = doc(db, 'taskdata', id);
        await deleteDoc(taskDocRef);
        fetchDocuments();
        toast.success('Task deleted successfully');
    } catch (error:any) {
        toast.error('Error deleting task: ' + error.message);
        console.log(error);
    }
};

  const data = [
    {
      label: "List",
      value: "list",
      icon: 'fa fa-list',
      desc: <AccordionComponent tasks={tasks} updateStatus={handleStatusChange} onEdit={handleEditTask} ondelete={handleDeleteTask} />,
    },
    {
      label: " Board",
      value: "board",
      icon: 'fa fa-list',
      desc: <Board />
    },
  ];

 

  //save task
  const handleSaveTask = async (data: any) => {

    const res: any = await auth.currentUser
    const taskId = data.id;
    try {
      if(taskId){
        const taskDocRef = doc(db, 'taskdata', taskId);
        await updateDoc(taskDocRef, {
            ...data,
            uid: res.uid,
            timeStamp: serverTimestamp(),
        });
        toast.success('Task updated successfully');
      }else{
        const id = Date.now().toString()
        await setDoc(doc(db, 'taskdata', id), {
          ...data,
          id: id,
          uid: res.uid,
          timeStamp: serverTimestamp(),
        })
      }
     
      toggleModal();
      fetchDocuments();
      toast.success('Data Save Successfully');
      return true;
    } catch (error: any) {
      toast.error(error);
      console.log(error);
      return false;
    }
  };


  return (
    <>
      <div className="p-4">
        <Tabs value={activeTab} className="">
          <TabsHeader
            className="rounded-none border-blue-gray-50 bg-transparent p-0 w-48"
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
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Typography variant="paragraph" color="blue-gray" className="font-medium w-48"
                      {...(undefined as any)}>
                      Filter by:
                    </Typography>

                    <Select size="md" label="Category" className="overflow-hidden"
                      onChange={(value) => {
                        handleFilterChange("taskStatus", value);
                      }}
                      {...(undefined as any)}>
                      {taskCategories.map((category: any) => (
                        <Option key={category.id} value={category.id} className="truncate">
                          {category.name}
                        </Option>
                      ))}
                    </Select>

                    <Select size="md" label="Due Date" className=" overflow-hidden"      {...(undefined as any)}>
                      <Option value="asc">Oldest First</Option>
                      <Option value="desc">Newest First</Option>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Input type="text" placeholder="Search" className="w-52 pl-10 rounded-full"
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
                    <li className="text-center md:text-left w-80">Due On</li>
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
    </>
  );
}
