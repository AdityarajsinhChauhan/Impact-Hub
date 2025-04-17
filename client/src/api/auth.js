import axios from "../utils/axios";

export const manualLogin = async (loginForm) => {
  const res = await axios.post("/auth/login", loginForm);
  return res.data;
};

export const googleLogin = async (credential) => {
  const res = await axios.post("/auth/google", {
    tokenId: credential,
  });
  return res.data;
};

export const signup = async (signupForm) => {
  const { name, email, password } = signupForm;
  const res = await axios.post("/auth/signup", {
    name,
    email,
    password,
  });
  return res.data;
};
