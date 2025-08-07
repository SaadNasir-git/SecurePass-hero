import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>SecurePass - Your Private, Encrypted Password Manager</title>
        <meta 
          name="description" 
          content="SecurePass is a zero-knowledge password manager that encrypts your data. Access your passwords securely across all devices while maintaining complete privacy."
        />
        <meta name="keywords" content="password manager, secure passwords, encryption, privacy, password storage" />
        <meta property="og:title" content="SecurePass - Private Password Management" />
        <meta property="og:description" content="End-to-end encrypted password manager that keeps your data secure and accessible only to you." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://secure-pass-hero.vercel.app" />
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="w-full max-w-4xl mx-4 bg-white p-8 sm:p-12 rounded-2xl shadow-lg text-center space-y-8" style="
            padding-bottom: 100px;">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              SecurePass
            </h1>
            <p className="text-blue-600 font-medium">Zero-Knowledge Password Manager</p>
          </div>

          <div className="flex flex-col gap-4 justify-center items-center max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg leading-relaxed">
              Manage your passwords securely with end-to-end encryption and access them anytime, anywhere.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 w-full">
              <p className="text-gray-700 text-sm sm:text-base">
                <strong className="text-blue-600">Important:</strong> Your data is encrypted with a master password that only you know. Please keep it safe as we cannot recover your data if you lose it.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              aria-label="Get started with SecurePass"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              100% Private Encryption
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              End-to-End Secure
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cross-Device Sync
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
