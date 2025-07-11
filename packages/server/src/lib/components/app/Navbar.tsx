import Icon from "../custom/Icon";
import { Button } from "../ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import Connect from "./Connect";
import PremiumButton from "./PremiumButton";
import { useUserStore } from "../../hooks/use-store";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import FaucetSheet from "./FaucetDialog";

export default function Navbar() {
  const navigate = useNavigate()
  const { isRegistered } = useUserStore();
  const { authenticated } = usePrivy();
  const [showDesktopFaucet, setShowDesktopFaucet] = useState(false);

  return (
    <nav className="bg-neo-bg w-full">
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div
            className="flex relative items-center space-x-3"
          >
            <Link
              to="/upload" className="size-10 bg-neo-yellow-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black text-zinc-950 sm:text-lg">P</span>
            </Link>
            <span className="mt-1 text-xl font-black sm:text-2xl text-zinc-900">
              {isRegistered ? "PRO" : "PORTAL"}
            </span>

            {/* Premium Badge on Logo */}
            {authenticated && isRegistered && (
              <Button variant={"neo-static"} className="absolute -top-1 -right-6 bg-neo-yellow-1 rounded-sm size-6" >
                <Icon name="Sparkles" className="size-3" />
              </Button>
            )}
          </div>

          <div className="items-center space-x-3 flex">
            {/* Desktop buttons - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-3">
              <PremiumButton />

              <FaucetSheet isOpen={showDesktopFaucet} onOpenChange={setShowDesktopFaucet}>
                <Button variant={"neo"} className="rounded-sm">
                  <Icon name="Droplets" className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              </FaucetSheet>

              {isRegistered && (
                <Button
                  onClick={() => navigate({ to: '/shared' })}
                  variant={"neo"}
                  className="rounded-sm"
                >
                  <Icon name="Share2" className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              )}

              <Button
                onClick={() => navigate({ to: '/history' })}
                variant={"neo"}
                className="rounded-sm"
              >
                <Icon name="History" className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </div>

            <div className="hidden md:block">
              <Connect />
            </div>

            <div className="md:hidden">
              <Connect
                isMobile={true}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}