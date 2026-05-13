import { Head, Link } from '@inertiajs/react';
import { BookMarked, BookOpen, Calendar, Hash, LogIn, Search, SlidersHorizontal, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import GuestLayout from '@/layouts/guest-layout';

type Book = {
    id: number;
    name: string;
    ISBN: string;
    published_date: string;
    author: string;
    cover_image: string | null;
    description: string | null;
    category: { categoryName: string } | null;
};

type Props = {
    books: Book[];
    categories: string[];
};

export default function Library({ books, categories }: Props) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return books.filter((book) => {
            const matchesSearch = !q || book.name.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
            const matchesCategory = !activeCategory || book.category?.categoryName === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [books, search, activeCategory]);

    return (
        <GuestLayout>
            <Head title="Browse Books" />

            <div className="flex flex-col gap-6">
                {/* Header + search + filter row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Browse Books</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Explore our collection — register to borrow.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative w-64 shrink-0">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by title or author…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-9"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* Category pills */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                                        activeCategory === null
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                        className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                                            activeCategory === cat
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Register banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Want to borrow a book?</span>{' '}
                        Create a free account to get started.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/register">
                            <LogIn className="mr-1.5 size-4" />
                            Register for free
                        </Link>
                    </Button>
                </div>

                {/* Book grid */}
                {filtered.length === 0 ? (
                    <div className="flex items-center justify-center rounded-xl border border-dashed p-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <BookOpen className="size-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {search || activeCategory ? 'No books match your search.' : 'No books available yet.'}
                            </p>
                            {(search || activeCategory) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setSearch(''); setActiveCategory(null); }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((book) => (
                            <Card key={book.id} className="flex flex-col gap-0 overflow-hidden py-0">
                                <div className="flex h-48 items-center justify-center bg-primary/10">
                                    {book.cover_image ? (
                                        <img
                                            src={book.cover_image}
                                            alt={book.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className="size-14 text-primary opacity-70" />
                                    )}
                                </div>

                                <CardHeader className="pb-2 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-xl leading-snug">
                                            {book.name}
                                        </CardTitle>
                                        {book.category && (
                                            <Badge variant="secondary" className="shrink-0 text-xs">
                                                {book.category.categoryName}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <User className="size-3.5 shrink-0" />
                                        <span className="truncate">{book.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hash className="size-3.5 shrink-0" />
                                        <span className="truncate font-mono">{book.ISBN}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3.5 shrink-0" />
                                        <span>{book.published_date}</span>
                                    </div>
                                    {book.description && (
                                        <p className="mt-1 line-clamp-2 pb-2">{book.description}</p>
                                    )}
                                </CardContent>

                                <CardFooter className="mt-auto pb-5">
                                    <Button asChild variant="outline" size="sm" className="w-full">
                                        <Link href="/login">
                                            <BookMarked className="mr-1 size-3.5" />
                                            Login to View &amp; Borrow
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
