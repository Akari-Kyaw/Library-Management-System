import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Category = { id: number; categoryName: string; IsActive: boolean };
type Props = { category: Category };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
    { title: 'Edit Category', href: '#' },
];

export default function AdminCategoriesEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        categoryName: category.categoryName,
        IsActive: category.IsActive,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin/categories"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
                        <p className="mt-0.5 text-m text-muted-foreground">Update category details.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5 rounded-xl border p-6">
                    <div className="grid gap-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                            id="categoryName"
                            value={data.categoryName}
                            onChange={(e) => setData('categoryName', e.target.value)}
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
                            {processing ? 'Updating…' : 'Update Category'}
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
