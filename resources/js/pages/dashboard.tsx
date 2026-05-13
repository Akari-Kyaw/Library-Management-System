import { Head, Link, usePage } from '@inertiajs/react';
import { BookMarked, BookOpen, Calendar, Hash, Plus, Search, SlidersHorizontal, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';

type Book = {
    id: number;
    name: string;
    ISBN: string;
    IsActive: boolean;
    published_date: string;
    author: string;
    categoryId: string;
    cover_image: string | null;
    description: string | null;
    category: { categoryName: string } | null;
};

type DashboardProps = SharedData & {
    books: Book[];
    categories: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: dashboard().url },
];

export default function Dashboard() {
    const { books, categories, auth, flash } = usePage<DashboardProps>().props;
    const isAdmin = auth?.user?.role === 'admin';

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Flash message */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-m text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                {/* Header + search + filter row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Book Library</h1>
                        <p className="mt-1 text-m text-muted-foreground">
                            Browse all available books in the collection.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
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

                        {isAdmin && (
                            <Button asChild>
                                <Link href="/admin/books/create">
                                    <Plus className="mr-1 size-4" />
                                    Add Book
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <BookOpen className="size-10 text-muted-foreground" />
                            <p className="text-m text-muted-foreground">
                                {search || activeCategory ? 'No books match your search.' : 'No books available yet.'}
                            </p>
                            {(search || activeCategory) && (
                                <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setActiveCategory(null); }}>
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((book) => (
                            <Card key={book.id} className="flex flex-col gap-0 overflow-hidden py-0">
                                {/* Cover image or placeholder */}
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

                                <CardContent className="flex flex-col gap-2 text-m text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <User className="size-3.5 shrink-0" />
                                        <span className="truncate">{book.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hash className="size-3.5 shrink-0" />
                                        <span className="truncate font-mono text-m">{book.ISBN}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3.5 shrink-0" />
                                        <span>{book.published_date}</span>
                                    </div>
                                    {book.description && (
                                        <p className="mt-1 line-clamp-2 text-m pb-5">{book.description}</p>
                                    )}
                                </CardContent>

                                <CardFooter className="mt-auto flex gap-2 pb-5">
                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                        <Link href={`/books/${book.id}`}>
                                            <BookMarked className="mr-1 size-3.5" />
                                            View Details
                                        </Link>
                                    </Button>
                                    {isAdmin && (
                                        <Button asChild variant="secondary" size="sm" className="flex-1">
                                            <Link href={`/admin/books/${book.id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
