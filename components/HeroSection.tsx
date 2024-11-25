import React from 'react'
const HeroSection = () => {
    return (
        <div className="bg-cover bg-center h-screen text-center flex flex-col justify-center bg-background-hero items-center">
            <h1 className="text-white text-4xl font-bold mb-4">Empowering Secure Voting Through Blockchain</h1>
            <p className="text-gray-300 text-lg mb-6">Transparent, decentralized, and secure voting for the future.</p>
            <button className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition duration-300">Start Voting</button>
        </div>
        // <div className="relative h-screen text-center flex flex-col justify-center">
        //     {/* Background image */}
        //     <div className="absolute inset-0 bg-background-hero bg-cover bg-center backdrop-blur-lg"></div>

        //     {/* Overlay content */}
        //     <div className="relative z-10 text-white">
        //         <h1 className="text-4xl font-bold mb-4">Empowering Secure Voting Through Blockchain</h1>
        //         <p className="text-lg mb-6">Transparent, decentralized, and secure voting for the future.</p>
        //         <button className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition duration-300">
        //             Start Voting
        //         </button>
        //     </div>
        // </div>
    )
}

export default HeroSection