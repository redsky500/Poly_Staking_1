import React, { useState, useEffect } from "react";
import {errorToast} from "../services/toast-service"

let targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 1);

const CountdownTimerCmp = ({ LOTTERYContract }: any) => {
  const [countdown, setCountdown] = useState("Countdown started");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTimer = async () => {
    LOTTERYContract.lotteryEndTime()
      .then((item: number) => {
        const utcDate = new Date(item * 1000);
        targetDate = new Date(
          utcDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
        );
      })
      .catch((err: any) => errorToast(`lottery End Time went wrong!`));
  };

  useEffect(() => {
    getTimer();
    const interval = setInterval(() => {
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
      );
      const remainingTime = targetDate.getTime() - now.getTime();

      if (remainingTime <= 0) {
        clearInterval(interval);
        setCountdown("Countdown ended!");
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      } else {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="
    count-down-timer
    shadow-[2px 6px 9px 2px rgb(0 0 0 / 20%)]
    text-center
    max-w-[400px]
    my-[20px]
    mx-auto
    bg-countdownBG
    text-white
    rounded-xl
    p-[10px]
    font-sans
    "
    >
      <p className="mt-[5px] mb-[15px]">{countdown}</p>
      <div className="wrapper">
        <div className="grid gap-[10px] grid-cols-[repeat(4, calc(25% - 8px))] grid-cols-4">
          <p className="m-0">Days</p>
          <p className="m-0">Hours</p>
          <p className="m-0">Minutes</p>
          <p className="m-0">Seconds</p>
        </div>
        <div className="grid gap-[10px] grid-cols-[repeat(4, calc(25% - 8px))] grid-cols-4">
          <p className="m-0">{days}</p>
          <p className="m-0">{hours}</p>
          <p className="m-0">{minutes}</p>
          <p className="m-0">{seconds}</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerCmp;
