'use client';

import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-4">
      <Frown className="w-20 h-20 text-primary mb-6" />
      <h2 className="text-4xl font-bold font-headline mb-2">User Not Found</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        Oops! We couldn't find the GitHub user you were looking for. Please check the username and try again.
      </p>
      <Button asChild>
        <Link href="/">Search for another user</Link>
      </Button>
    </div>
  )
}
