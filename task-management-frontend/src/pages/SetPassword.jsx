import React, { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../apiCalls/PostData.jsx";

const SetPassword = () => {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const emailRef = useRef();

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (emailRef.current.value === "") {
      toast.error("all fields are required", {
        position: "top-center",
      });
      return;
    } else if (!emailRef.current.value.match(mailFormat)) {
      toast.error("Please enter proper email!", {
        position: "top-center",
      });
      return;
    } else {
      await resetPassword(emailRef.current.value).then((res) => {
        if (res?.success) {
          toast.success("Email sent", {
            position: "top-center",
          });
        } else {
          toast.error("Check email address", {
            position: "top-center",
          });
        }
      });
    }
  };

  return (
    <div className="flex-1 text-xs sm:text-sm flex flex-col justify-center items-center gap-2 sm:gap-4">
      <h3 className="font-extrabold select-none text-2xl sm:text-4xl uppercase">
        Enter Your Email
      </h3>
      <input
        type="email"
        ref={emailRef}
        name="email"
        placeholder="Email Address"
        className="outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      <button
        onClick={(e) => {
          handleSetPassword(e);
        }}
        className="w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900"
      >
        <h2 className="relative z-20">SUBMIT</h2>
      </button>
      <ToastContainer />
    </div>
  );
};

export default SetPassword;
