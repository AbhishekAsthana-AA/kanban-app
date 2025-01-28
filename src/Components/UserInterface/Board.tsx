// import React from "react";

// @material-tailwind-react
import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";


export default function Board() {



    return (<>
        <div className="grid grid-cols-3 gap-2">
            <Card    {...(undefined as any)}>
                <CardBody className="p-4 max-h-96 overflow-y-auto"    {...(undefined as any)}>
                <Typography
                        color="blue-gray"
                        className="mb-1 !text-base !font-semibold  text-black p-1 rounded-md w-32 text-center"
                        style={{ backgroundColor: "#fac3ff" }}
                        {...(undefined as any)}
                    >
                        To Do
                    </Typography>
                    <div>
                        {/* Add some long content here to demonstrate scrolling */}
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </CardBody>
            </Card>

            <Card    {...(undefined as any)}>
                <CardBody className="p-4 max-h-96 overflow-y-auto"    {...(undefined as any)}>
                <Typography
                        color="blue-gray"
                        className="mb-1 !text-base !font-semibold p-1 text-black rounded-md w-32 text-center"
                        style={{ backgroundColor: "#85d9f1" }}    {...(undefined as any)}
                    >
                        In-Progress
                    </Typography>
                    <div>
                        {/* Add some long content here to demonstrate scrolling */}
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </CardBody>
            </Card>

            <Card    {...(undefined as any)}>
                <CardBody className="p-4 max-h-96 overflow-y-auto"    {...(undefined as any)}>
                    <Typography
                        color="blue-gray"
                        className="mb-1 !text-base !font-semibold p-1 text-black rounded-md w-32 text-center"
                        style={{ backgroundColor: "#ceffcc" }}    {...(undefined as any)}
                    >
                        Completed
                    </Typography>
                    <div>
                        {/* Add some long content here to demonstrate scrolling */}
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </CardBody>
            </Card>



        </div>
    </>
        // <Card className="overflow-hidden border border-gray-300 shadow-sm">
        //   <CardBody className="p-4">
        //     <Typography
        //       color="blue-gray"
        //       className="mb-1 !text-base !font-semibold"
        //     >
        //       #1
        //     </Typography>
        //     <div className="my-4 flex items-start justify-between">
        //       <div className="flex items-center gap-3">
        //         <Avatar
        //           src="https://www.material-tailwind.com/img/avatar1.jpg"
        //           alt="Tina Andrew"
        //         />
        //         <div>
        //           <Typography color="blue-gray" variant="h6">
        //             Tina Andrew
        //           </Typography>
        //           <Typography
        //             variant="small"
        //             color="gray"
        //             className="font-medium"
        //           >
        //             Creator
        //           </Typography>
        //         </div>
        //       </div>
        //       <Button size="sm" variant="outlined" className="border-gray-300">
        //         see collection
        //       </Button>
        //     </div>
        //     <div className="grid grid-cols-3 gap-2">
        //       {imgs.map((img, key) => (
        //         <img
        //           key={key}
        //           src={img}
        //           className="h-full w-full rounded-xl object-cover"
        //           alt="imgs"
        //         />
        //       ))}
        //     </div>
        //   </CardBody>
        // </Card>
    );
}