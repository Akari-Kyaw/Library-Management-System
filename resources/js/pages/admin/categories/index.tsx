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

type Category = {
    id: number;
    categoryName: string;
    IsActive: boolean;
    books_count: number;
};

type Props = SharedData & { categories: Category[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Admin — Categories', href: '/admin/categories' },
];

export default function AdminCategoriesIndex() {
    const { categories, flash } = usePage<Props>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/categories/${deleteId}`, {
            onFinish: () => setDeleteId(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Categories" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-m text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                        <p className="mt-1 text-m text-muted-foreground">Manage book categories.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/categories/create">
                            <Plus className="mr-1 size-4" />
                            Add Category
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-m">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">#</th>
                                <th className="px-4 py-3 text-left font-medium">Category Name</th>
                                <th className="px-4 py-3 text-left font-medium">Books</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No categories yet. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat, i) => (
                                    <tr key={cat.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium">{cat.categoryName}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{cat.books_count}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={cat.IsActive ? 'default' : 'outline'}>
                                                {cat.IsActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="ghost" size="icon">
                                                    <Link href={`/admin/categories/${cat.id}/edit`}>
                                                        <Pencil className="size-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeleteId(cat.id)}
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

            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure? Books in this category will lose their category link.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
