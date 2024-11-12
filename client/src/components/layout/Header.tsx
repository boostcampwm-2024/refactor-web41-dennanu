import { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

import RssRegistrationModal from "@/components/RssRegistration/RssRegistrationModal";
import SideBar from "@/components/layout/Sidebar";
import SearchButton from "@/components/search/SearchButton";
import SearchModal from "@/components/search/SearchModal";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import logo from "@/assets/logo-denamu-main.svg";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [rssOpen, setRssOpen] = useState(false);

  const handleSearchModal = () => setSearchOpen((prev) => !prev);
  const handleRssModal = () => setRssOpen((prev) => !prev);

  return (
    <div className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img className="h-10 w-auto cursor-pointer" src={logo} alt="Logo" onClick={() => location.reload()} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {/* Search Button */}
                <NavigationMenuItem>
                  <div className="flex h-full items-center">
                    <SearchButton handleSearchModal={handleSearchModal} />
                  </div>
                </NavigationMenuItem>

                {/* Login Menu */}
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                    로그인
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Blog Registration Menu */}
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={handleRssModal} href="#">
                    블로그 등록
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>메뉴</SheetTitle>
                </SheetHeader>
                <SideBar handleRssModal={handleRssModal} handleSearchModal={handleSearchModal} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {rssOpen && <RssRegistrationModal onClose={handleRssModal} rssOpen={rssOpen} />}
        {searchOpen && <SearchModal onClose={handleSearchModal} />}
      </AnimatePresence>
    </div>
  );
}
