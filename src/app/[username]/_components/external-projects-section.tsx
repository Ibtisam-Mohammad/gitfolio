'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight, Plus, Trash2, Link as LinkIcon, FolderKanban } from 'lucide-react';
import { ExternalProject } from '@/lib/types';

interface ExternalProjectsSectionProps {
  isPreviewing: boolean;
}

function ProjectCard({ project, onRemove, isPreviewing }: { project: ExternalProject; onRemove: (id: string) => void; isPreviewing: boolean; }) {
  return (
    <Card className="flex flex-col h-full bg-card/50 hover:bg-card hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-300 group">
      <div className="relative w-full h-40">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
        />
        {!isPreviewing && (
          <div className="absolute top-2 right-2">
            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onRemove(project.id)}>
                <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">
          {project.description}
        </p>
      </CardContent>
      <CardFooter>
        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold flex items-center gap-1 group-hover:text-primary transition-colors">
          View Project <ArrowRight className="w-4 h-4" />
        </a>
      </CardFooter>
    </Card>
  );
}

function AddProjectForm({ onAddProject }: { onAddProject: (project: Omit<ExternalProject, 'id'>) => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !imageUrl || !projectUrl) return;

        setIsAdding(true);
        onAddProject({ title, description, imageUrl, projectUrl });
        
        // Reset form
        setTitle('');
        setDescription('');
        setImageUrl('');
        setProjectUrl('');
        setIsAdding(false);
    };

    return (
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Add External Project</CardTitle>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Textarea placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
                <Input placeholder="Thumbnail Image URL" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
                <Input placeholder="Project URL" type="url" value={projectUrl} onChange={e => setProjectUrl(e.target.value)} required />
                <Button type="submit" disabled={isAdding} className="w-full">
                    {isAdding ? <Loader2 className="animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Add Project</>}
                </Button>
            </form>
          </CardContent>
        </Card>
    );
}

export function ExternalProjectsSection({ isPreviewing }: ExternalProjectsSectionProps) {
  const [projects, setProjects] = useState<ExternalProject[]>([]);
  
  const handleAddProject = (newProjectData: Omit<ExternalProject, 'id'>) => {
    const newProject: ExternalProject = {
      ...newProjectData,
      id: Date.now().toString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const handleRemoveProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };
  
  if (isPreviewing && projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FolderKanban className="w-7 h-7 text-primary" />
        <h2 className="text-3xl font-bold font-headline">External Projects</h2>
      </div>

      {!isPreviewing && (
        <AddProjectForm onAddProject={handleAddProject} />
      )}

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} onRemove={handleRemoveProject} isPreviewing={isPreviewing} />
          ))}
        </div>
      ) : (
        !isPreviewing && (
            <div className="text-center text-muted-foreground py-8">
              <p>No external projects added yet. Use the form above to add your first one.</p>
            </div>
        )
      )}
    </div>
  );
}
