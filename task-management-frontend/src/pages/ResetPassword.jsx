import { useEffect, useState } from "react";
import Routes from "../routes/route";
import { useParams } from "react-router-dom";
import { urls } from "../config/urls";
import { validateUser } from "../apiCalls/getData";
import { forgetPassword } from "../apiCalls/PostData";
import { ToastContainer, toast } from "react-toastify";

const ResetPassword = () => {
  const { routeChange } = Routes();
  const [showResetPasswordPage, setShowResetPasswordPage] = useState(false);
  const { id, token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateToken = async () => {
    const response = await validateUser(`${urls.resetPassword}/${id}/${token}`);
    if (response.success) {
      setEmail(response.data.email);
      response.success
        ? setShowResetPasswordPage(true)
        : setShowResetPasswordPage(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== "") {
      await forgetPassword(token, email, password).then((res) => {
        if (res?.success) {
          setPassword("");
          routeChange("/");
        } else {
          toast.error(`${res.message}`, {
            position: "top-center",
          });
        }
      });
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (showResetPasswordPage) {
    return (
      <div className="flex-1 text-xs sm:text-sm flex flex-col justify-center items-center gap-2 sm:gap-4">
        <h3 className="font-extrabold select-none text-2xl sm:text-4xl uppercase">
          Reset Your Password
        </h3>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          name="password"
          type="password"
          placeholder="Enter Your New Password"
          className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
        />
        <button
          onClick={(e) => {
            handleResetPassword(e);
          }}
          className="w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900"
        >
          <h2 className="relative z-20">SAVE</h2>
        </button>
        <ToastContainer />
      </div>
    );
  }
  return <p className="text-center">Invalid link</p>;
};

export default ResetPassword;
