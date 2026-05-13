import { Head, router, usePage } from '@inertiajs/react';
import { Check, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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

type Booking = {
    id: number;
    booking_date: string;
    due_date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'returned';
    IsActive: boolean;
    book: { name: string; ISBN: string } | null;
    user: { name: string; email: string } | null;
};

type Props = SharedData & { bookings: Booking[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Admin — Bookings', href: '/admin/bookings' },
];

export default function AdminBookingsIndex() {
    const { bookings, flash } = usePage<Props>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        const echo = (window as { Echo?: any }).Echo;

        if (!echo) {
            return;
        }

        const channel = echo.private('admin.bookings');

        channel.listen('.booking.updated', () => {
            router.reload({ only: ['bookings', 'flash'] });
        });

        return () => {
            echo.leave('private-admin.bookings');
        };
    }, []);

    const confirmDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/bookings/${deleteId}`, {
            onFinish: () => setDeleteId(null),
        });
    };

    const confirmBooking = (bookingId: number) => {
        router.patch(`/admin/bookings/${bookingId}/confirm`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Bookings" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-m text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Booking List</h1>
                    <p className="mt-1 text-m text-muted-foreground">
                        All book reservations made by users.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-m">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">#</th>
                                <th className="px-4 py-3 text-left font-medium">User</th>
                                <th className="px-4 py-3 text-left font-medium">Book</th>
                                <th className="px-4 py-3 text-left font-medium">Booking Date</th>
                                <th className="px-4 py-3 text-left font-medium">Due Date</th>
                                <th className="px-4 py-3 text-left font-medium">Time</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                        No bookings yet.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking, i) => (
                                    <tr key={booking.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{booking.user?.name ?? '—'}</div>
                                            <div className="text-xs text-muted-foreground">{booking.user?.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{booking.book?.name ?? '—'}</div>
                                            <div className="font-mono text-xs text-muted-foreground">{booking.book?.ISBN}</div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{booking.booking_date}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{booking.due_date}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{booking.time}</td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    booking.status === 'confirmed'
                                                        ? 'default'
                                                        : booking.status === 'returned'
                                                          ? 'outline'
                                                          : 'secondary'
                                                }
                                            >
                                                {booking.status === 'confirmed'
                                                    ? 'Confirmed'
                                                    : booking.status === 'returned'
                                                      ? 'Returned'
                                                      : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {booking.status === 'pending' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => confirmBooking(booking.id)}
                                                >
                                                    <Check className="size-4 text-green-600" />
                                                    <span className="sr-only">Confirm</span>
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteId(booking.id)}
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

            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Booking</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this booking record?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
