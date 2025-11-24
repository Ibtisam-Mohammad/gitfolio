'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, Trash2, Wand2, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSkills } from '@/ai/flows/generate-skills';
import type { GenerateSkillsInput } from '@/ai/flows/generate-skills';


interface ToolsSkillsSectionProps {
  isPreviewing: boolean;
  generationData: GenerateSkillsInput;
}

export function ToolsSkillsSection({ isPreviewing, generationData }: ToolsSkillsSectionProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleGenerateSkills = async () => {
    setIsGenerating(true);
    try {
        const result = await generateSkills(generationData);
        // Add only new skills to avoid duplicates
        const newSkills = result.skills.filter(s => !skills.includes(s));
        setSkills([...skills, ...newSkills]);
        toast({
            title: 'Skills Generated',
            description: `${newSkills.length} new skills were suggested by AI.`,
        });
    } catch (error) {
        console.error('Failed to generate skills:', error);
        toast({
            variant: 'destructive',
            title: 'AI Generation Failed',
            description: 'Could not suggest skills at this time.',
        });
    } finally {
        setIsGenerating(false);
    }
  };
  
  if (isPreviewing && skills.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Lightbulb className="w-6 h-6 text-primary" />
          Skills & Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPreviewing && (
          <div className="space-y-2 print:hidden">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Figma, Agile, Docker"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
              />
              <Button onClick={handleAddSkill} size="icon" aria-label="Add Skill">
                <Plus />
              </Button>
            </div>
             <Button onClick={handleGenerateSkills} variant="outline" size="sm" className="w-full" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2" />}
                Suggest Skills with AI
            </Button>
          </div>
        )}

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1.5 py-1 px-2 text-sm">
                {skill}
                {!isPreviewing && (
                  <button onClick={() => handleRemoveSkill(skill)} className="rounded-full hover:bg-black/20 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          !isPreviewing && (
            <p className="text-muted-foreground text-center py-4 text-sm">
              Add skills manually or let AI suggest some based on your profile.
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
}
