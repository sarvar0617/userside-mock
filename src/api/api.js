import axios from "axios";

const api = axios.create({
  baseURL: "https://680fc38127f2fdac240f4f99.mockapi.io/react",
  headers: { "Content-Type": "application/json" },
});

export default api;
