import { useState, React, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from "../context/GlobalContext";
import { logIn } from "../apiCalls/PostData";
import Cookies from "js-cookie";
import Routes from "../routes/route";

const SignIn = () => {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [inputValue, setInputValue] = useState({
      email: "",
      password: "",
  })
  const { setUserDetails } = useContext(GlobalContext);
  const { routeChange } = Routes();

  const setValue = (e) => {
    const {name, value} = e.target;
    
    setInputValue(() => {
        return {
            ...inputValue,
            [name]: value
        }
    })
}

  const submitHandler = async (e) => {
    e.preventDefault();
        
    const { email, password } = inputValue;
    if (email === "" || password === "" ) {
      toast.error("all fields are required",{
          position: "top-center"
      });
      return;
  }
  else if(!email.match(mailFormat)){
      toast.error("Please enter proper email!",{
          position: "top-center"
      });
      return;
  }
  else {
    await logIn(email, password).then((res) => {
      if(res?.success){
        Cookies.set("token",res.token);
        setUserDetails(res.userDetails);
        localStorage.setItem("usertoken",res.token);
        setInputValue({...inputValue,email:"",password:""});
        localStorage.setItem("userDetails",JSON.stringify(res.userDetails));
        routeChange("/dashboard")
      }
      else {
        toast.error(`${res.message}`, {
          position: "top-center"
      });
      }
    })
  }
  }

    return (
        <div className="flex-1 text-xs sm:text-sm flex flex-col justify-center items-center gap-2 sm:gap-4">
          <h1 className="font-extrabold select-none text-2xl sm:text-4xl uppercase">
            Login
          </h1>
          <input
            type="text"
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
              submitHandler(e);
            }}
            className="w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900"
          >
            <h2 className="relative z-20">SUBMIT</h2>
          </button>
          <Link to="/set-password">
            <p className="text-[#EB722C] sm:text-base text-xs">
              Forgot Password?
            </p>
          </Link>
          <p>Don't have an account ? <Link className="text-[#EB722C]" to="/sign-up"> Signup </Link></p>
          <ToastContainer />
        </div>
      );
    };

export default SignIn;