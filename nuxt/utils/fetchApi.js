import axios from "axios";

export const fetchApi = async (url, method, body) => {
    let token = localStorage.getItem("token")
    const instance = axios.create({
        baseURL: "http://localhost:3001",
        headers: {
            token: token
        }
    })

    return await instance({
        url: url,
        method: method,
        data: body
    })
}
