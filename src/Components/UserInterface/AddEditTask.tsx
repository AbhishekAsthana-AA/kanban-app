


import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Typography, Select, Option, Button } from "@material-tailwind/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { taskCategories } from "../../Utils/data";
import { useEffect } from "react";
import { serverTimestamp } from "firebase/firestore";


const categories = ["Work", "Personal"];

interface Props {
    open: any;
    handleToggle: () => any;
    onSave: (data: any) => any;
    resetEdit: () => any;
    taskEditData: any
}


export default function AddEditTask({ open, handleToggle, onSave, taskEditData, resetEdit }: Props) {

    const [imagePreview, setImagePreview] = useState(null);
    const [taskData, setTaskData] = useState<any>({});;

    // Validation Shema
    const validationSchema = Yup.object().shape({
        taskTitle: Yup.string()
            .required("Task title is required")
            .max(50, "Task title cannot exceed 200 characters"),
        description: Yup.string().required("Task description is required"),
        dueDate: Yup.date().required("Due date is required").nullable(),
        taskStatus: Yup.string().required("Task status is required"),
        taskCategory: Yup.string().required("Task status is required"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
    } = useForm({
        defaultValues: {
            taskTitle: "",
            description: "",
            dueDate: null,
            taskStatus: "",
            taskCategory: "",
        },
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        // console.log(taskEditData);
        if (taskEditData) {
            const { taskTitle, description, dueDate, taskStatus, taskCategory } = taskEditData;
            const formattedDueDate = dueDate ? new Date(dueDate.seconds * 1000) : null;
            reset({
                taskTitle: taskTitle || "",
                description: description || "",
                dueDate: formattedDueDate,
                taskStatus: taskStatus || "",
                taskCategory: taskCategory || "",
            });


            setTaskData({
                id: taskEditData.id,
                taskTitle: taskTitle || "",
                description: description || "",
                dueDate: formattedDueDate,
                taskStatus: taskStatus || "",
                img: taskEditData.img || ''
            });
            setImagePreview(taskEditData.img || null);
        } else {
            reset();
            setTaskData({});
            setImagePreview(null);
        }
    }, [taskEditData]);


    // File Code with drag and drop and preview image
    const handleFileChange = async (event: any) => {

        const file = event.target.files[0];
        if (!file) return;
        const formData = new FormData()
        formData.append("file", file)
        formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)
        formData.append('cloud_name', import.meta.env.VITE_CLOUD_NAME)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        })

        const uploadImageBaseUrl = await res.json()
        console.log(uploadImageBaseUrl.url);
        if (uploadImageBaseUrl.url) {
            setTaskData((prev: any) => ({ ...prev, img: uploadImageBaseUrl.url, uploadImgTime: serverTimestamp() }))
            displayImagePreview(file);
        }
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    const handleDrop = async (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file) return;
        const formData = new FormData()
        formData.append("file", file)
        formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)
        formData.append('cloud_name', import.meta.env.VITE_CLOUD_NAME)
        const res = await fetch('https://api.cloudinary.com/v1_1/dhhr6cbqr/image/upload', {
            method: 'POST',
            body: formData
        })
        const uploadImageBaseUrl = await res.json()
        console.log(uploadImageBaseUrl.url);
        if (uploadImageBaseUrl.url) {
            setTaskData((prev: any) => ({ ...prev, img: uploadImageBaseUrl.url, uploadImgTime: serverTimestamp() }))
            displayImagePreview(file);
        }
    };

    const displayImagePreview = (file: any) => {
        const reader: any = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    // File Code with drag and drop

    //Set form task in taskData object
    const handleFieldChange = (fieldName: any, value: any) => {
        setTaskData((prev: any) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    //Final Submission of data
    const onSubmit = async () => {
        try {

            const success = await onSave(taskData);
            if (success) {
                reset();
                resetEdit();
                handleToggle();
            }
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    // const StatusChangeTime = (statusChangeTime:any ) => {

    //     // const date = new Date((statusChangeTime.seconds * 1000) + (statusChangeTime.nanoseconds / 1000000));
    //     // const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    //     // const formattedDate = date.toLocaleString('en-US', options);
    //     // return formattedDate
    //   };


    return (
        <>
            <Dialog open={open}
                dismiss={{
                    outsidePress: false,
                } as any}
                size={taskData.id ? 'xl' : 'md'}
                data-dialog-backdrop-close="false"

                handler={handleToggle}
                {...(undefined as any)}>

                <DialogHeader    {...(undefined as any)}>Create Task</DialogHeader>

                <div className={`${taskData.id ? 'flex  gap-2' : ''}`}>

                    <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4  ${taskData.id ? 'w-[1000px]' : ''}`}>
                        <DialogBody className="overflow-y-auto max-h-[400px]"    {...(undefined as any)}>

                            <div>

                                <Controller
                                    name="taskTitle"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Input
                                                {...field}
                                                {...(undefined as any)}
                                                size="sm"
                                                label="Task Title"
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 50) {
                                                        field.onChange(e);
                                                        handleFieldChange("taskTitle", e.target.value);
                                                    }
                                                }}
                                            />
                                            {fieldState?.error && fieldState.error.type === 'max' && (
                                                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                                <div className="text-red-500 text-xs">{errors.taskTitle?.message}</div>
                            </div>

                            <div className="py-2">
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            value={field.value || ''}
                                            onChange={(value) => {
                                                field.onChange(value); // Update the form state
                                                handleFieldChange("description", value); // Update taskData
                                            }}
                                            className="h-24"
                                            placeholder="Description"
                                        />
                                    )}
                                />
                                <div className="text-red-500 text-xs">{errors.description?.message}</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 mb-4 mt-10 py-2">

                                <div className="col-span-1">
                                    <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2"    {...(undefined as any)}>
                                        Task Category
                                    </Typography>
                                    <div className="flex gap-2 mt">
                                        {categories.map((category) => (
                                            <button
                                                type="button"
                                                key={category}
                                                onClick={() => {
                                                    setValue('taskCategory', category);
                                                    handleFieldChange("taskCategory", category); // Update the form state with the selected category
                                                    clearErrors('taskCategory');          // Clear the error for taskCategory after selection
                                                }}
                                                className={`px-4 py-2 rounded-full border ${watch('taskCategory') === category
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black border-gray-300"
                                                    } transition-all duration-300`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-red-500 text-xs">
                                        {errors?.taskCategory && errors.taskCategory.message}
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2"    {...(undefined as any)}>
                                        Due On
                                    </Typography>
                                    <Controller
                                        name="dueDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                selected={field.value}
                                                onChange={(value) => {
                                                    field.onChange(value); // Update the form state
                                                    handleFieldChange("dueDate", value); // Update taskData
                                                }}
                                                dateFormat="dd-MM-yyyy"
                                                className="border border-gray-300 rounded-md p-2 w-full text-base"
                                                placeholderText="Select Date"
                                                {...(undefined as any)}
                                            />
                                        )}
                                    />
                                    <div className="text-red-500 text-xs">{errors.dueDate?.message}</div>
                                </div>

                                <div className="col-span-1">
                                    <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2"    {...(undefined as any)}>
                                        Task Status
                                    </Typography>
                                    <Controller
                                        name="taskStatus"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                size="md"
                                                label="Task Status"
                                                error={!!errors.taskStatus}
                                                onChange={(value) => {
                                                    field.onChange(value); // Update the form state
                                                    handleFieldChange('taskStatus', value); // Update taskData
                                                }}
                                                {...(undefined as any)} >
                                                {
                                                    taskCategories.map((categories: any) => (
                                                        <Option value={categories.id}>{categories.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-500 text-xs">{errors.taskStatus?.message}</div>
                                </div>
                            </div>

                            {/* Upload File */}
                            <div className="w-full">
                                <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2" {...(undefined as any)}>
                                    Attachment
                                </Typography>
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                                        </p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>

                                {/* Image Preiview */}
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="Image Preview"
                                            className="w-full h-auto max-w-xs rounded-lg shadow-md"
                                        />
                                    </div>
                                )}
                            </div>

                        </DialogBody>
                        <DialogFooter    {...(undefined as any)}>
                            <Button
                                variant="text"
                                color="red"
                                onClick={() => {
                                    handleToggle(); // Toggle modal
                                    reset(); // Reset form
                                    resetEdit()


                                }}
                                className="mr-1 rounded-full border bg-gray-200"
                                {...(undefined as any)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="gradient"
                                className="rounded-full border"
                                color="purple"
                                type="submit"
                                {...(undefined as any)}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </form>

                    {
                        taskData.id ?
                            <div className="bg-gray-100  rounded-lg shadow-md">
                                <h1 className="px-3 text-black text-lg font-semibold mb-3">Activity</h1>
                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="flex justify-between border-b py-2 text-gray-800">
                                        <span className="text-sm">You created this task</span>
                                        <span className="text-gray-500 text-sm">{taskEditData.timeStamp}</span>
                                    </div>
                                    <div className="flex justify-between border-b py-2 text-gray-800">
                                        <span className="text-sm">{taskEditData.statusChangeTrack}</span>
                                        <span className="text-gray-500 text-sm">{taskEditData.statusChangeTime}</span>
                                    </div>
                                    <div className="flex justify-between py-2 text-gray-800">
                                        <span className="text-sm">You uploaded file</span>
                                        <span className="text-gray-500 text-sm">{taskEditData.uploadImgTime}</span>
                                    </div>
                                </div>
                            </div>

                            : ''
                    }
                </div>
            </Dialog>

        </>
    );
}
