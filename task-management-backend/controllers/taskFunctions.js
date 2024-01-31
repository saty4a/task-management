import { taskModel } from "../models/taskModel.js";

//create new task
export const addTask = async (request, response, next) => {
  try {
    const newTask = await new taskModel({
      ownerId: request.body.ownerId,
      title: request.body.title,
      description: request.body.desc,
      dueDate: request.body.dueDate,
      priority: request.body.priority,
      taskType: request.body.taskType,
      progress: 0,
    }).save();
    if (!newTask?._id) {
      response.status(400);
      return next(new Error("Failed to take create new task"));
    }
    return response.status(200).json({
      data: newTask,
      message: "Task created successfully.",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

//get tasks by owner id
export const getAllTasks = async (request, response, next) => {
  try {
    const { id } = request.params;

    const tasks = await taskModel.find({ ownerId: id });
    if (tasks) {
      response.status(200).json({
        data: tasks,
        message: "all tasks",
        success: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};

//get task by taskId
export const taskDetails = async (request, response, next) => {
  try {
    const { id } = request.params;
    const taskDetails = await taskModel.findOne({ _id: id });
    if (!taskDetails) {
      response.status(400);
      return next(new Error("No tasks"));
    }
    response.status(200).json({
      data: taskDetails,
      message: "your task details",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

//change task status
export const changeStatus = async (request, response, next) => {
  try {
    const { id } = request.params;
    const taskDetails = await taskModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          isCompleted: request.body.isCompleted,
          progress: request.body.progress,
        },
      },
      { new: true }
    );
    if (taskDetails?._id) {
      response.status(200).json({
        data: taskDetails,
        message: "task status updated",
        success: true,
      });
    } else {
      response.status(400);
      return next(new Error("Failed to update status"));
    }
  } catch (error) {
    return next(error);
  }
};

//change progress status
export const changeProgress = async (request, response, next) => {
  try {
    const { id, progress } = request.params;
    const taskDetails = await taskModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          progress: progress,
        },
      },
      { new: true }
    );
    if (taskDetails?._id) {
      response.status(200).json({
        data: taskDetails,
        message: "task progress updated",
        success: true,
      });
    }
    response.status(400);
    return next(new Error("Failed to update progress"));
  } catch (error) {
    return next(error);
  }
};

//add collaborate users
export const addCollaborateUsers = async (request, response, next) => {
  try {
    const taskDetails = await taskModel.findOne({ _id: request.body.id });
    if (taskDetails === null) {
      response.status(400);
      return next(new Error("task not found."));
    }
    if (taskDetails.collaborateUsers.includes(request.body.userId)) {
      response.status(409);
      return next(new Error("User already collaborated"));
    }
    taskDetails.collaborateUsers = [
      ...taskDetails.collaborateUsers,
      request.body.userId,
    ];
    const task = await taskModel.findByIdAndUpdate(
      {
        _id: request.body.id,
      },
      {
        $set: {
          collaborateUsers: taskDetails.collaborateUsers,
        },
      },
      { new: true }
    );
    if (task?._id) {
      response.status(200).json({
        data: task,
        message: "task collbarate updated",
        success: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};

//get collaborated tasks
export const getCollabTasks = async (request, response, next) => {
  try {
    const { id } = request.params;
    const tasks = await taskModel.find({ ownerId: { $ne: id } });
    if (tasks) {
      const data = tasks.filter((data) =>
        data.collaborateUsers.find((user) => user === id)
      );
      if (data) {
        response.status(200).json({
          data: data,
          message: "all tasks",
          success: true,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//delete tasks
export const deleteTask = async (request, response, next) => {
  try {
    const { ownerId, id } = request.params;
    const task = await taskModel.findOneAndDelete({ $and: [{_id: id}, {ownerId: ownerId}] });
    if (!task?._id) {
      response.status(400);
      return next(new Error("You cannot delete this task as you are not owner"));
    }
    response.status(200).json({
      data: null,
      message: "task deleted",
      success: true,
    })
  } catch (error) {
    return next(error);
  }
}