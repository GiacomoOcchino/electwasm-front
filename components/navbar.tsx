"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import Link from "next/link";
import { Button } from "./ui/button";
import { useWallet } from "@/hooks/wallet";
import MenuSvg from "@/app/assets/svg/menu";
import { useContractStatusQuery } from "@/hooks/contract-query";
import useStore from "@/store/store";
import { User } from "lucide-react";

const Navbar = () => {
  const { wallet, connectKeplr, isLoading, isAuthenticated } = useWallet();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [enabled, setEnabled] = useState(true);
  // Query per ottenere le proposte dell'utente
  const {
    data: contractStatus,
    // isLoading: queryLoading,
    // error: queryError,
  } = useContractStatusQuery(enabled);
  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation);
  };

  const handleClick = () => {
    if (!openNavigation) return;
    setOpenNavigation(false);
  };

  useEffect(() => {
    if (contractStatus) {
      setEnabled(false);
    }
  }, [contractStatus]);

  const logStore = () => {
    const state = useStore.getState(); // Ottieni lo stato attuale dello store
    console.log("Current Store State:", state);
  };
  useEffect(() => {
    logStore();
  }, []);

  // Usa questa funzione in qualsiasi punto per verificare lo stato dello store

  return (
    <header className="w-full h-14 sticky z-10 inset-x-0 top-0 border-b border-border bg-background backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 justify-between items-center">
          <Link href="/" prefetch className="flex z-40 font-semibold">
            ElectWasm Voting Platform
          </Link>
          <div className="h-full flex items-center space-x-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : isAuthenticated ? (
              <div className="flex gap-2 items-center">
                <nav
                  className={`${
                    openNavigation
                      ? "flex h-[93.4vh] flex-col bg-background justify-center items-center gap-20"
                      : "hidden"
                  } fixed top-[56px] gap-3 left-0 right-0 bottom-0 lg:static lg:flex lg:mx-auto`}
                  onClick={handleClick}
                >
                  <Link className="text-3xl md:text-base" href="/">
                    Home
                  </Link>
                  <Link className="text-3xl md:text-base" href="/admin">
                    Admin
                  </Link>
                  <Link className="text-3xl md:text-base" href="/proposals">
                    Proposals
                  </Link>
                </nav>
                <User width={20} height={20} />
                <code className="text-sm md:text-base text-ellipsis overflow-hidden max-w-6 md:max-w-[unset]">
                  {wallet?.address}
                </code>
                <Button
                  onClick={toggleNavigation}
                  className="lg:hidden"
                  variant={"link"}
                >
                  <MenuSvg openNavigation={openNavigation} />
                </Button>
              </div>
            ) : (
              <Button variant={"default"} onClick={connectKeplr}>
                Connect
              </Button>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Navbar;
