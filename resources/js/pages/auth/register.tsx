import { Form, Head, Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
            <Head title="Register" />

            <div className="w-full max-w-md">
                {/* Brand header above the card */}
                <div className="mb-6 flex flex-col items-center gap-2">
                    <Link href={home()} className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
                            <BookOpen className="size-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Library</span>
                    </Link>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="pb-4 text-center">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Enter your details below to get started</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form
                            {...store.post()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="John Doe"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="••••••••"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Confirm password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        Create account
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 pt-0">
                        <Separator />
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
