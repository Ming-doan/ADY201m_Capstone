import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 10000,
});

export async function getMethod(url, config) {
  try {
    const response = await instance.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function postMethod(url, data, config) {
  try {
    const response = await instance.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}
