import axios from "axios"

const getFunction = async (url) => {
    try {
      const response = await axios.get(url).then(function (response) {
        return response.data;
      });
      return response;
    } catch (error) {
      console.log(error);
      return error?.response?.data;
    }
};

export const validateUser = async (url) => {
    try {
        const response = await getFunction(url);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const getAllTasks = async (url) => {
    try {
        const response = await getFunction(url);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const getTaskDetails = async (url) => {
    try {
        const response = await getFunction(url);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const getAllUsers = async (url) => {
    try {
        const response = await getFunction(url);
        return response;
    } catch (error) {
        console.log(error)
        return error?.response?.data;
    }
}

export const getCollabTasks = async (url) => {
    try {
        const response = await getFunction(url);
        return response;
    } catch (error) {
        console.log(error)
        return error?.response?.data;
    }
}