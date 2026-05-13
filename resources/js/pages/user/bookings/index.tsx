import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, DollarSign, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

type BookingItem = {
    id: number;
    booking_date: string;
    due_date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'returned';
    isOverdue: boolean;
    daysOverdue: number;
    fine: string;
    fineRaw: number;
    isPaid: boolean;
    book: {
        id: number;
        name: string;
        author: string;
        ISBN: string;
        cover_image: string | null;
        category: { categoryName: string } | null;
    } | null;
};

type Props = SharedData & {
    bookings: BookingItem[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'My Bookings', href: '/my-bookings' },
];

export default function UserBookingsIndex() {
    const { bookings, flash } = usePage<Props>().props;
    const [payDialog, setPayDialog] = useState<BookingItem | null>(null);
    const [returnDialog, setReturnDialog] = useState<BookingItem | null>(null);
    const [processing, setProcessing] = useState(false);

    const handlePayFine = () => {
        if (!payDialog) return;
        setProcessing(true);
        router.post(`/my-bookings/${payDialog.id}/pay`, {}, {
            onFinish: () => { setProcessing(false); setPayDialog(null); },
        });
    };

    const handleReturn = () => {
        if (!returnDialog) return;
        setProcessing(true);
        router.post(`/my-bookings/${returnDialog.id}/return`, {}, {
            onFinish: () => { setProcessing(false); setReturnDialog(null); },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-m text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/dashboard">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
                        <p className="mt-0.5 text-base text-muted-foreground">
                            View your booked books, due dates, and pay fines for overdue books.
                        </p>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <BookOpen className="size-10 text-muted-foreground" />
                            <p className="text-base text-muted-foreground">You have no active bookings.</p>
                            <Button asChild variant="outline" size="sm" className="mt-2">
                                <Link href="/dashboard">Browse Books</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <Card key={booking.id} className={`flex flex-col gap-0 overflow-hidden py-0 ${booking.isOverdue && !booking.isPaid ? 'border-red-300 dark:border-red-800' : ''}`}>
                                {/* Cover image */}
                                <div className="flex h-36 items-center justify-center bg-primary/10">
                                    {booking.book?.cover_image ? (
                                        <img src={booking.book.cover_image} alt={booking.book.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <BookOpen className="size-10 text-primary opacity-70" />
                                    )}
                                </div>

                                <CardHeader className="pb-2 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-lg leading-snug">
                                            {booking.book?.name ?? 'Unknown Book'}
                                        </CardTitle>
                                        {booking.status === 'pending' ? (
                                            <Badge variant="secondary" className="shrink-0 text-xs">
                                                Pending
                                            </Badge>
                                        ) : booking.isOverdue ? (
                                            booking.isPaid ? (
                                                <Badge variant="default" className="shrink-0 bg-green-600 text-xs">
                                                    <CheckCircle className="mr-1 size-3" /> Paid
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="shrink-0 text-xs">
                                                    <AlertTriangle className="mr-1 size-3" /> Overdue
                                                </Badge>
                                            )
                                        ) : (
                                            <Badge variant="secondary" className="shrink-0 text-xs">Active</Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-2 text-base text-muted-foreground">
                                    {booking.book?.author && (
                                        <span className="truncate text-m">{booking.book.author}</span>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3.5 shrink-0" />
                                        <span>Booked: {booking.booking_date}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${booking.isOverdue && !booking.isPaid ? 'font-semibold text-red-600 dark:text-red-400' : ''}`}>
                                        <Clock className="size-3.5 shrink-0" />
                                        <span>Due: {booking.due_date}</span>
                                    </div>

                                    <div className="text-m">
                                        Status: <span className="font-medium text-foreground capitalize">{booking.status}</span>
                                    </div>

                                    {booking.status === 'pending' ? (
                                        <div className="mt-1 rounded-md bg-amber-50 px-5 py-1.5 text-m text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                            Waiting for admin confirmation before this book can be read or returned.
                                        </div>
                                    ) : booking.isOverdue && (
                                        <div className="mt-1 flex items-center gap-2 rounded-md bg-red-50 px-2 py-1.5 text-m text-red-700 dark:bg-red-950 dark:text-red-300">
                                            <DollarSign className="size-3.5 shrink-0" />
                                            <span>
                                                {booking.daysOverdue} day{booking.daysOverdue !== 1 ? 's' : ''} overdue — Fine: ${booking.fine}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="mt-auto flex gap-2 pb-5 pt-3">
                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                        <Link href={`/books/${booking.book?.id}`}>
                                            View Book
                                        </Link>
                                    </Button>

                                    {booking.status === 'confirmed' && booking.isOverdue && !booking.isPaid && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setPayDialog(booking)}
                                        >
                                            <DollarSign className="mr-1 size-3.5" />
                                            Pay Fine
                                        </Button>
                                    )}

                                    {booking.status === 'confirmed' && (!booking.isOverdue || booking.isPaid) && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setReturnDialog(booking)}
                                        >
                                            <RotateCcw className="mr-1 size-3.5" />
                                            Return
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Pay Fine Dialog */}
            <Dialog open={payDialog !== null} onOpenChange={(open) => !open && setPayDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pay Overdue Fine</DialogTitle>
                        <DialogDescription>
                            Your book <strong>{payDialog?.book?.name}</strong> is {payDialog?.daysOverdue} day{payDialog?.daysOverdue !== 1 ? 's' : ''} overdue.
                            The fine is <strong>${payDialog?.fine}</strong> ($0.50/day).
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPayDialog(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handlePayFine} disabled={processing}>
                            {processing ? 'Processing…' : `Pay $${payDialog?.fine}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Return Book Dialog */}
            <Dialog open={returnDialog !== null} onOpenChange={(open) => !open && setReturnDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Return Book</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to return <strong>{returnDialog?.book?.name}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReturnDialog(null)}>Cancel</Button>
                        <Button onClick={handleReturn} disabled={processing}>
                            {processing ? 'Processing…' : 'Confirm Return'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
