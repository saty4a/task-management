import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { GlobalContext } from "../context/GlobalContext";
import Cookies from "js-cookie";
import Routes from "../routes/route";
import DropDown from "../components/DropDown";
import { getAllTasks, getCollabTasks } from "../apiCalls/getData";
import { urls } from "../config/urls";
import TaskCard from "../components/TaskCard";
import { ToastContainer, toast } from "react-toastify";
import { socket } from "../config/socketConnection";

const DashBoard = () => {
  const displayTasks = [
    { label: "tasks", value: "" },
    { label: "upcoming", value: "upcoming" },
    { label: "overdue", value: "overdue" },
    { label: "categories", value: "categories" },
    { label: "projects", value: "projects" },
    { label: "completed", value: "completed" },
    { label: "collaborated", value: "collaborated" },
  ];
  const filterTask = [
    { label: "sort", value: "" },
    { label: "due date", value: "dueDate" },
    { label: "priority", value: "priority" },
    { label: "progress", value: "progress" },
  ];
  const notify = [
    { label: "notify", value: "" },
    { label: "due date", value: "dueDate" },
    { label: "new collab", value: "newCollab" },
  ];
  const priorityMap = {
    High: 2,
    Medium: 1,
    Low: 0,
  };
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [tasks, setTasks] = useState({
    type: "",
    data: [],
  });
  const [taskData, setTaskData] = useState();
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

  const handleLogOut = () => {
    Cookies.remove("token");
    localStorage.removeItem("userDetails");
    routeChange("/");
  };

  const getTasks = async (id) => {
    await getAllTasks(`${urls.getTasks}/${id}`).then((res) => {
      if (res.success) {
        setTasks(() => {
          return {
            ...tasks,
            data: res.data,
          };
        });
        setTaskData(res.data);
      }
    });
  };

  useEffect(() => {
    if (userDetails?._id) {
      getTasks(userDetails._id);
    }
  }, [userDetails]);

  const getCollabs = async (value) => {
    await getCollabTasks(`${urls.getCollabTasks}/${userDetails._id}`).then(
      (res) => {
        setValue(value, res.data);
      }
    );
  };

  const setValue = (value, data) => {
    if (value) {
      setTasks(() => {
        return {
          ...tasks,
          type: value,
          data: data,
        };
      });
    } else {
      setTasks(() => {
        return {
          ...tasks,
          data: data,
        };
      });
    }
  };

  const handleTasks = (e) => {
    if (e.target.value === "") {
      setTasks(() => {
        return {
          ...tasks,
          type: "",
          data: taskData,
        };
      });
    } else if (e.target.value === "upcoming") {
      const data = taskData.filter(
        (data) =>
          new Date(data.dueDate) > new Date() && data.isCompleted === false
      );
      if (data) {
        setValue(e.target.value, data);
      }
    } else if (e.target.value === "overdue") {
      const data = taskData.filter(
        (data) =>
          new Date(data.dueDate) < new Date() && data.isCompleted === false
      );
      if (data) {
        setValue(e.target.value, data);
      }
    } else if (e.target.value === "categories") {
      const data = taskData.filter((data) => data.taskType === "categories");
      if (data) {
        setValue(e.target.value, data);
      }
    } else if (e.target.value === "projects") {
      const data = taskData.filter((data) => data.taskType === "projects");
      if (data) {
        setValue(e.target.value, data);
      }
    } else if (e.target.value === "collaborated") {
      getCollabs(e.target.value);
    } else {
      const data = taskData.filter((data) => data.isCompleted !== false);
      if (data) {
        setValue(e.target.value, data);
      }
    }
  };

  const handleSort = (e) => {
    if (e.target.value === "dueDate") {
      const data = tasks.data.toSorted(
        (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
      );
      if (data) {
        setValue("", data);
      }
    } else if (e.target.value === "priority") {
      const data = tasks.data.toSorted(
        (a, b) => priorityMap[b.priority] - priorityMap[a.priority]
      );
      if (data) {
        setValue("", data);
      }
    } else {
      const data = tasks.data.toSorted((a, b) => b.progress - a.progress);
      if (data) {
        setValue("", data);
      }
    }
  };

  const handleNotify = (e) => {
    if (e.target.value === "dueDate") {
      tasks.data.map((data, index) => {
        if (
          new Date(data.dueDate) - new Date() <= 1 &&
          data.isCompleted === false
        ) {
          toast.info(`${data.title} is due`, {
            position: "top-center",
          });
        }
      });
    } else if (e.target.value === "newCollab") {
      socket.on(userDetails._id, (data) => {
        toast.info(`${data.title} is collaborated`, {
          position: "top-center",
        });
      });
    }
  };

  if (userDetails) {
    return (
      <section className="">
        <div className="flex justify-evenly items-center">
          <p onClick={handleLogOut} className="cursor-pointer">
            Logout
          </p>
          <p>Task Management</p>
          <button
            className="addButton mt-4 cursor-pointer"
            onClick={() => routeChange("/add-task")}
            id="showBtn"
          >
            <FaPlus className="m-auto" />
          </button>
        </div>
        <div className="flex justify-center gap-5 my-5">
          <DropDown options={displayTasks} onChange={handleTasks} />
          <DropDown options={filterTask} onChange={handleSort} />
          <DropDown options={notify} onChange={handleNotify} />
        </div>
        <div className="mt-5 flex flex-col justify-center items-center gap-4">
          <p>{tasks.type} tasks</p>
          {tasks.data &&
            tasks.data.map((data, index) => (
              <TaskCard data={data} key={index} />
            ))}
        </div>
        <ToastContainer />
      </section>
    );
  }
};

export default DashBoard;
