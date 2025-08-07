"use client";

import React, { useEffect, useState } from "react";
import {
  handlePasswordChange,
  isValid as check,
  DeleteAll,
} from "@/actions/route";
import { handlecopy } from "@/lib/copy";
import Image from "next/image";

const SetPassword = ({
  setshowpopup,
  isHere,
  userId,
  setEncryption_Passord,
  setisHere,
}) => {
  const [Password, setPassword] = useState("");
  const [Error, setError] = useState(false);
  const [loading, setloading] = useState(false);
  const [Message, setMessage] = useState(
    "The password is not correct Try again"
  );
  const [forgot, setforgot] = useState(false);
  const [showforgotPassword, setshowforgotPassword] = useState(false);
  const lowercase = "abcdef";
  const num = "1234567890";

  const handleChange = (e) => {
    e.preventDefault();
    let pass = e.target.value;

    if (
      lowercase.includes(pass[pass.length - 1]) ||
      num.includes(pass[pass.length - 1]) ||
      !pass[pass.length - 1]
    ) {
      setPassword(e.target.value.trim());
      if (Error) {
        setError(false);
      }
    } else {
      setError(true);
    }
  };

  const handlesave = async () => {
    if (isHere) {
      setloading(true);
      const Encryption_Passord = localStorage.getItem("encryption_key");
      await handlePasswordChange(Encryption_Passord, Password, userId);
      localStorage.setItem("encryption_key", Password);
      setEncryption_Passord(Password);
      setshowpopup(false);
    } else if (!isHere) {
      setloading(true);
      const isValid = await check(userId, Password);
      if (isValid) {
        localStorage.setItem("encryption_key", Password);
        setisHere(true);
        setEncryption_Passord(Password);
        setshowpopup(false);
        setloading(false);
      } else if (!isValid) {
        setforgot(true);
        setloading(false);
      }
    }
  };

  const GeneratePassword = () => {
    let all = lowercase + num;
    let password = "";
    for (let i = 0; i < 64; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    password = password
      .split()
      .sort(() => {
        Math.random() - 0.5;
      })
      .join();
    setPassword(password);
  };

  const handleForgotPassword = async () => {
    setloading(true);
    await DeleteAll(userId);
    setforgot(false);
    setshowforgotPassword(false);
    setloading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 10000);
  }, [Error]);

  return (
    <div className="fixed inset-0 z-[1001] backdrop-blur-[2px] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl mx-2">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="font-bold text-white text-2xl md:text-3xl">
            <span className="text-green-500">&lt;</span>
            <span>Secure</span>
            <span className="text-green-500">PASS/&gt;</span>
          </div>
          <div className="text-gray-300 text-sm md:text-base mt-1">
            Encryption Password
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col mb-3">
          <label
            htmlFor="current_password"
            className="text-white text-lg md:text-xl font-semibold mb-1"
          >
            Enter Your Code
            {forgot && (
              <div className="text-red-500 text-sm font-normal">{Message}</div>
            )}
          </label>
          <div className="flex">
            <input
              type="text"
              name="current_password"
              id="current_password"
              className="bg-green-400 h-10 px-4 py-2 flex-grow rounded-l focus:outline-none w-full"
              value={Password}
              onChange={handleChange}
              readOnly={loading}
              minLength={64}
              maxLength={64}
            />
            <button
              onClick={() => handlecopy(Password)}
              aria-label="Copy password"
              disabled={Password.length === 0}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 sm:px-3 w-10 rounded-r flex items-center justify-center"
            >
              <Image
                src="/copy.svg"
                alt="Copy"
                width={20}
                height={20}
                className="invert"
              />
            </button>
          </div>
        </div>

        {/* Error Message */}
        <div
          className={`${
            Error ? "text-red-500 h-6 pt-1" : "h-0"
          } transition-all overflow-hidden text-sm`}
        >
          The password can only contain numbers and abcdef
        </div>

        {/* Forgot Password */}
        <div
          className={`text-gray-300 text-sm mt-2 text-center ${
            forgot ? "text-red-500 h-6" : "h-0"
          } transition-all overflow-hidden`}
        >
          Have you{" "}
          <button
            onClick={() => setshowforgotPassword(true)}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            forgotten your password?
          </button>
        </div>

        {/* Generate Button */}
        <div className="mt-4">
          <button
            onClick={GeneratePassword}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-lg transition-colors"
          >
            Generate Password
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          {isHere && (
            <button
              onClick={() => setshowpopup(false)}
              className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-500 text-white py-2 px-4 rounded-full text-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            disabled={Password.length !== 64 || loading}
            onClick={handlesave}
            className={`w-full py-2 px-4 rounded-full text-lg transition-colors ${
              Password.length === 64 && !loading
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Save"}
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showforgotPassword && (
        <div className="fixed inset-0 z-[60] backdrop-blur-[2px] flex justify-center items-center p-4">
          <div className="bg-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            <div className="font-bold text-xl text-yellow-400 mb-2">Alert!</div>
            <div className="text-gray-300 text-sm mb-4">
              If you reset your password, all existing passwords in your manager
              will be deleted.
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setshowforgotPassword(false)}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded text-sm disabled:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded text-sm disabled:bg-red-500"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetPassword;
