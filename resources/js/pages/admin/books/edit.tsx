import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, FileText } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Category = { id: number; categoryName: string };
type Book = {
    id: number;
    name: string;
    ISBN: string;
    author: string;
    published_date: string;
    IsActive: boolean;
    categoryId: string;
    description: string | null;
    cover_image: string | null;
    pdf_file: string | null;
};
type Props = { book: Book; categories: Category[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Admin — Books', href: '/admin/books' },
    { title: 'Edit Book', href: '#' },
];

export default function AdminBooksEdit({ book, categories }: Props) {
    const { data, setData, post, processing, errors, progress } = useForm({
        _method: 'put' as const,
        name: book.name,
        ISBN: book.ISBN,
        author: book.author,
        published_date: book.published_date,
        categoryId: book.categoryId,
        IsActive: book.IsActive,
        description: book.description ?? '',
        cover_image: null as File | null,
        pdf_file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/books/${book.id}`, { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Book" />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin/books">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Book</h1>
                        <p className="mt-0.5 text-m text-muted-foreground">Update the book details below.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5 rounded-xl border p-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Book Title</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                            id="author"
                            value={data.author}
                            onChange={(e) => setData('author', e.target.value)}
                        />
                        <InputError message={errors.author} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ISBN">ISBN</Label>
                        <Input
                            id="ISBN"
                            value={data.ISBN}
                            onChange={(e) => setData('ISBN', e.target.value)}
                        />
                        <InputError message={errors.ISBN} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="published_date">Published Date</Label>
                        <Input
                            id="published_date"
                            type="date"
                            value={data.published_date}
                            onChange={(e) => setData('published_date', e.target.value)}
                        />
                        <InputError message={errors.published_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select value={data.categoryId} onValueChange={(v) => setData('categoryId', v)}>
                            <SelectTrigger id="categoryId">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.categoryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.categoryId} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Enter a book description/summary..."
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-m ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cover_image">Cover Image</Label>
                        {book.cover_image && (
                            <div className="mb-2">
                                <img src={book.cover_image} alt="Current cover" className="h-32 w-auto rounded-md border object-cover" />
                                <p className="mt-1 text-xs text-muted-foreground">Current cover image</p>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <ImageIcon className="size-5 text-muted-foreground" />
                            <Input
                                id="cover_image"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Leave empty to keep current image. Max 2MB.</p>
                        <InputError message={errors.cover_image} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="pdf_file">PDF File</Label>
                        {book.pdf_file && (
                            <p className="text-xs text-green-600">PDF file is currently uploaded.</p>
                        )}
                        <div className="flex items-center gap-3">
                            <FileText className="size-5 text-muted-foreground" />
                            <Input
                                id="pdf_file"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setData('pdf_file', e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Leave empty to keep current file. Max 20MB.</p>
                        <InputError message={errors.pdf_file} />
                    </div>

                    {progress && (
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            id="IsActive"
                            type="checkbox"
                            checked={data.IsActive}
                            onChange={(e) => setData('IsActive', e.target.checked)}
                            className="size-4 rounded border"
                        />
                        <Label htmlFor="IsActive">Active (visible to users)</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing} className="flex-1">
                            {processing ? 'Updating…' : 'Update Book'}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/books">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
