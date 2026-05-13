import { Link, usePage } from '@inertiajs/react';
import { BookMarked, BookmarkIcon, BookOpen, CalendarCheck, ClipboardList, LayoutGrid, Tag, Users } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as adminBookingsIndex } from '@/routes/admin/bookings';
import { index as adminBooksIndex } from '@/routes/admin/books';
import { index as adminCategoriesIndex } from '@/routes/admin/categories';
import { index as userBookingsIndex } from '@/routes/bookings';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const mainNavItems: NavItem[] = [
        {
            title: 'Home',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(isAdmin
            ? [
                  {
                      title: 'Manage Books',
                      href: adminBooksIndex(),
                      icon: BookMarked,
                  },
                  {
                      title: 'Categories',
                      href: adminCategoriesIndex(),
                      icon: Tag,
                  },
                  {
                      title: 'Bookings',
                      href: adminBookingsIndex(),
                      icon: CalendarCheck,
                  },
                  {
                      title: 'Users',
                      href: '/admin/users',
                      icon: Users,
                  },
              ]
            : [
                  {
                      title: 'My Bookings',
                      href: userBookingsIndex(),
                      icon: ClipboardList,
                  },
                  {
                      title: 'My Favourites',
                      href: '/my-favourites',
                      icon: BookmarkIcon,
                  },
              ]),
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-sidebar-border/60 bg-linear-to-b from-sidebar via-sidebar to-sidebar/95"
        >
            <SidebarHeader className="px-3 pb-2 pt-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-12 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 px-2.5 shadow-sm hover:bg-sidebar-accent/70"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-1">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60 px-2 pb-2 pt-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
