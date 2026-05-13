import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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

type Book = {
    id: number;
    name: string;
    ISBN: string;
    author: string;
    published_date: string;
    IsActive: boolean;
    category: { categoryName: string } | null;
};

type Props = SharedData & { books: Book[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Admin — Books', href: '/admin/books' },
];

export default function AdminBooksIndex() {
    const { books, flash } = usePage<Props>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/books/${deleteId}`, {
            onFinish: () => setDeleteId(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Books" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-m text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Books</h1>
                        <p className="mt-1 text-m text-muted-foreground">Manage all books in the library.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/books/create">
                            <Plus className="mr-1 size-4" />
                            Add Book
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-m">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Title</th>
                                <th className="px-4 py-3 text-left font-medium">Author</th>
                                <th className="px-4 py-3 text-left font-medium">ISBN</th>
                                <th className="px-4 py-3 text-left font-medium">Category</th>
                                <th className="px-4 py-3 text-left font-medium">Published</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {books.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No books found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                books.map((book) => (
                                    <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium">{book.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{book.author}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{book.ISBN}</td>
                                        <td className="px-4 py-3">
                                            {book.category ? (
                                                <Badge variant="secondary">{book.category.categoryName}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{book.published_date}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={book.IsActive ? 'default' : 'outline'}>
                                                {book.IsActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="ghost" size="icon">
                                                    <Link href={`/admin/books/${book.id}/edit`}>
                                                        <Pencil className="size-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeleteId(book.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
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
                        <DialogTitle>Delete Book</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this book? This action cannot be undone.
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
