import { Head, Link, router, usePage } from '@inertiajs/react';
import { Ban, Eye, ShieldCheck, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
};

type Props = SharedData & { users: User[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Admin — Users', href: '/admin/users' },
];

export default function AdminUsersIndex() {
    const { users, flash } = usePage<Props>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/users/${deleteId}`, {
            onFinish: () => setDeleteId(null),
        });
    };

    const toggleBan = (userId: number) => {
        router.patch(`/admin/users/${userId}/ban`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Users" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                        <Users className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User List</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            All registered members ({users.length} total)
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">#</th>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Role</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Joined</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, i) => (
                                    <tr key={user.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium">{user.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary" className="capitalize">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={user.status === 'active' ? 'default' : 'outline'}
                                                className="capitalize"
                                            >
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{user.created_at}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button asChild variant="ghost" size="icon" title="View user">
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <Eye className="size-4" />
                                                    <span className="sr-only">View</span>
                                                </Link>
                                            </Button>
                                            {user.role !== 'admin' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title={user.status === 'banned' ? 'Unban user' : 'Ban user'}
                                                    onClick={() => toggleBan(user.id)}
                                                    className={user.status === 'banned' ? 'text-green-600 hover:text-green-700' : 'text-amber-600 hover:text-amber-700'}
                                                >
                                                    {user.status === 'banned' ? <ShieldCheck className="size-4" /> : <Ban className="size-4" />}
                                                    <span className="sr-only">{user.status === 'banned' ? 'Unban' : 'Ban'}</span>
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteId(user.id)}
                                            >
                                                <Trash2 className="size-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone and will also remove all their bookings and data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
