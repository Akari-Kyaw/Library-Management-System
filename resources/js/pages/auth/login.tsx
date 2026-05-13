import { Form, Head, Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
            <Head title="Log in" />

            <div className="w-full max-w-md">
                {/* Brand header above the card */}
                <div className="mb-6 flex flex-col items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
                            <BookOpen className="size-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Library</span>
                    </Link>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="pb-4 text-center">
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription>Sign in to your account to continue</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {status && (
                            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-m font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                                {status}
                            </div>
                        )}

                        <Form
                            method="post"
                            action="/login"
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {errors.email && (
                                        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                                            <svg className="mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span>{errors.email}</span>
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href="/forgot-password"
                                                    className="ml-auto text-m"
                                                    tabIndex={5}
                                                >
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                   

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Sign in
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>

                    {canRegister && (
                        <>
                            <Separator />
                            <CardFooter className="flex justify-center pt-4 text-m text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href="/register" tabIndex={6} className="ml-1 font-medium">
                                    Create one
                                </TextLink>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
