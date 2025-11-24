'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Github, Loader2 } from 'lucide-react';
import { searchUser } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Github className="mr-2 h-4 w-4" />
      )}
      Generate Portfolio
    </Button>
  );
}

export function UsernameForm() {
  return (
    <form action={searchUser} className="flex flex-col md:flex-row gap-2">
      <div className="relative flex-grow">
        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          name="username"
          placeholder="Enter your GitHub username"
          required
          className="pl-10 text-base md:text-sm h-11 border-2 shadow-hard"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
