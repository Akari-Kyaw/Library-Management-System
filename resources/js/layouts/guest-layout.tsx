import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top nav */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-2 font-semibold text-primary">
                        <BookOpen className="size-5" />
                        <span>Library</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/register">Register</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {children}
            </main>
        </div>
    );
}
