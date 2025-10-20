"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSimpleAuth } from "@/lib/client-simple-auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMounted } from "@mantine/hooks";

export function NavigationUser() {
  const isMounted = useMounted();
  const { user, isAuthenticated, isLoading, signOut } = useSimpleAuth();

  if (isLoading || !isMounted) {
    return <Skeleton className="h-[142px] w-full" />;
  }

  // if user is null, return a login state
  if (!isAuthenticated || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="bg-muted-foreground/5 flex flex-col gap-1 rounded-lg p-4 shadow-xs">
            <div className="instrument-serif font-semibold">Connexion</div>
            <p className="text-muted-foreground text-xs">
              Connectez-vous à votre compte pour sauvegarder vos données et y accéder partout
            </p>
            <LoginButtonModal />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              variant="dark"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.email}`}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">L</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight tracking-tight">
                <span className="instrument-sans truncate font-semibold capitalize">{user.name}</span>
                <span className="jetbrains-mono text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.email}`}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="jetbrains-mono text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                signOut();
              }}
            >
              <LogOut />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const LoginButtonModal = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <Button 
      className="mt-2.5 w-fit" 
      variant="default" 
      size="xs"
      onClick={handleLogin}
    >
      Connexion
    </Button>
  );
};

