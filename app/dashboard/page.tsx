'use client'

import Head from "next/head";
import PasswordForm from "./Form";
import Passwords from "./Passwords";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Bar from "@/components/bar";
import SetPassword from "@/components/Popup";
import axios from "axios";

const Home = () => {
    const [FormData, setFormData] = useState<data>(
        {
            siteUrl: '',
            username: '',
            password: ''
        });
    const [isLoading, setisLoading] = useState(true)
    const [encryptionPassword, setencryptionPassword] = useState<string>('');
    const [showpopup, setShowPopup] = useState(false)
    const [passwords, setPasswords] = useState<data[]>([])

    useEffect(() => {
        const encryptionPassword = localStorage.getItem("encryption_key")
        if (encryptionPassword) {
            setencryptionPassword(encryptionPassword)
            const main = async () => {
                try {
                    const res = await axios.post('/api/fetchPasswords', { password: encryptionPassword })
                    if (res.data.isValid) {
                        setPasswords(res.data.passwords)
                    } else {
                        toast.error('Provided password is incorrect')
                        setShowPopup(true)
                    }
                } catch (error) {
                    toast.error('An unexpected error occurred')
                } finally{
                    setisLoading(false)
                }
            }
            main()
        } else {
            setShowPopup(true)
        }
    }, [])

    return (
        <>
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

            <ToastContainer />

            <main className="overflow-x-hidden w-full h-full">
                <div className="container md:w-[70%] mx-auto overflow-x-hidden">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
                    </div>

                    <article className="p-3 min-h-[80.7vh] w-full text-center">
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="text-green-500">&lt;</span>
                            <span>Secure</span>
                            <span className="text-green-500">PASS/&gt;</span>
                        </h1>
                        <p className="text-gray-600">Your secure password management solution</p>

                        <section aria-labelledby="password-form-heading" className="mx-3 sm:mx-10">
                            <h2 id="password-form-heading" className="sr-only">Password Entry Form</h2>

                            <PasswordForm formData={FormData} setFormData={setFormData} isLoading={isLoading} encryptionPassword={encryptionPassword} passwords={passwords} setPassword={setPasswords} />

                            <Passwords setFormData={setFormData} passwords={passwords} setpasswords={setPasswords} />

                            <Bar setshowpopup={setShowPopup} />

                            {
                                showpopup && <SetPassword setEncryption_Passord={setencryptionPassword} setshowpopup={setShowPopup} encryptionPassword={encryptionPassword} passwords={passwords}/>
                            }
                        </section>
                    </article>
                </div>
            </main>
        </>
    );
}

export default Home;