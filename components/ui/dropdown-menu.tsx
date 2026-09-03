"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

const DropdownMenu = Menu.Root;

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Trigger>) {
  return (
    <Menu.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn("outline-none select-none cursor-pointer", className)}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  align = "end",
  children,
  ...props
}: React.ComponentProps<typeof Menu.Popup> & {
  sideOffset?: number;
  align?: "start" | "center" | "end";
}) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        data-slot="dropdown-menu-positioner"
        sideOffset={sideOffset}
        align={align}
        className="z-50 outline-none"
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "min-w-[15rem] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 text-slate-800 shadow-xl ring-1 ring-black/5 outline-none transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-starting-style:scale-[0.96] data-starting-style:opacity-0",
            className
          )}
          {...props}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  asChild = false,
  onClick,
  children,
  ...props
}: any) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none transition-colors hover:bg-slate-100 data-highlighted:bg-slate-100 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variant === "destructive" &&
          "text-brand-red hover:bg-red-50 hover:text-brand-red data-highlighted:bg-red-50 data-highlighted:text-brand-red",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </Menu.Item>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean;
}) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn(
        "px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1.5 h-px bg-slate-100", className)}
      {...props}
    />
  );
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Group>) {
  return (
    <Menu.Group
      data-slot="dropdown-menu-group"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
};
