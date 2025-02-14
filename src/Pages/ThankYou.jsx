import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(interval);
        navigate("/login");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-300" onContextMenu={(e)=> {if(process.env.REACT_APP_PROD === 'true') e.preventDefault()}}>
      <div className="text-4xl m-4  font-extrabold">
        {" "}
        ThankYou for your Time
      </div>
      <div className="text-xl m-2">
        You have voted successfully on all the Elections you were eligible to
        vote
      </div>
      <div className="text-lg">
        Redirecting to Login Screen in{" "}
        <span className="font-semibold text-blue-900">{seconds}</span> seconds
      </div>
    </div>
  );
}

export default ThankYou;
