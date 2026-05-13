import { Head, Link, router } from '@inertiajs/react';
import { BookmarkIcon, BookOpen, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';

type Book = {
    id: number;
    name: string;
    author: string;
    published_date: string;
    IsActive: boolean;
    cover_image: string | null;
    category: { categoryName: string } | null;
};

type Props = SharedData & {
    books: Book[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'My Favourites', href: '/my-favourites' },
];

export default function FavouritesIndex({ books }: Props) {
    const removeFavourite = (bookId: number) => {
        router.post(`/books/${bookId}/favourite`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Favourites" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <BookmarkIcon className="size-6 text-amber-500" />
                        My Favourites
                    </h1>
                    <p className="mt-1 text-m text-muted-foreground">
                        Books you've saved for later.
                    </p>
                </div>

                {books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
                        <BookmarkIcon className="size-10 text-muted-foreground/40" />
                        <div>
                            <p className="font-medium">No favourites yet</p>
                            <p className="mt-1 text-m text-muted-foreground">
                                Browse the library and save books you'd like to read.
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/dashboard">Browse Books</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book) => (
                            <Card key={book.id} className="overflow-hidden py-0">
                                {/* Cover */}
                                <div className="flex h-40 items-center justify-center bg-primary/10">
                                    {book.cover_image ? (
                                        <img
                                            src={book.cover_image}
                                            alt={book.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className="size-12 text-primary opacity-50" />
                                    )}
                                </div>

                                <CardHeader className="pb-2 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-base leading-snug">
                                            {book.name}
                                        </CardTitle>
                                        {book.category && (
                                            <Badge variant="secondary" className="shrink-0 text-xs">
                                                {book.category.categoryName}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-2 text-m text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <User className="size-3.5 shrink-0" />
                                        <span>{book.author}</span>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex gap-2 pb-4">
                                    <Button asChild variant="default" size="sm" className="flex-1">
                                        <Link href={`/books/${book.id}`}>View Book</Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFavourite(book.id)}
                                        className="text-amber-600 hover:text-amber-700 border-amber-200 hover:border-amber-300"
                                    >
                                        <BookmarkIcon className="size-4 fill-amber-500 text-amber-500" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
