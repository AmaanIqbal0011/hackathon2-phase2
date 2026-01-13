---
name: frontend-skill
description: Build pages, components, layouts, and styling with Next.js App Router and React. Use for UI development.
---

# Frontend Skill

## Instructions

1. **Page Structure**
   - Create pages in app/ directory using page.tsx
   - Implement layouts with layout.tsx for shared UI
   - Add loading states with loading.tsx
   - Handle errors with error.tsx
   - Use route groups for organization

2. **Component Development**
   - Build reusable components in components/ directory
   - Use Server Components by default
   - Add 'use client' only when needed (state, events, browser APIs)
   - Implement proper TypeScript interfaces for props
   - Create component variants for flexibility

3. **Layout Design**
   - Implement responsive layouts with Flexbox/Grid
   - Use mobile-first approach (320px → 1920px)
   - Create consistent spacing system
   - Build reusable layout components (Header, Footer, Sidebar)
   - Handle nested layouts efficiently

4. **Styling**
   - Use Tailwind CSS utility classes
   - Implement responsive breakpoints (sm, md, lg, xl, 2xl)
   - Create custom colors in tailwind.config.ts
   - Use CSS modules for component-specific styles
   - Implement dark mode with Tailwind's dark: prefix

## Best Practices

- Use Server Components by default (faster, less JavaScript)
- Add 'use client' only for interactive components
- Optimize images with next/image component
- Use next/font for font optimization
- Implement proper TypeScript types for all props
- Create reusable components to avoid duplication
- Follow Tailwind's utility-first approach
- Use semantic HTML (header, nav, main, article, footer)
- Implement proper ARIA labels for accessibility
- Add loading skeletons for better UX
- Use dynamic imports for code splitting
- Keep components small and focused (Single Responsibility)
- Test responsive design on multiple screen sizes
- Implement proper error boundaries

## Example Structure
```typescript
// app/page.tsx - Home page (Server Component)
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
```
```typescript
// app/layout.tsx - Root layout
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
        {children}
        </main>
        <Footer />
        </div>
      </body>
    </html>
  );
}
```
```typescript
// app/loading.tsx - Loading state
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
```
```typescript
// app/error.tsx - Error boundary
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
```
```typescript
// components/ui/Button.tsx - Reusable button component
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```
```typescript
// components/ui/Card.tsx - Reusable card component
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={cn('text-2xl font-bold', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('text-gray-600', className)} {...props}>
      {children}
    </div>
  );
}
```
```typescript
// components/forms/LoginForm.tsx - Form component (Client Component)
'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Handle success (redirect, etc.)
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```
```typescript
// components/layout/Header.tsx - Header component
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            MyApp
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
```

## Responsive Design Patterns
```typescript
// Mobile-first responsive component
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
  <div className="bg-white p-6 rounded-lg shadow">
    Content
  </div>
</div>
```

## Common Layout Patterns

- **Full-Width Hero**: `<section className="w-full min-h-screen">`
- **Container**: `<div className="container mx-auto px-4 max-w-7xl">`
- **Grid Layout**: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`
- **Centered Content**: `<div className="flex items-center justify-center min-h-screen">`
- **Sticky Header**: `<header className="sticky top-0 z-50">`
- **Two-Column**: `<div className="grid md:grid-cols-2 gap-8">`
- **Sidebar Layout**: `<div className="flex"><aside className="w-64">...</aside><main className="flex-1">...</main></div>`

## Accessibility Checklist

- ✅ Use semantic HTML (header, nav, main, article, section, footer)
- ✅ Add alt text to all images
- ✅ Implement keyboard navigation (tab, enter, escape)
- ✅ Use proper heading hierarchy (h1 → h2 → h3)
- ✅ Add ARIA labels where needed
- ✅ Ensure sufficient color contrast (WCAG AA: 4.5:1)
- ✅ Add focus states to interactive elements
- ✅ Use proper form labels with htmlFor
- ✅ Implement skip-to-content links
- ✅ Test with screen readers

## Performance Optimization

- Use next/image for automatic optimization
- Implement lazy loading for images and components
- Use dynamic imports for heavy components
- Minimize client-side JavaScript ('use client' sparingly)
- Leverage Server Components for data fetching
- Implement proper caching strategies
- Optimize fonts with next/font
- Use React.memo for expensive components
- Implement virtualization for long lists
