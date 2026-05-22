import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Heart, Mail, MapPin, Phone, Shield, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    address: string | null;
    phonre_number: string | null;
    IsActive: boolean;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    likes_count: number;
    favourites_count: number;
    bookings_count: number;
};

type Booking = {
    id: number;
    booking_date: string | null;
    due_date: string | null;
    time: string;
    status: string;
    booking_type: string;
    book: { id: number; name: string; ISBN: string } | null;
};

type Props = SharedData & {
    user: User;
    recentBookings: Booking[];
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function AdminUsersShow({ user, recentBookings }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: '/dashboard' },
        { title: 'Admin — Users', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Admin — ${user.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin/users">
                            <ArrowLeft className="size-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Profile data and recent booking activity.</p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                    <Card>
                        <CardContent className="space-y-6 p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-16">
                                        <AvatarFallback className="text-lg font-semibold">{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-xl font-semibold">{user.name}</h2>
                                        <p className="text-sm text-muted-foreground">Member ID #{user.id}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                                    <Badge variant={user.status === 'active' ? 'default' : 'outline'} className="capitalize">
                                        {user.status}
                                    </Badge>
                                    {!user.IsActive && <Badge variant="outline">Inactive</Badge>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="size-4" />
                                        Email
                                    </div>
                                    <p className="mt-2 font-medium">{user.email}</p>
                                </div>
                                {/* <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="size-4" />
                                        Phone
                                    </div>
                                    <p className="mt-2 font-medium">{user.phonre_number || 'Not provided'}</p>
                                </div> */}
                                {/* <div className="rounded-xl border p-4 sm:col-span-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="size-4" />
                                        Address
                                    </div>
                                    <p className="mt-2 font-medium">{user.address || 'Not provided'}</p>
                                </div> */}
                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="size-4" />
                                        Joined
                                    </div>
                                    <p className="mt-2 font-medium">{user.created_at || 'Unknown'}</p>
                                </div>
                                {/* <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="size-4" />
                                        Email Verified
                                    </div>
                                    <p className="mt-2 font-medium">{user.email_verified_at || 'Not verified'}</p>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Summary</CardTitle>
                                <CardDescription>Recent engagement across the library.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BookOpen className="size-4" /> Bookings
                                    </div>
                                    <span className="text-lg font-semibold">{user.bookings_count}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Heart className="size-4" /> Likes
                                    </div>
                                    <span className="text-lg font-semibold">{user.likes_count}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <UserRound className="size-4" /> Favourites
                                    </div>
                                    <span className="text-lg font-semibold">{user.favourites_count}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>Latest reservations made by this user.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentBookings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">This user has not booked any books yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentBookings.map((booking) => (
                                            <div key={booking.id} className="rounded-xl border p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        {booking.book ? (
                                                            <Link href={`/admin/books/${booking.book.id}`} className="font-medium hover:underline">
                                                                {booking.book.name}
                                                            </Link>
                                                        ) : (
                                                            <div className="font-medium">Unknown book</div>
                                                        )}
                                                        <p className="font-mono text-xs text-muted-foreground">{booking.book?.ISBN ?? 'No ISBN available'}</p>
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