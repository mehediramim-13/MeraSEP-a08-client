"use client";

import Link from "next/link";
import {
  Bookmark,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Plus,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { getInitials } from "@/lib/format";
import type { AppUser } from "@/types";

interface UserMenuProps {
  user: AppUser;
  savedCount: number;
}

const MENU_LINKS = [
  { href: "/create-event", label: "Create Event", icon: Plus },
  { href: "/manage-events", label: "Manage Events", icon: LayoutDashboard },
  { href: "/joined-events", label: "Joined Events", icon: CalendarCheck },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function UserMenu({ user, savedCount }: UserMenuProps) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger render={<span className="inline-flex" />}>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-full p-0 ring-1 ring-border/70 transition-all hover:ring-primary/40"
                aria-label={`Account menu for ${user.name}`}
              />
            }
          >
            <Avatar className="size-8">
              <AvatarImage src={user.image} alt="" />
              <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">{user.name}</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="text-sm font-semibold text-foreground">{user.name}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MENU_LINKS.map((item) => (
            <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
              <item.icon aria-hidden="true" />
              {item.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Bookmark className="size-3.5" aria-hidden="true" />
              Saved events
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary tabular-nums">
              {savedCount}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              void logout();
            }}
          >
            <LogOut aria-hidden="true" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
