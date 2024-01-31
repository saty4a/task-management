import axios from "axios"
import { urls } from "../config/urls";

const postFunction = async (url,body) => {
    try {
        const response = await axios.post(url, body).then((res) => {
            return res?.data;
        })
        if (response) {
            return response;
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const registerUser = async (userName, email, password) => {
    const body = {
        userName: userName,
        email: email,
        password: password,
    };
    try {
        const response = await postFunction(urls.register,body);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
    
}

export const logIn = async (email, password) => {
    const body = {
        email: email,
        password: password,
    }
    try {
        const response = await postFunction(urls.login, body);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const resetPassword = async (email) => {
    const body = {
        email: email
    }
    try {
        const response = await postFunction(urls.setPassword, body);
        return response;
    } catch (error) {
        console.log(error)
        return error?.response?.data;
    }
}

export const forgetPassword = async (token, email, newPassword) => {
    const body = {
        token: token,
        email: email,
        newPassword: newPassword,
    };
    try {
        const response = await postFunction(urls.forgetPassword, body);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const createNewTask = async (body) => {
    try {
        const response = await postFunction(urls.addTask, body);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const addCollabUser = async (body) => {
    try {
        const response = await postFunction(urls.addCollabUsers, body);
        return response;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}