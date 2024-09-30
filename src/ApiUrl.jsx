import axios from "axios";
import CryptoJS from "crypto-js";  

const baseURL = "localhost:3020/";
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

 const getDecryptedToken = () => {
  const encryptedToken = sessionStorage.getItem("token");
  if (encryptedToken) {
    const secretKey = "s3cr3t$Key@123!";
    const decryptedToken = CryptoJS.AES.decrypt(
      encryptedToken,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  }
  return null;
};

 api.interceptors.request.use(
  (config) => {
    const token = getDecryptedToken();  

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

   

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

 api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      window.location.href = `${import.meta.env.VITE_PUBLIC_URL}/login`;
    }
    return Promise.reject(error);
  }
);

export default api;
