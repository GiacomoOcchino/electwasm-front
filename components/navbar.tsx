"use client";
import React, { useState } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import Link from "next/link";
import { Button } from "./ui/button";
import { useWallet } from "@/hooks/wallet";
import Image from "next/image";
import MenuSvg from "@/app/assets/svg/menu";

const Navbar = () => {
  const { wallet, connectKeplr, isLoading, isAuthenticated } = useWallet();
  const [openNavigation, setOpenNavigation] = useState(false);
  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation);
  };
  const handleClick = () => {
    if (!openNavigation) return;
    setOpenNavigation(false);
  };
  return (
    <header className="w-full h-14 sticky z-10 inset-x-0 top-0 border-b border-border bg-background backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 item  justify-between items-center">
          <Link href="/" prefetch className="flex z-40 font-semibold">
            ElectWasm Ballots Platform
          </Link>
          <div className="h-full flex items-center space-x-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : isAuthenticated ? (
              <div className="flex gap-2 items-center">
                <nav
                  className={`${
                    openNavigation
                      ? "flex h-[93.4vh] flex-col bg-background justify-center gap-20"
                      : "hidden"
                  } fixed top-[56px] left-0 right-0 bottom-0 lg:static lg:flex lg:mx-auto`}
                >
                  <Link href="/">Home</Link>
                  <Link href="/">Admin</Link>
                  <Link href="/">Vote</Link>
                </nav>
                <Image src='' width={50} height={50} alt="avatar" className="rounded-full w-6 md:h-8 md:w-auto">
                </Image>
                <code className="text-sm md:text-base text-ellipsis overflow-hidden max-w-6 md:max-w-[unset]">{wallet?.address}</code>
                <button
                  onClick={toggleNavigation}
                  className=" ml-auto lg:hidden"
                >
                    <MenuSvg  openNavigation={openNavigation}/>
                  </button>
              </div>
            ) : (
              <Button variant={"default"} onClick={connectKeplr}> connect</Button>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Navbar;
