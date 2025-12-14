'use client'

import { handlecopy } from '@/lib/copy';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Copy, Edit, Menu, Trash2 } from 'lucide-react';
import React, { SetStateAction, useRef, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const Passwords = ({ setFormData , passwords, setpasswords }: { setFormData: React.Dispatch<SetStateAction<data>>, passwords: data[], setpasswords: React.Dispatch<SetStateAction<data[]>> }) => {
    const [isDeleting, setisDeleting] = useState(false);
    const menuContainerRef = useRef(null);

    const handleEdit = async (id: string) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const target = passwords.find((i) => i.id === id);
        if (target) {
            setFormData({ ...target, id });
        }
        setpasswords(passwords.filter((i) => i.id != id));
    };

    const handleDelete = async (id: string) => {
        try {
            setisDeleting(true)
            await axios.post('/api/deletePassword', { id });
            setpasswords(passwords.filter(password => password.id !== id))
            toast.success('Password has been deleted successfully')
        } catch (error) {
            toast.error('An unexpected error has been occurred')
        } finally {
            setisDeleting(false)
        }
    }

    return (
        <div>
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
                            className="w-full rounded-lg shadow-sm overflow-hidden border relative flex flex-col"
                        >
                            {/* Header with Menu Button */}
                            {item.id && (
                                <div className="flex justify-end bg-green-600 p-1 mb-[1px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="default"
                                                size="icon"
                                                className="p-2 bg-green-600 hover:bg-green-500"
                                                aria-label={`Actions for ${item.siteUrl} password`}
                                            >
                                                <Menu className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32 -translate-y-2 absolute right-0 mt-1 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                            <DropdownMenuItem
                                                onClick={() => handleEdit(item.id ? item.id : '')}
                                                className="flex items-center cursor-pointer p-2"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(item.id ? item.id : '')}
                                                disabled={isDeleting}
                                                className="flex items-center cursor-pointer text-red-800 p-2"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>)}

                            {/* Password Details */}
                            <div className="divide-y">
                                {/* Site Row */}
                                <div className="flex">
                                    <div className="w-1/3 p-3 bg-green-600 text-white font-medium">
                                        Site
                                    </div>
                                    <div className="w-2/3 p-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                                        <a
                                            href={
                                                item.siteUrl.startsWith("http")
                                                    ? item.siteUrl
                                                    : `https://${item.siteUrl}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                            aria-label={`Visit ${item.siteUrl}`}
                                        >
                                            {
                                                item.siteUrl
                                                    .replace(/^https?:\/\//, "")
                                                    .split("/")[0]
                                            }
                                        </a>
                                    </div>
                                </div>

                                {/* Username Row */}
                                <div className="flex">
                                    <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                                        Username
                                    </div>
                                    <div className="w-2/3 p-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                        <span className="font-mono break-all w-[70%] text-slate-800 dark:text-slate-200">
                                            {item.username}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handlecopy(item.username)}
                                            aria-label={`Copy username for ${item.siteUrl}`}
                                            className="ml-2 p-1 h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700"
                                        >
                                            <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Password Row */}
                                <div className="flex">
                                    <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                                        Password
                                    </div>
                                    <div className="w-2/3 p-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                        <span className="font-mono tracking-wider h-5 overflow-hidden break-all w-[70%] text-slate-800 dark:text-slate-200">
                                            {item.password.replace(/./g, "•")}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handlecopy(item.password)}
                                            aria-label={`Copy password for ${item.siteUrl}`}
                                            className="ml-2 p-1 h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700"
                                        >
                                            <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    )
}

export default Passwords