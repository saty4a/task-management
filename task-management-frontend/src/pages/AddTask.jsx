import React, { useContext, useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import DropDown from "../components/DropDown";
import { DatePicker } from "antd";
import Routes from "../routes/route";
import { GlobalContext } from "../context/GlobalContext";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { createNewTask } from "../apiCalls/PostData";

const AddTask = () => {
  const priorityOptions = [
    { label: "priority", value: "" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  const taskType = [
    { label: "Type", value: "" },
    { label: "categories", value: "categories" },
    { label: "projects", value: "projects" },
  ];

  const [inputValue, setInputValue] = useState({
    title: "",
    desc: "",
    priority: "",
    taskType: "",
    dueDate: "",
  });
  const { userDetails, setUserDetails } = useContext(GlobalContext);

  const { routeChange } = Routes();
  useEffect(() => {
    if (Cookies.get("token")) {
      if (localStorage.getItem("userDetails") !== null) {
        setUserDetails(JSON.parse(localStorage.getItem("userDetails")));
      }
    } else {
      routeChange("/");
    }
  }, []);

  function handleDate(date, dateString) {
    if (dateString) {
      const newDate = new Date(dateString).toISOString();
      setInputValue(() => {
        return {
          ...inputValue,
          dueDate: newDate,
        };
      });
    }
  }

  const setValue = (e) => {
    const { name, value } = e.target;

    setInputValue(() => {
      return {
        ...inputValue,
        [name]: value,
      };
    });
  };

  const addTask = async () => {
    if (
      inputValue.title === "" ||
      inputValue.desc === "" ||
      inputValue.dueDate === "" ||
      inputValue.priority === "" ||
      inputValue.taskType === ""
    ) {
      toast.error("all fields are required", {
        position: "top-center",
      });
      return;
    }
    const body = { ...inputValue, ownerId: userDetails._id };
    await createNewTask(body).then((res) => {
      if (res.success) {
        toast.success("task created successfully", {
          position: "top-center",
        });
        setInputValue({
          ...inputValue,
          title: "",
          desc: "",
          dueDate: "",
          priority: "",
          taskType: "",
        });
        routeChange("/dashboard");
      } else {
        toast.error(`"Invalid inputs"`, {
          position: "top-center",
        });
      }
    });
  };

  if (userDetails) {
    return (
      <section className="">
        <button
          className="addButton my-4 ms-4 cursor-pointer"
          onClick={() => routeChange("/dashboard")}
          id="crossBtn"
        >
          <FaChevronLeft className="m-auto" />
        </button>
        <div className="flex flex-col items-center">
          <div className="mb-3 inputForm px-3 flex flex-col gap-3 items-center">
            <input
              type="text"
              placeholder="Title"
              name="title"
              id="addTitle"
              value={inputValue.title}
              onChange={setValue}
              className="inputTitle text-4xl"
            />
            <textarea
              id="addContext"
              className="inputContent"
              name="desc"
              rows="10"
              value={inputValue.desc}
              onChange={setValue}
              placeholder="Write Description"
            ></textarea>
          </div>
          <div className="flex flex-row gap-2 justify-center">
            <DropDown
              options={priorityOptions}
              onChange={setValue}
              name={"priority"}
            />
            <DropDown
              options={taskType}
              onChange={setValue}
              name={"taskType"}
            />
            <DatePicker
              onChange={handleDate}
              className="w-1/3 md:w-[10rem]"
              placeholder="due Date"
            />
          </div>
          <button
            className="addButton mt-4"
            onClick={() => addTask()}
            id="addBtn"
            name="add"
            type="submit"
          >
            <FaCheck className="m-auto" />
          </button>
        </div>
        <ToastContainer />
      </section>
    );
  }
};

export default AddTask;
