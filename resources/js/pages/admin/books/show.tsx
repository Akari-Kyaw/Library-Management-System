import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Download, FileText, Hash, Heart, MessageSquare, Tag, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';

type Book = {
    id: number;
    name: string;
    ISBN: string;
    author: string;
    published_date: string | null;
    IsActive: boolean;
    description: string | null;
    cover_image: string | null;
    pdf_url: string | null;
    category: { categoryName: string } | null;
    likes_count: number;
    comments_count: number;
    favourites_count: number;
    created_at: string | null;
    updated_at: string | null;
};

type Booking = {
    id: number;
    booking_date: string | null;
    due_date: string | null;
    time: string;
    status: string;
    booking_type: string;
    user: { id: number; name: string; email: string } | null;
};

type Props = SharedData & {
    book: Book;
    recentBookings: Booking[];
};

export default function AdminBooksShow({ book, recentBookings }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: '/dashboard' },
        { title: 'Admin — Books', href: '/admin/books' },
        { title: book.name, href: `/admin/books/${book.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Admin — ${book.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/admin/books">
                                <ArrowLeft className="size-4" />
                                <span className="sr-only">Back</span>
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Book Details</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Review book metadata and recent bookings.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/admin/books/${book.id}/edit`}>Edit Book</Link>
                        </Button>
                        {book.pdf_url && (
                            <Button asChild>
                                <a href={book.pdf_url} target="_blank" rel="noreferrer">
                                    <Download className="mr-2 size-4" />
                                    Open PDF
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
                    <Card className="overflow-hidden py-0">
                        <div className="flex h-72 items-center justify-center bg-primary/10">
                            {book.cover_image ? (
                                <img src={book.cover_image} alt={book.name} className="h-full w-full object-cover" />
                            ) : (
                                <BookOpen className="size-20 text-primary/60" />
                            )}
                        </div>
                        <CardContent className="space-y-6 p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{book.name}</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">ISBN {book.ISBN}</p>
                                </div>
                                <Badge variant={book.IsActive ? 'default' : 'outline'}>
                                    {book.IsActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="size-4" />
                                        Author
                                    </div>
                                    <p className="mt-2 font-medium">{book.author}</p>
                                </div>
                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Tag className="size-4" />
                                        Category
                                    </div>
                                    <p className="mt-2 font-medium">{book.category?.categoryName ?? 'Uncategorized'}</p>
                                </div>
                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="size-4" />
                                        Published
                                    </div>
                                    <p className="mt-2 font-medium">{book.published_date ?? 'Not set'}</p>
                                </div>
                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Hash className="size-4" />
                                        Last Updated
                                    </div>
                                    <p className="mt-2 font-medium">{book.updated_at ?? 'Unknown'}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="size-4" />
                                    Description
                                </div>
                                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                                    {book.description || 'No description available for this book yet.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Engagement</CardTitle>
                                <CardDescription>Quick signals for this title.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Heart className="size-4" /> Likes
                                    </div>
                                    <span className="text-lg font-semibold">{book.likes_count}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MessageSquare className="size-4" /> Comments
                                    </div>
                                    <span className="text-lg font-semibold">{book.comments_count}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BookOpen className="size-4" /> Favourites
                                    </div>
                                    <span className="text-lg font-semibold">{book.favourites_count}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="size-4" /> Recent bookings
                                    </div>
                                    <span className="text-lg font-semibold">{recentBookings.length}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>Latest reservations for this book.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentBookings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No bookings for this title yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentBookings.map((booking) => (
                                            <div key={booking.id} className="rounded-xl border p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        {booking.user ? (
                                                            <Link href={`/admin/users/${booking.user.id}`} className="font-medium hover:underline">
                                                                {booking.user.name}
                                                            </Link>
                                                        ) : (
                                                            <div className="font-medium">Unknown user</div>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">{booking.user?.email ?? 'No email available'}</p>
                                                    </div>
                                                    <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'returned' ? 'outline' : 'secondary'}>
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                                                    <span>Booking: {booking.booking_date ?? 'Unknown'}</span>
                                                    <span>Due: {booking.due_date ?? 'Unknown'}</span>
                                                    <span>Time: {booking.time}</span>
                                                    <span className="capitalize">Type: {booking.booking_type}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}