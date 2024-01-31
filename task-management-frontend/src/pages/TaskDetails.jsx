import React, { useContext, useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { FaCheck, FaTrash } from "react-icons/fa6";
import DropDown from "../components/DropDown";
import { getTaskDetails } from "../apiCalls/getData";
import { urls } from "../config/urls";
import { useParams } from "react-router-dom";
import Routes from "../routes/route";
import { ToastContainer, toast } from "react-toastify";
import { changeStatusAndProgress } from "../apiCalls/putData";
import ProgressBar from "../components/ProgressBar";
import AddCollaborateUsers from "../components/AddCollaborateUsers";
import Cookies from "js-cookie";
import { addCollabUser } from "../apiCalls/PostData";
import { socket } from "../config/socketConnection";
import { GlobalContext } from "../context/GlobalContext";
import { deleteTask } from "../apiCalls/deleteData";

const TaskDetails = () => {
  const { routeChange } = Routes();
  const { id } = useParams();
  const statusOptions = [
    { label: "change status", value: "" },
    { label: "progress", value: false },
    { label: "completed", value: true },
  ];
  const [taskDetail, setTaskDetail] = useState();
  const [dueDate, setDueDate] = useState();
  const [status, setStatus] = useState({
    isCompleted: false,
    progress: 0,
  });
  const [collabUser, setCollabUser] = useState("");
  const [text, setText] = useState("");
  const { userDetails, setUserDetails } = useContext(GlobalContext);

  const handleTasks = (e) => {
    if (e.target.value === true) {
      setStatus(() => {
        return {
          ...status,
          isCompleted: e.target.value,
        };
      });
    } else {
      setStatus(() => {
        return {
          ...status,
          isCompleted: e.target.value,
        };
      });
    }
  };

  const handleProgress = (e) => {
    if (e.target.textContent > 100 || e.target.textContent < 0) {
      toast.error("progress must be 0 to 100", {
        position: "top-center",
      });
    } else {
      setStatus(() => {
        return {
          ...status,
          progress: e.target.textContent,
        };
      });
    }
  };

  const handleTaskDetails = () => {
    getTaskDetails(`${urls.taskDetails}/${id}`).then((res) => {
      if (res?.success) {
        setTaskDetail(res.data);
        const data = res?.data?.dueDate.split("T");
        const date = new Date(data[0]).toLocaleDateString();
        setDueDate(date);
        setStatus(() => {
          return {
            ...status,
            isCompleted: res?.data?.isCompleted,
            progress: res?.data?.progress,
          };
        });
      }
      else {
        toast.error(`${res.message}`, {
          position: "top-center"
      });
      setTimeout(() => {
        routeChange("/dashboard");
      }, 2000);
      }
    });
  };

  const giveRealTimeUpdate = () => {
    if (taskDetail.collaborateUsers.length > 0) {
      socket.emit("updateStatus", {
        taskId: id,
        progress: status.progress,
        isCompleted: status.isCompleted,
      });
    }
  };

  const handleChange = async () => {
    if (status.isCompleted === "") {
      toast.error("status cannot be empty", {
        position: "top-center",
      });
    } else {
      await changeStatusAndProgress(id, status).then((res) => {
        if (res?.success) {
          handleTaskDetails();
          toast.success("task updated successfully", {
            position: "top-center",
          });
          setTimeout(() => {
            routeChange("/dashboard");
          }, 3000);
          giveRealTimeUpdate();
        }
        else {
          toast.error(`${res.message}`, {
            position: "top-center"
        });
        }
      });
    }
    if (collabUser !== "") {
      const body = {
        id: taskDetail._id,
        userId: collabUser,
      };
      await addCollabUser(body).then((res) => {
        if (res?.success) {
          socket.emit("newCollab", {
            userId: collabUser,
            title: taskDetail.title,
          });
          toast.success("user added successfully", {
            position: "top-center",
          });
          setText("");
          setCollabUser("");
        }
        else {
          toast.error(`${res.message}`, {
            position: "top-center"
        });
        }
      });
    }
  };

  const handleDelete = async () => {
    await deleteTask(userDetails?._id, id).then((res) => {
      if (res?.success) {
        toast.success("task deleted successfully",{
          position: "top-center",
        })
        setTimeout(() => {
          routeChange("/dashboard");
        }, 2000);
      }
      else {
        toast.error(`${res.message}`, {
          position: "top-center"
      });
      }
    })
  }

  useEffect(() => {
    if (taskDetail?._id) {
      socket.on(taskDetail._id, (data) => {
        setTaskDetail({
          ...taskDetail,
          isCompleted: data.isCompleted,
          progress: data.progress,
        });
        setStatus({
          ...status,
          isCompleted: data.isCompleted,
          progress: data.progress,
        });
      });
    }
  }, [socket, taskDetail]);

  useEffect(() => {
    if (Cookies.get("token")) {
      handleTaskDetails();
      if (localStorage.getItem("userDetails") !== null) {
        setUserDetails(JSON.parse(localStorage.getItem("userDetails")));
      }
    } else {
      routeChange("/");
    }
  }, []);

  if (taskDetail) {
    return (
      <section className="">
        <button
          className="addButton my-4 ms-4"
          onClick={() => routeChange("/dashboard")}
        >
          <FaChevronLeft className="m-auto" />
        </button>
        <h2 className="title text-2xl text-center mb-5">{taskDetail?.title}</h2>
        <p className="content border-2 h-[15rem] mx-3 overflow-auto xl:w-2/3 xl:m-auto">
          {taskDetail?.description}
        </p>
        <div className="flex justify-center items-center flex-col md:flex-row gap-4 my-5">
          <p>priority: {taskDetail?.priority}</p>
          <p>due date: {dueDate}</p>
          <p>type: {taskDetail?.taskType}</p>
        </div>
        <div className="flex justify-center">
          <AddCollaborateUsers
            taskDetail={taskDetail}
            text={text}
            setText={setText}
            setCollabUser={setCollabUser}
          />
        </div>
        <div className="flex justify-center items-center gap-2 my-5">
          <p className="mb-[2px]">
            {taskDetail.isCompleted ? "completed" : "progress"}
          </p>
          <DropDown options={statusOptions} onChange={handleTasks} />
          <p className="text-center ms-5">
            progress-percent:{" "}
            <span className="" onInput={handleProgress} contentEditable="true">
              {status?.progress}
            </span>
          </p>
        </div>
        <div className="m-auto w-5/6 xl:w-1/3 ">
          <ProgressBar bgColor={"#6a1b9a"} progress={status.progress} />
        </div>
        <div className="flex flex-row justify-center items-center gap-2">
          <button className="deleteBtn" onClick={() => handleDelete()}>
            <FaTrash className="m-auto" />
            </button>
          <button className="modifyBtn" onClick={() => handleChange()}>
            <FaCheck className="m-auto" />
          </button>
        </div>
        <ToastContainer />
      </section>
    );
  }
};

export default TaskDetails;
