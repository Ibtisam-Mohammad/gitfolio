'use client';

import { useState, useEffect } from 'react';
import { Book, Briefcase, Plus, Trash2, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { JourneyEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CareerJourneySectionProps {
  initialEntries: JourneyEntry[];
  onEntriesChange: (entries: JourneyEntry[]) => void;
  isPreviewing: boolean;
}

function JourneyTimelineItem({ entry, onRemove, isPreviewing }: { entry: JourneyEntry; onRemove: (id: string) => void; isPreviewing: boolean }) {
  const Icon = entry.type === 'Work' ? Briefcase : Book;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="grid place-items-center bg-primary/10 text-primary p-2.5 border-2 border-dashed border-black">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-grow w-px bg-border my-2"></div>
      </div>
      <div className="pb-8 flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold font-headline text-lg">{entry.role}</p>
                <p className="text-muted-foreground">{entry.organization}</p>
                <p className="text-sm text-muted-foreground mt-1">{entry.startDate} – {entry.endDate}</p>
            </div>
            <div className={cn('flex items-center gap-1', isPreviewing && 'print:hidden')}>
                {entry.isAiGenerated && (
                    <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border-2 border-dashed border-black px-2 py-1">
                        <Wand2 className="w-3 h-3" />
                        <span>AI</span>
                    </div>
                )}
                {!isPreviewing && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemove(entry.id)}>
                      <Trash2 className="w-4 h-4" />
                  </Button>
                )}
            </div>
        </div>
        {entry.description && (
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{entry.description}</p>
        )}
      </div>
    </div>
  );
}

function JourneyForm({ onAdd }: { onAdd: (entry: JourneyEntry) => void; }) {
    const [type, setType] = useState<'Work' | 'Education'>('Work');
    const [organization, setOrganization] = useState('');
    const [role, setRole] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization || !role || !startDate || !endDate) return;

        onAdd({
            id: Date.now().toString(),
            type,
            organization,
            role,
            startDate,
            endDate,
            description,
            isAiGenerated: false,
        });

        // Reset form
        setOrganization('');
        setRole('');
        setStartDate('');
        setEndDate('');
        setDescription('');
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-4 border-2 border-dashed border-black space-y-4 print:hidden">
            <h4 className="font-bold font-headline">Add New Entry</h4>
            <div className="flex gap-2">
                <Button type="button" onClick={() => setType('Work')} variant={type === 'Work' ? 'default' : 'outline'} className="w-full">Work</Button>
                <Button type="button" onClick={() => setType('Education')} variant={type === 'Education' ? 'default' : 'outline'} className="w-full">Education</Button>
            </div>
            <Input placeholder="Organization Name" value={organization} onChange={e => setOrganization(e.target.value)} required />
            <Input placeholder={type === 'Work' ? "Role / Job Title" : "Degree / Field of Study"} value={role} onChange={e => setRole(e.target.value)} required />
            <div className="flex gap-2">
                <Input placeholder="Start Date (MMMM YYYY)" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                <Input placeholder="End Date (MMMM YYYY)" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add to Journey
            </Button>
        </form>
    );
}


export function CareerJourneySection({ initialEntries, onEntriesChange, isPreviewing }: CareerJourneySectionProps) {
  const [entries, setEntries] = useState<JourneyEntry[]>(initialEntries);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const addEntry = (entry: JourneyEntry) => {
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    onEntriesChange(newEntries);
  };
  
  const removeEntry = (id: string) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    onEntriesChange(newEntries);
  };
  
  // Sort entries chronologically by end date (newest first).
  // "Present" is always considered the newest.
  const sortedEntries = [...entries].sort((a, b) => {
      const dateA = a.endDate === 'Present' ? new Date() : new Date(a.endDate);
      const dateB = b.endDate === 'Present' ? new Date() : new Date(b.endDate);
      return dateB.getTime() - dateA.getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <span className="font-headline">Career Journey</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPreviewing && <JourneyForm onAdd={addEntry} />}
        
        <div className="space-y-2 pt-4">
            {!isPreviewing && <h4 className="font-bold font-headline print:hidden">Timeline</h4>}
            
            {sortedEntries.length === 0 && !isPreviewing &&(
                <p className="text-muted-foreground text-center py-4 print:hidden">No career history added. Use the form above to build your timeline.</p>
            )}
            
            {sortedEntries.length > 0 && (
                <div>
                    {sortedEntries.map(entry => (
                        <JourneyTimelineItem key={entry.id} entry={entry} onRemove={removeEntry} isPreviewing={isPreviewing} />
                    ))}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
