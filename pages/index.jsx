import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Modal from "../components/layout/Modal";
import { useAuth } from "../context/auth/AuthContext";
import hero from "../public/hero.jpg";
import Image from "next/image";
import Login from "../components/Login";
import ProtectedRoute from "../components/ProtectedRoute";

const Landing = () => {
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { authUser } = useAuth();

  const router = useRouter();

  return (
    <div className="h-screen w-screen flex fixed left-0">
      <div className="w-1/2 h-full relative">
        <Image src={hero} fill />

        <div className="absolute opacity-20 bg-black"></div>
      </div>
      <div className="w-1/2 h-full">
        <div className="relative h-screen w-full flex flex-col items-center">
          <div className="mt-44 flex items-center space-x-3 text-4xl font-bold p-3 font-mono">
            <div>Team Tree</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525"
              />
            </svg>
          </div>
          <div className=" font-semibold text-gray-400 mb-10">
            Team Up, Collaborate, and Grow
          </div>
          <div className="w-1/2">
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
