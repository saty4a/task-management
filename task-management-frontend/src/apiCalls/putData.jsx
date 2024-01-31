import axios from "axios"
import { urls } from "../config/urls"

export const changeStatusAndProgress = async (id,body) => {
    try {
        const response = await axios.put(`${urls.changeStatus}/${id}`,body).then((res) => {
            return res?.data;
        })
        if (response) {
            return response;
        }
    } catch (error) {
        console.log(error)
        return error?.response?.data;
    }
}