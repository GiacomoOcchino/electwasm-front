
'use client'

import { useState, useEffect } from 'react';


interface TimerProps {
    endTime: string; // ISO string or date object for vote expiration time
  }
  
  const CountdownTimer = ({ endTime }:TimerProps) => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
  
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
  
      return timeLeft;
    };
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Time Remaining</h2>
        <div className="text-4xl font-bold">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>
    );
  };

export default CountdownTimer