


import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Typography, Select, Option, Button} from "@material-tailwind/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { taskCategories } from "../../Utils/data";
import { auth, googleProvider,db } from "../../Firebase/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const categories = ["Work", "Personal"];

export default function AddEditTask({ open, handleToggle }) {
    const [taskDescription, setTaskDescription] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const validationSchema = Yup.object().shape({
        taskTitle: Yup.string().required("Task title is required"),
        description: Yup.string().required("Task description is required"),
        dueDate: Yup.date().required("Due date is required").nullable(),
        taskStatus: Yup.string().required("Task status is required"),
        taskCategory: Yup.string().required("Task status is required"),
    });

    const { control, handleSubmit, formState: { errors }, setValue, clearErrors, watch } = useForm({
        defaultValues: {
            taskCategory: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            displayImagePreview(file);
        }
    };

    const displayImagePreview = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log(date);
    };

    const onSubmit = (data) => {
        alert('d')
        console.log(data);
    };

    return (
        <Dialog open={open} size="md" handler={handleToggle}>
            <DialogHeader>Create Task</DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <DialogBody className="overflow-y-auto max-h-[400px]">

                    <div>
                        <Controller
                            name="taskTitle"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    size="sm"
                                    label="Task Title"

                                />
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
                                    onChange={field.onChange}
                                    className="h-24"
                                    placeholder="Description"
                                />
                            )}
                        />
                        <div className="text-red-500 text-xs">{errors.description?.message}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 mt-10 py-2">

                        <div className="col-span-1">
                            <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2">
                                Task Category
                            </Typography>
                            <div className="flex gap-2 mt">
                                {categories.map((category) => (
                                    <button
                                        type="button"
                                        key={category}
                                        onClick={() => {
                                            setValue('taskCategory', category);  // Update the form state with the selected category
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
                            <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2">
                                Due On
                            </Typography>
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd-MM-yyyy"
                                        className="border border-gray-300 rounded-md p-2 w-full text-base"
                                        placeholderText="Select Date"
                                    />
                                )}
                            />
                            <div className="text-red-500 text-xs">{errors.dueDate?.message}</div>
                        </div>

                        <div className="col-span-1">
                            <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2">
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
                                    >
                                        {
                                            taskCategories.map((categories:any) => (
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
                        <Typography variant="paragraph" color="blue-gray" className="font-medium mb-2">
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
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleToggle}
                        className="mr-1 rounded-full border bg-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        className="rounded-full border"
                        color="purple"
                        type="submit"
                    >
                        Create
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
