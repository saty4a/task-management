import { useState, React, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { registerUser } from "../apiCalls/PostData";
import { GlobalContext } from "../context/GlobalContext";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import Routes from "../routes/route";

const SignUp = () => {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [inputValue, setInputValue] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const { setUserDetails } = useContext(GlobalContext);
  const { routeChange } = Routes();

  const setValue = (e) => {
    const { name, value } = e.target;

    setInputValue(() => {
      return {
        ...inputValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userName, email, password } = inputValue;
    if (userName === "" || email === "" || password === "") {
      toast.error("all fields are required", {
        position: "top-center",
      });
      return;
    } else if (!email.match(mailFormat)) {
      toast.error("Please enter proper email!", {
        position: "top-center",
      });
      return;
    } else {
      await registerUser(userName, email, password).then((res) => {
        if (res?.success) {
          Cookies.set("token", res.token);
          setUserDetails(res.userDetails);
          localStorage.setItem("usertoken", res.token);
          setInputValue({
            ...inputValue,
            userName: "",
            email: "",
            password: "",
          });
          localStorage.setItem("userDetails", JSON.stringify(res.userDetails));
          routeChange("/dashboard");
        } else {
          toast.error(`${res.message}`, {
            position: "top-center",
          });
        }
      });
    }
  };

  return (
    <div className="flex-1 text-xs sm:text-sm flex flex-col justify-center items-center gap-2 sm:gap-4">
      <h1 className="font-extrabold select-none text-2xl sm:text-4xl uppercase">
        Sign up
      </h1>
      <input
        value={inputValue.userName}
        onChange={setValue}
        name="userName"
        type="text"
        placeholder="enter user name"
        className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
      />
      <input
        type="email"
        value={inputValue.email}
        onChange={setValue}
        name="email"
        placeholder="Email Address"
        className="outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      <input
        value={inputValue.password}
        onChange={setValue}
        name="password"
        type="password"
        placeholder="Password"
        className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
      />
      <button
        onClick={(e) => {
          handleSubmit(e);
        }}
        className="w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900"
      >
        <h2 className="relative z-20">SUBMIT</h2>
      </button>
      <p className="text-center mb-2 sm:text-base text-xs">
        Already have an account ?
        <Link to="/" className="text-[#EB722C]">
          {" "}
          Signin{" "}
        </Link>
      </p>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
