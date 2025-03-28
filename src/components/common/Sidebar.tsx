import {
  ArrowUpDown,
  Coins,
  HelpCircle,
  Home,
  Sparkles,
  User,
} from "lucide-react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  Sidebar as UISidebar,
  useSidebar,
} from "../ui/sidebar";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import NewTransactionButton from "../dashboard/wallet/NewTransactionButton";

const SIDEBAR_ITEMS = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Payments", icon: Coins, href: "/assets" },
  { name: "Transactions", icon: ArrowUpDown, href: "/transactions" },
  // { name: "Address book", icon: Contact, href: "/address-book" },
  // { name: "App", icon: LayoutGrid, href: "/app" },
  // { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Account", icon: User, href: "/account" },
];

const SIDEBAR_ITEMS_FOOTER = [
  { name: "About ZeroSecure", icon: Sparkles, href: "/about" },
  { name: "Need help?", icon: HelpCircle, href: "/need-help" },
];

export default function Sidebar() {
  const { open } = useSidebar();

  return (
    <>
      <SidebarTrigger className="top-1 right-1 absolute" />
      <UISidebar collapsible="icon">
        {/* Header - Profile Info */}
        <SidebarHeader className="p-4 flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <img src="https://avatar.iran.liara.run/public/34" alt="" />
            </div>
            {open && (
              <div className="flex-">
                <div>my wallet 1</div>
                <div>aleo123...a2ssa</div>
                <div>$0 Aleo</div>
              </div>
            )}
          </div>
        </SidebarHeader>
        <NewTransactionButton className="my-2 mx-1" />
        <Separator />

        {/* Menu Content */}
        <SidebarContent className="mt-4">
          <SidebarGroup>
            {SIDEBAR_ITEMS?.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className={`${open && "justify-start w-full"}`}
              >
                <Link
                  to={item.href}
                  className="flex items-center p-3 text-sm font-medium rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={20} />
                    {open && <div>{item.name}</div>}
                  </div>
                </Link>
              </Button>
            ))}
          </SidebarGroup>
        </SidebarContent>

        <Separator />

        {/* Footer */}
        <SidebarFooter>
          <SidebarGroup>
            {SIDEBAR_ITEMS_FOOTER?.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className={`${open && "justify-start w-full"}`}
              >
                <Link to={item.href} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <item.icon size={18} />
                    {open && <div>{item.name}</div>}
                  </div>
                </Link>
              </Button>
            ))}
          </SidebarGroup>
        </SidebarFooter>
      </UISidebar>
    </>
  );
}
