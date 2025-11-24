import Image from 'next/image';
import { Github } from 'lucide-react';
import { UsernameForm } from '@/components/username-form';
import { placeholderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-background');

  return (
    <div className="w-full">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center">
        {/* The grid background is now handled globally in layout.tsx */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="relative z-10 p-4 flex flex-col items-center">
          <div className="bg-primary/10 border-2 border-black text-primary rounded-none px-4 py-1.5 text-sm font-bold uppercase tracking-wide mb-4 inline-flex items-center gap-2 shadow-hard">
            <Github className="w-4 h-4" />
            Powered by GitHub & GenAI
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
            Your Developer Portfolio, Reimagined
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-foreground/80 mb-8">
            Instantly generate a stunning, professional portfolio website by just entering your GitHub username.
          </p>
          <div className="w-full max-w-md">
            <UsernameForm />
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 border-2 border-dashed border-black">
              <div className="p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
              </div>
              <h3 className="text-xl font-headline font-semibold mb-2">Analyze</h3>
              <p className="text-muted-foreground">We fetch your GitHub profile and repositories to understand your work.</p>
            </div>
            <div className="flex flex-col items-center p-6 border-2 border-dashed border-black">
               <div className="p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
              </div>
              <h3 className="text-xl font-headline font-semibold mb-2">Generate</h3>
              <p className="text-muted-foreground">Our AI crafts a professional summary and visualizes your skills.</p>
            </div>
            <div className="flex flex-col items-center p-6 border-2 border-dashed border-black">
               <div className="p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M5.52 5.52a10 10 0 0 1 13.96 0"/><path d="M12 2v4"/><path d="M22 12h-4"/><path d="M5.52 18.48a10 10 0 0 1 0-13.96"/><path d="M2 12h4"/><path d="m12 18 2 4 2-4"/><path d="m12 12 2 4 2-4"/></svg>
              </div>
              <h3 className="text-xl font-headline font-semibold mb-2">Showcase</h3>
              <p className="text-muted-foreground">Present your best work with a clean, modern, and shareable portfolio.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
