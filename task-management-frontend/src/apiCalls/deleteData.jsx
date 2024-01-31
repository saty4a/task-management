import axios from "axios"
import { urls } from "../config/urls"

export const deleteTask = async (ownerId, id) => {
    try {
        const response = await axios.delete(`${urls.deleteTasks}/${ownerId}/${id}`).then((res) => {
            return res.data;
        })
        if (response) {
            return response;
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data
    }
}