import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white sticky z-[999] top-0 w-full'>
            <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
                <Link href={'/'} className="flex items-center">
                    <div className="font-bold text-white text-xl sm:text-2xl whitespace-nowrap">
                        <span className='text-green-500'>&lt;</span>
                        <span>Secure</span>
                        <span className='text-green-500'>PASS/&gt;</span>
                    </div>
                </Link>
                
                <a 
                    target='_blank' 
                    rel="noopener noreferrer" 
                    href='https://github.com/SaadNasir-git' 
                    className='text-white bg-green-700 hover:bg-green-600 transition-colors rounded-full flex items-center ring-1 ring-white/50 hover:ring-white'
                    aria-label="Visit our GitHub repository"
                >
                    <div className="p-1">
                        <Image 
                            src={'/github.svg'} 
                            className='invert' 
                            width={24} 
                            height={24} 
                            alt='GitHub logo'
                        />
                    </div>
                    <span className='font-semibold px-2 pr-3 text-sm sm:text-base hidden sm:inline'>
                        GitHub
                    </span>
                </a>
            </div>
        </nav>
    )
}

export default Navbar