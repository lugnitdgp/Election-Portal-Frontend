import React, { useEffect, useState, useContext } from "react";
import Button from "../Component/Button";
import { Input } from "@nextui-org/react";
import GlugFooter from "../Component/GlugFooter";
import NitDgpHeader from "../Component/NitDgpHeader";
import { Link, useNavigate } from "react-router-dom";
import { LoginMember, totalVotes } from "../Services/api";
import Authcontext from "../Context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  let { authToken, setAuthToken, userDetails, setUserDetails, logout } =
    useContext(Authcontext);

  const [voteCntObj, setVoteCntObj] = useState();
  const [username, setUserName] = useState();
  const [pass, setPass] = useState();
  const [errorMsg, setErrMsg] = useState(" ");

  useEffect(() => {
    if (authToken) {
      if (userDetails) {
        navigate("/dashboard");
      } else navigate("/admin/elections");
    }
    getTotalVotes();
  }, [authToken]);

  const getTotalVotes = async () => {
    const res = await totalVotes();
    if (res.metadata.success) {
      // console(res.payload)
      setVoteCntObj(res.payload);
    }
  };

  const loadData = async () => {
    const data = {
      username: username,
      password: pass,
    };
    const res = await LoginMember(data);
    if (res.metadata.success === true) {
      setAuthToken(res.payload.access);
      setUserDetails(res.payload.data);
      navigate("/admin/elections");
    } else {
      setErrMsg("Invalid Credentials");
    }
  };
  return (
    <div
      className=" w-screen h-screen flex flex-col md:flex-row"
      onContextMenu={(e) => {
        if (process.env.REACT_APP_PROD === "true") e.preventDefault();
      }}
    >
      <div className=" md:w-3/5 w-full h-screen flex flex-col gap-6 py-5 relative ">
        <NitDgpHeader />
        <p className=" text-4xl md:text-2xl text-center">
          GymKhana Election Portal
        </p>
        <div className=" w-3/4 rounded-xl bg-amber-100/20 mx-auto shadow-lg   py-10 px-5">
          <p className=" text-3xl text-center">Admin Log In</p>

          <div className=" w-3/4 mx-auto py-10 flex flex-col gap-0">
            <div className=" my-3">
              <div>Admin UserName </div>
              <Input
                type="text"
                required
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </div>
            <div className=" my-3">
              <div>Admin Password </div>
              <Input
                type="password"
                required
                onChange={(e) => {
                  setPass(e.target.value);
                }}
              />
            </div>
            <div className=" text-red-500">{errorMsg}</div>
            <Button
              className={" my-3"}
              onClick={() => {
                loadData();
              }}
            >
              Sign In
            </Button>
            <div className=" hover:underline hover:text-blue-500">
              <Link to="/login">Login as Student</Link>
            </div>
          </div>
        </div>
        <GlugFooter />
      </div>
      <div className=" md:w-2/5 w-full hidden h-screen md:block bg-primary-300">
        <div className=" flex items-center justify-center flex-col h-full">
          <p className=" text-3xl">Total Votes Casted</p>

          {voteCntObj?.map((ele, index) => {
            return (
              <div
                key={index}
                className=" h-20 rounded-xl shadow-lg w-4/5 mx-auto my-1 flex flex-row justify-center items-center gap-3 "
              >
                <div className=" text-lg font-bold text-center ">
                  {" "}
                  {ele.title}
                </div>
                <div className=" text-md text-center">
                  {" "}
                  Batch: {ele.year === 0 ? "All" : ele.year}
                </div>
                <div className=" text-md text-center">
                  {" "}
                  Dept: {ele.department}
                </div>
                <div className=" text-lg text-center">
                  {" "}
                  Votes:{" "}
                  <span className=" text-red-700 font-bold">
                    {ele.total_votes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
