import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, BookmarkIcon, Calendar, FileText, Hash, Heart, Lock, MessageSquare, Pencil, Star, Tag, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';
import { BookingDatePicker } from '@/components/booking-date-picker';
import type { BookedPeriod } from '@/components/booking-date-picker';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';

type Comment = {
    id: number;
    commentText: string;
    rating: number | null;
    created_at: string;
    userId: number;
    user: { name: string };
};

type Book = {
    id: number;
    name: string;
    ISBN: string;
    author: string;
    published_date: string;
    IsActive: boolean;
    cover_image: string | null;
    preview: string | null;
    description: string | null;
    pdf_url: string | null;
    category: { categoryName: string } | null;
};

type Props = SharedData & {
    book: Book;
    alreadyBooked: boolean;
    bookingStatus: 'pending' | 'confirmed' | 'returned' | null;
    bookingDate: string | null;
    dueDate: string | null;
    bookedPeriods: BookedPeriod[];
    errors?: { booking?: string };
    likesCount: number;
    userLiked: boolean;
    userFavourited: boolean;
    comments: Comment[];
};

export default function UserBookShow({ book, alreadyBooked, bookingStatus, bookingDate, dueDate, bookedPeriods, likesCount, userLiked, userFavourited, comments }: Props) {
    const { flash, errors: pageErrors, auth } = usePage<Props>().props;
    const canReadBook = bookingStatus === 'confirmed' && !!book.pdf_url;
    const authUserId = auth.user.id;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: '/dashboard' },
        { title: book.name, href: `/books/${book.id}` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        booking_date: '',
        due_date: '',
        time: '',
        booking_type: 'pickup' as 'online' | 'pickup',
    });

    const reviewForm = useForm({
        commentText: '',
        rating: '5',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/books/${book.id}/book`);
    };

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(`/books/${book.id}/comments`, {
            onSuccess: () => reviewForm.reset(),
        });
    };

    const toggleLike = () => router.post(`/books/${book.id}/like`);
    const toggleFavourite = () => router.post(`/books/${book.id}/favourite`);

    const [editingId, setEditingId] = useState<number | null>(null);
    const editForm = useForm({ commentText: '', rating: '5' });

    const startEdit = (comment: Comment) => {
        setEditingId(comment.id);
        editForm.setData({ commentText: comment.commentText, rating: String(comment.rating ?? 5) });
    };

    const cancelEdit = () => {
        setEditingId(null);
        editForm.reset();
    };

    const submitEdit = (e: React.FormEvent, commentId: number) => {
        e.preventDefault();
        editForm.patch(`/books/${book.id}/comments/${commentId}`, {
            onSuccess: () => { setEditingId(null); editForm.reset(); },
        });
    };

    const deleteComment = (commentId: number) => {
        router.delete(`/books/${book.id}/comments/${commentId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={book.name} />

            <div className="mx-auto flex w-full max-w-400 flex-1 flex-col gap-6 p-6">
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
                    <h1 className="text-2xl font-bold tracking-tight">Book Details</h1>
                </div>

                {/* Book detail card */}
                <div className="flex flex-col gap-0 overflow-hidden rounded-xl border">
                    <div className="flex h-64 items-center justify-center bg-primary/10">
                        {book.cover_image ? (
                            <img
                                src={book.cover_image}
                                alt={book.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <BookOpen className="size-20 text-primary opacity-60" />
                        )}
                    </div>

                    <div className="flex flex-col gap-4 p-6">
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="text-xl font-bold leading-snug">{book.name}</h2>
                            {book.category && (
                                <Badge variant="secondary" className="shrink-0">
                                    {book.category.categoryName}
                                </Badge>
                            )}
                        </div>

                        <div className="grid gap-3 text-m sm:grid-cols-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="size-4 shrink-0" />
                                <span className="font-medium text-foreground">Author:</span>
                                <span>{book.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Hash className="size-4 shrink-0" />
                                <span className="font-medium text-foreground">ISBN:</span>
                                <span className="font-mono text-xs">{book.ISBN}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="size-4 shrink-0" />
                                <span className="font-medium text-foreground">Published:</span>
                                <span>{book.published_date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Tag className="size-4 shrink-0" />
                                <span className="font-medium text-foreground">Status:</span>
                                <Badge variant={book.IsActive ? 'default' : 'outline'}>
                                    {book.IsActive ? 'Available' : 'Unavailable'}
                                </Badge>
                            </div>
                        </div>

                        {/* Like & Favourite actions */}
                        <Separator />
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleLike}
                                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-m font-medium transition-colors border ${
                                    userLiked
                                        ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-400'
                                        : 'border-border text-muted-foreground hover:border-rose-300 hover:text-rose-500'
                                }`}
                            >
                                <Heart className={`size-4 ${userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                <span>{likesCount}</span>
                                <span>{userLiked ? 'Liked' : 'Like'}</span>
                            </button>

                            <button
                                onClick={toggleFavourite}
                                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-m font-medium transition-colors border ${
                                    userFavourited
                                        ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-400'
                                        : 'border-border text-muted-foreground hover:border-amber-300 hover:text-amber-500'
                                }`}
                            >
                                <BookmarkIcon className={`size-4 ${userFavourited ? 'fill-amber-500 text-amber-500' : ''}`} />
                                <span>{userFavourited ? 'Saved' : 'Save to Favourites'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview / Full Content Section */}
                {book.preview && !canReadBook && (
                    <div className="flex flex-col gap-3 rounded-xl border p-6">
                        <h3 className="font-semibold">Preview</h3>
                        <p className="text-m leading-relaxed text-muted-foreground">{book.preview}</p>
                        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-m text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <Lock className="size-4 shrink-0" />
                            <span>
                                {bookingStatus === 'pending'
                                    ? 'Your booking is pending admin confirmation. The full content and PDF will unlock after approval.'
                                    : bookingStatus === 'confirmed' && bookingDate && dueDate
                                    ? `Your booking is confirmed for ${bookingDate} – ${dueDate}. Access unlocks on your booking start date.`
                                    : 'Book this title to read the full content and access the PDF.'}
                            </span>
                        </div>
                    </div>
                )}

                {canReadBook && (
                    <div className="flex flex-col gap-3 rounded-xl border p-6">
                        <h3 className="font-semibold">Full Description</h3>
                        {book.description ? (
                            <p className="text-m leading-relaxed text-muted-foreground whitespace-pre-line">{book.description}</p>
                        ) : (
                            <p className="text-m text-muted-foreground">No description available.</p>
                        )}
                        {book.pdf_url && (
                            <>
                                <Separator />
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <FileText className="size-4" />
                                            Read Book (PDF)
                                        </h3>
                                        <Button asChild variant="outline" size="sm">
                                            <a href={book.pdf_url} target="_blank" rel="noopener noreferrer">
                                                Open in New Tab
                                            </a>
                                        </Button>
                                    </div>
                                    <iframe
                                        src={book.pdf_url}
                                        className="h-150 w-full rounded-lg border"
                                        title={`${book.name} PDF`}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Booking section */}
                {!book.IsActive ? (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-m text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                        This book is currently unavailable for booking.
                    </div>
                ) : bookingStatus === 'confirmed' ? (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-m text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Your booking is confirmed. You can now read the full description and PDF.
                    </div>
                ) : bookingStatus === 'pending' ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-m text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Your booking request has been sent. Wait for the admin to confirm it before reading the PDF.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 rounded-xl border p-6">
                        <div>
                            <h3 className="font-semibold">Book this title</h3>
                            <p className="mt-0.5 text-m text-muted-foreground">
                                Select how you'd like to access this book.
                            </p>
                        </div>
                        <Separator />
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            {/* Booking type toggle */}
                            <div className="grid gap-2">
                                <Label>Access Type</Label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('booking_type', 'online')}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-m font-medium transition-colors ${
                                            data.booking_type === 'online'
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                        }`}
                                    >
                                        <BookOpen className="size-4" />
                                        Online
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('booking_type', 'pickup')}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-m font-medium transition-colors ${
                                            data.booking_type === 'pickup'
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                        }`}
                                    >
                                        <Calendar className="size-4" />
                                        Pick Up
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Select Booking Period</Label>
                                <BookingDatePicker
                                    bookedPeriods={bookedPeriods}
                                    bookingDate={data.booking_date}
                                    dueDate={data.due_date}
                                    onBookingDateChange={(val) => setData('booking_date', val)}
                                    onDueDateChange={(val) => setData('due_date', val)}
                                />
                                <InputError message={errors.booking_date} />
                                <InputError message={errors.due_date} />
                                {data.booking_date && (
                                    <p className="text-m text-muted-foreground">
                                        Selected: <strong>{data.booking_date}</strong>
                                        {data.due_date && <> &rarr; <strong>{data.due_date}</strong></>}
                                    </p>
                                )}
                            </div>

                            {data.booking_type === 'pickup' && (
                                <div className="grid gap-2 sm:w-1/2">
                                    <Label htmlFor="time">Pickup Time</Label>
                                    <input
                                        id="time"
                                        type="time"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-m shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                    <InputError message={errors.time} />
                                </div>
                            )}

                            {pageErrors?.booking && (
                                <p className="text-m text-destructive">{pageErrors.booking}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.booking_date ||
                                    !data.due_date ||
                                    (data.booking_type === 'pickup' && !data.time) ||
                                    (!!data.booking_date && !!data.due_date &&
                                        new Date(data.due_date + 'T00:00:00').getTime() - new Date(data.booking_date + 'T00:00:00').getTime() > 7 * 24 * 60 * 60 * 1000)
                                }
                                className="sm:w-fit"
                            >
                                {processing ? 'Processing…' : 'Confirm Booking'}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="flex flex-col gap-4 rounded-xl border p-6">
                    <h3 className="flex items-center gap-2 font-semibold">
                        <MessageSquare className="size-4" />
                        Reviews
                        {comments.length > 0 && (
                            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {comments.length}
                            </span>
                        )}
                    </h3>

                    {/* Submit review form */}
                    <form onSubmit={submitReview} className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
                        <h4 className="text-m font-medium">Write a Review</h4>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="review-rating">Rating</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => reviewForm.setData('rating', String(star))}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`size-6 transition-colors ${
                                                star <= Number(reviewForm.data.rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-muted-foreground hover:text-amber-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="review-text">Your review</Label>
                            <Textarea
                                id="review-text"
                                rows={3}
                                placeholder="Share your thoughts about this book…"
                                value={reviewForm.data.commentText}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => reviewForm.setData('commentText', e.target.value)}
                            />
                            <InputError message={reviewForm.errors.commentText} />
                        </div>
                        <Button type="submit" disabled={reviewForm.processing} className="self-start">
                            {reviewForm.processing ? 'Submitting…' : 'Submit Review'}
                        </Button>
                    </form>

                    {/* Existing reviews */}
                    {comments.length === 0 ? (
                        <p className="text-m text-muted-foreground">No reviews yet. Be the first to review!</p>
                    ) : (
                        <div className="flex flex-col divide-y">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 py-4 first:pt-0">
                                    <Avatar className="size-9 shrink-0">
                                        <AvatarFallback className="text-xs">
                                            {comment.user.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-m font-medium">{comment.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{comment.created_at}</span>
                                            </div>
                                            {comment.userId === authUserId && editingId !== comment.id && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => startEdit(comment)}
                                                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                                        title="Edit review"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteComment(comment.id)}
                                                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                        title="Delete review"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {editingId === comment.id ? (
                                            <form onSubmit={(e) => submitEdit(e, comment.id)} className="mt-2 flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => editForm.setData('rating', String(star))}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`size-5 transition-colors ${
                                                                    star <= Number(editForm.data.rating)
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-muted-foreground hover:text-amber-300'
                                                                }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                <Textarea
                                                    rows={3}
                                                    value={editForm.data.commentText}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => editForm.setData('commentText', e.target.value)}
                                                />
                                                <div className="flex gap-2">
                                                    <Button type="submit" size="sm" disabled={editForm.processing}>
                                                        {editForm.processing ? 'Saving…' : 'Save'}
                                                    </Button>
                                                    <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>
                                                        <X className="size-3.5 mr-1" /> Cancel
                                                    </Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                {comment.rating !== null && (
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={`size-3.5 ${s <= (comment.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-m text-muted-foreground">{comment.commentText}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
