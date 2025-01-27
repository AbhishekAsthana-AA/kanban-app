import React from "react";
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
import { Card, Typography } from "@material-tailwind/react";
import type { TabProps } from "@material-tailwind/react";
import type { TabsHeaderProps } from "@material-tailwind/react";
import AddEditTask from "../Components/UserInterface/AddEditTask";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("list");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const data = [
    {
      label: "List",
      value: "list",
      icon: 'fa fa-list',
      desc: <AccordionComponent />,
    },
    {
      label: " Board",
      value: "board",
      icon: 'fa fa-list',
      desc: <Board />
    },
  ];


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
          >
            {data.map(({ label, value, icon }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value ? "text-black-900" : "text-gray-500"
                }
              >
                {/* <img src="../src/assets/view-board.png"  />     {label} */}
                {/* <img src="../src/assets/view-board.png" /> {label} */}
                <i className={icon} aria-hidden="true"></i> {label}

              </Tab>
            ))}
          </TabsHeader>

          <TabsBody>
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>

                {/* Flter By */}

                <div className="py-4">
                  
                  <Button variant="gradient"
                    onClick={toggleModal}
                    className="rounded-full border"
                    color="purple">
                    <span>Add Task</span>
                  </Button>
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

        <AddEditTask open={isModalOpen} handleToggle={toggleModal} />
      </div>
    </>
  );
}
