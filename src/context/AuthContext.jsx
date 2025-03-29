import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import config from "../config";

const Context = createContext(null);

export function useAuth() {
  return useContext(Context);
}

export function AuthProvider({ children }) {
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh-token");
  const [accessToken, setAccessToken] = useLocalStorage("access-token");
  const [userId, setUserId] = useLocalStorage("user-id");
  const [expiresAt, setExpiresAt] = useLocalStorage("expires-at");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get("r") || !params.get("a") || !params.get("id") || !params.get("e")) return;
    setRefreshToken(params.get("r"));
    setAccessToken(params.get("a"));
    setUserId(params.get("id"));
    setExpiresAt(params.get("e"));
    navigate(location.pathname);
  }, [location.search]);

  //   const signin = async (data) => {
  //     const { username, password } = data;
  //     try {
  //       const { data } = await axios.post(`${SERVER_URL}/auth/login`, {
  //         username,
  //         password,
  //       });
  //       setAuthModalState((prev) => ({ ...prev, open: false }));
  //       toast(data.message, { type: "success" });
  //       setUser(data.savedUser);
  //       setToken(data.accessToken);
  //     } catch (error) {
  //       console.log(error);
  //       toast(error.response.data.message, { type: "error" });
  //     }
  //   };

  //   const register = async (data) => {
  //     // email password gender username
  //     const { email, password, gender, username, relationshipStatus } = data;
  //     try {
  //       const { data } = await axios.post(`${SERVER_URL}/auth/register`, {
  //         email,
  //         password,
  //         gender,
  //         username,
  //         relationshipStatus,
  //       });
  //       setAuthModalState((prev) => ({ ...prev, open: false }));
  //       toast(data.message, { type: "success" });
  //       setUser(data.savedUser);
  //       setToken(data.accessToken);
  //     } catch (error) {
  //       toast(error.response.data.message, { type: "error" });
  //     }
  //   };

  const authGet = (url, options) => {
    if (!accessToken) {
      throw new Error("No access token");
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || ""}`,
    };
    return axios.get(`${config.serverUrl}${url}`, { headers, ...options });
  };

  //   const authPost = (url, body, options) => {
  //     if (!token) {
  //       throw new Error("No access token");
  //     }
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token || ""}`,
  //     };
  //     return axios.post(`${SERVER_URL}${url}`, body, { headers, ...options });
  //   };

    const signout = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setExpiresAt(null);
      setUserId(null);
      setUser(null);
      navigate("/");
    };

  //   const auth = { signin, register, signout, token };
  const getUser = async () => {
    await authGet("/user?userId=" + userId)
      .then(({ data }) => setUser(data))
      .catch((err) => {
        setAccessToken(null);
        setRefreshToken(null);
        setExpiresAt(null);
        setUserId(null);
        navigate("/");
      });
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("r") || params.get("a") || params.get("id") || params.get("e")) return;
    if (accessToken && !user) {
      try {
        getUser();
      } catch (error) {
        setAccessToken(null);
        setRefreshToken(null);
        setExpiresAt(null);
        setUserId(null);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  //   const actions = { authGet, authPost, getUser };
  return <Context.Provider value={{ signout, accessToken, refreshToken, userId, expiresAt, user }}>{children}</Context.Provider>;
}
