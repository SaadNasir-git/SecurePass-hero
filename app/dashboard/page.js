"use client";

import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { savepassword } from "@/actions/route";
import { findpasswords } from "@/actions/route";
import { handleUpdate } from "@/actions/route";
import { deletepassword } from "@/actions/route";
import { ToastContainer, toast } from "react-toastify";
import { handlecopy } from "@/lib/copy";
import SetPassword from "@/components/popup";
import Bar from "@/components/bar";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader";

const PasswordManager = () => {
  const { user, isLoaded } = useUser();
  const [isDeleting, setisDeleting] = useState(false);
  const [showpopup, setshowpopup] = useState(false);
  const [loading, setloading] = useState(true);
  const [userId, setuserId] = useState("");
  const [Encryption_Passord, setEncryption_Passord] = useState("");
  const [isHere, setisHere] = useState(true);
  const [form, setform] = useState({
    id: null,
    site: "",
    username: "",
    password: "",
    userId: userId,
  });
  const [passwords, setpasswords] = useState([]);
  const formref = useRef();
  const menuContainerRef = useRef();
  const [showPassword, setshowPassword] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenus = document.querySelectorAll(".mobile-menu");
      const clickedElement = event.target;

      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(clickedElement)
      ) {
        mobileMenus.forEach((menu) => {
          if (!menu.contains(clickedElement)) {
            menu.classList.add("hidden");
          }
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const hideonemenu = (id) => {
    document.getElementById(`mobile-menu-${id}`).classList.add("hidden");
  };

  const hideallmenus = (id) => {
    document.querySelectorAll(".mobile-menu").forEach((menu) => {
      if (menu.id !== `mobile-menu-${id}`) {
        menu.classList.add("hidden");
      } else {
        menu.classList.toggle("hidden");
      }
    });
  };

  const handleedit = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const target = passwords.find((i) => i.id === id);
    setform({ ...target, id });
    setpasswords(passwords.filter((i) => i.id != id));
  };

  async function data(userId) {
    if (Encryption_Passord) {
      let data = await findpasswords(userId, Encryption_Passord);
      setpasswords(data);
      if (loading) {
        setloading(false);
      }
    }
  }

  const handledel = (e) => {
    async function main() {
      setisDeleting(true);
      let c = confirm("Are you sure you want to delete this password?");
      if (c && Encryption_Passord) {
        await deletepassword(e);
        await data(userId);
        toast.success("Password successfully deleted");
        setisDeleting(false);
      }
    }
    main();
  };

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handlesave = async () => {
    if (
      form.username.length > 3 &&
      form.site.length > 3 &&
      form.password.length > 3 &&
      Encryption_Passord
    ) {
      if (form.id) {
        setisSubmitting(true);
        await handleUpdate(form.id, form, Encryption_Passord);
        toast.success("Password successfully updated");
        setisSubmitting(false);
      } else {
        setisSubmitting(true);
        await savepassword(form, Encryption_Passord);
        toast.success("Password successfully saved");
        setisSubmitting(false);
      }
      formref.current.reset();
      setform({
        id: null,
        site: "",
        username: "",
        password: "",
        userId: userId,
      });
      data(userId);
    }
  };

  const handlepass = () => {
    setshowPassword(!showPassword);
  };

  useEffect(() => {
    const pass = localStorage.getItem("encryption_key");
    setEncryption_Passord(pass);
    if (!pass) {
      setisHere(false);
      setshowpopup(true);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (isLoaded && user?.id) {
        const userId = user.id;
        setuserId(userId);
        setform({
          id: null,
          site: "",
          username: "",
          password: "",
          userId: userId,
        });
        await data(userId);
      }
    };
    load();
  }, [isLoaded, Encryption_Passord, user]);

  return (
    <>
      <ToastContainer />
      <Head>
        <title>Secure Password Manager | SecurePass - Store & Manage Passwords Safely</title>
        <meta
          name="description"
          content="Pass is a secure password manager that helps you store, manage, and protect your passwords with end-to-end encryption. Access your passwords anywhere safely."
        />
        <meta name="keywords" content="password manager, secure passwords, online security, password storage, encryption" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Secure Password Manager | PassOP" />
        <meta property="og:description" content="Store and manage your passwords securely with PassOP's encrypted password manager." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Secure Password Manager | PassOP" />
        <meta name="twitter:description" content="The safest way to store and manage all your passwords in one secure place." />
        <link rel="canonical" href="https://secure-pass-hero.vercel.app/dashboard" />
      </Head>
      <main className="overflow-x-hidden w-full h-full">
        {user && <Bar setshowpopup={setshowpopup} />}
        <div className="container md:w-[70%] mx-auto overflow-x-hidden">
          {showpopup && (
            <SetPassword
              setshowpopup={setshowpopup}
              isHere={isHere}
              userId={userId}
              setEncryption_Passord={setEncryption_Passord}
              setisHere={setisHere}
            />
          )}
          <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>

          <article className="p-3 min-h-[80.7vh] w-full text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-green-500">&lt;</span>
              <span>Secure</span>
              <span className="text-green-500">PASS/&gt;</span>
            </h1>
            <p className="text-gray-600">Your secure password management solution</p>
            
            <section aria-labelledby="password-form-heading">
              <h2 id="password-form-heading" className="sr-only">Password Entry Form</h2>
              <form ref={formref}>
                <label htmlFor="site" className="sr-only">Website URL</label>
                <input
                  type="url"
                  id="site"
                  name="site"
                  value={form.site}
                  placeholder="Enter website URL"
                  className="rounded-full border border-green-500 w-full p-4 py-1 my-4"
                  onChange={handlechange}
                  readOnly={isSubmitting}
                  required
                />
                <div className="flex flex-col gap-4 md:flex-row">
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={form.username}
                    placeholder="Enter username"
                    name="username"
                    className="rounded-full border border-green-500 w-full p-4 py-1"
                    onChange={handlechange}
                    readOnly={isSubmitting}
                    required
                  />
                  <div className="h-max w-full md:w-max relative">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      value={form.password}
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="rounded-full border border-green-500 w-full p-4 py-1"
                      onChange={handlechange}
                      readOnly={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={handlepass}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute top-1.5 right-1 cursor-pointer"
                    >
                      <Image
                        src={showPassword ? "/ceye.svg" : "/eye.svg"}
                        width={25}
                        height={25}
                        alt={showPassword ? "Hide password" : "Show password"}
                        className="invert"
                      />
                    </button>
                  </div>
                </div>
              </form>
            </section>

            <button
              disabled={!isLoaded || loading || isSubmitting}
              className="disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center gap-1.5 bg-green-500 w-max py-1 px-2 rounded-full mx-auto mt-5 cursor-pointer"
              onClick={handlesave}
              aria-label={isSubmitting ? "Processing" : "Save password"}
            >
              <Image src={"/add.svg"} width={35} height={35} alt="" aria-hidden="true" />
              <span className="font-bold text-white">
                {isSubmitting ? "Processing..." : "Save"}
              </span>
            </button>

            {loading && (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )}

            {passwords.length === 0 && !loading && (
              <p className="text-center mx-auto mt-4">
                No passwords saved yet
              </p>
            )}

            {passwords.length > 0 && (
              <section 
                className="block w-full mt-4 space-y-4 pb-16"
                ref={menuContainerRef}
                aria-labelledby="saved-passwords-heading"
              >
                <h2 id="saved-passwords-heading" className="sr-only">Your Saved Passwords</h2>
                {passwords.map((item) => (
                  <article
                    key={item.id}
                    className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 relative"
                  >
                    <div className="bg-green-600 flex justify-end mb-[1px]">
                      <div>
                        <button
                          onClick={() => hideallmenus(item.id)}
                          className="p-2 rounded-full cursor-pointer hover:bg-green-400 focus:outline-none overflow-hidden"
                          aria-label={`Actions for ${item.site} password`}
                          aria-haspopup="true"
                          aria-expanded={document.getElementById(`mobile-menu-${item.id}`)?.classList.contains("hidden") ? "false" : "true"}
                        >
                          <Image
                            src={"menu.svg"}
                            width={23}
                            height={20}
                            alt=""
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <div
                        id={`mobile-menu-${item.id}`}
                        className="mobile-menu hidden absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                        role="menu"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleedit(item.id);
                              hideonemenu(item.id);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            <Image
                              src="/edit.svg"
                              alt=""
                              width={16}
                              height={16}
                              className="mr-2 invert"
                              aria-hidden="true"
                            />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handledel(item.id);
                              hideonemenu(item.id);
                            }}
                            disabled={isDeleting}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:bg-white w-full text-left"
                            role="menuitem"
                          >
                            <Image
                              src="/del.svg"
                              alt=""
                              width={16}
                              height={16}
                              className="mr-2"
                              aria-hidden="true"
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                      <div className="flex">
                        <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                          Site
                        </div>
                        <div className="w-2/3 p-3 bg-green-50">
                          <a
                            href={
                              item.site.startsWith("http")
                                ? item.site
                                : `https://${item.site}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                            aria-label={`Visit ${item.site}`}
                          >
                            {
                              item.site
                                .replace(/^https?:\/\//, "")
                                .split("/")[0]
                            }
                          </a>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                          Username
                        </div>
                        <div className="w-2/3 p-3 bg-green-50 flex items-center justify-between">
                          <span className="font-mono break-all w-[70%]">
                            {item.username}
                          </span>
                          <button
                            onClick={() => handlecopy(item.username)}
                            aria-label={`Copy username for ${item.site}`}
                            className="ml-2 p-1 rounded w-[30%] flex justify-center"
                          >
                            <Image
                              src="/copy.svg"
                              alt=""
                              width={16}
                              height={16}
                              className="opacity-70 hover:opacity-100 invert"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                          Password
                        </div>
                        <div className="w-2/3 p-3 bg-green-50 flex items-center justify-between">
                          <span className="font-mono tracking-wider h-5 overflow-hidden break-all w-[70%]">
                            {item.password.replace(/./g, "•")}
                          </span>
                          <button
                            onClick={() => handlecopy(item.password)}
                            aria-label={`Copy password for ${item.site}`}
                            className="ml-2 p-1 rounded w-[30%] flex justify-center"
                          >
                            <Image
                              src="/copy.svg"
                              alt=""
                              width={16}
                              height={16}
                              className="opacity-70 hover:opacity-100 invert"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </article>
        </div>
      </div>
      </main>
    </>
  );
};

export default PasswordManager;
