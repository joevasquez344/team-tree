import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import useCheckbox from "../hooks/inputs/useCheckbox";

const Login = () => {
  const router = useRouter();
  const { login, authUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const { passwordHidden, handlePasswordCheckbox } = useCheckbox();

  const handleLogin = () => {
    login(form.email, form.password);
  };

    return (
      <div className="flex flex-col justify-center items-center">
        <div className="w-full">
          <form className="bg-white  rounded mx-auto mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                onChange={handleInputChange}
                name="email"
                value={form.email}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                onChange={handleInputChange}
                name="password"
                value={form.password}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={passwordHidden ? "password" : "text"}
                placeholder="Password - At least 6 characters"
              />
              {/* <p className="text-red-500 text-xs italic">
                Please choose a password.
              </p> */}
              <div className="flex items-center mt-2 space-x-2 text-sm">
                <input
                  className="cursor-pointer"
                  onChange={handlePasswordCheckbox}
                  type="checkbox"
                />
                <span>Show Password</span>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-100 hover:text-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none transition ease-in-out cursor-pointer duration-200 focus:shadow-outline"
                type="button"
              >
                Sign In
              </button>
              <div>
                Don't have an account?{" "}
                <span
                  onClick={() => router.push(`/register`)}
                  className="text-blue-500 font-bold cursor-pointer"
                >
                  Register
                </span>
              </div>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2020 Acme Corp. All rights reserved.
          </p>
        </div>
      </div>
    );
};

export default Login;
