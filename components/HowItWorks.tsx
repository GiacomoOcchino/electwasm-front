import React from 'react'

interface StepProps {
    icon: string;
    title: string;
    description: string;
}
const Step = ({ icon, title, description }: StepProps) => {
    return (
        <div className="flex flex-col items-center text-center max-w-xs">
            <img src={icon} alt={title} className="w-20 mb-4" />
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    );
}
const HowItWorks = () => {
    return (
        <div className="py-12 bg-gray-100">
            <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
            <div className="flex justify-around">
                <Step icon="/icon-smart-contract.svg" title="Create Votes with Smart Contracts" description="Each vote is powered by a secure, transparent smart contract." />
                <Step icon="/icon-security.svg" title="Anonymous & Secure Voting" description="Votes are anonymous and protected through blockchain encryption." />
                <Step icon="/icon-transparency.svg" title="Real-Time Results" description="Results are transparent and verifiable on-chain." />
            </div>
        </div>
    )
}

export default HowItWorks