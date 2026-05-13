import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
    { title: 'Add Category', href: '/admin/categories/create' },
];

export default function AdminCategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        categoryName: '',
        IsActive: true as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Category" />

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin/categories"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Category</h1>
                        <p className="mt-0.5 text-m text-muted-foreground">Create a new book category.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5 rounded-xl border p-6">
                    <div className="grid gap-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                            id="categoryName"
                            value={data.categoryName}
                            onChange={(e) => setData('categoryName', e.target.value)}
                            placeholder="e.g. Fiction"
                            autoFocus
                        />
                        <InputError message={errors.categoryName} />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="IsActive"
                            type="checkbox"
                            checked={data.IsActive}
                            onChange={(e) => setData('IsActive', e.target.checked)}
                            className="size-4 rounded border"
                        />
                        <Label htmlFor="IsActive">Active</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing} className="flex-1">
                            {processing ? 'Saving…' : 'Save Category'}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/categories">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
