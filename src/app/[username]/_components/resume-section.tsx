'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Link as LinkIcon, Upload, Wand2, Loader2 } from 'lucide-react';

interface ResumeSectionProps {
  username: string;
  isPreviewing: boolean;
  onEnhance: (resumeText: string) => void;
  isEnhancing: boolean;
}

export function ResumeSection({ username, isPreviewing, onEnhance, isEnhancing }: ResumeSectionProps) {
  const [resumeUrl, setResumeUrl] = useState('');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLocalFile(file);
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      setResumeUrl(''); // Clear the URL input if a file is selected
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setResumeUrl(url);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    setLocalFile(null);
    setObjectUrl(null);
  };
  
  const handleEnhance = () => {
    if (resumeText) {
        onEnhance(resumeText);
    }
  };

  const viewableLink = resumeUrl || objectUrl;
  const canShowSection = isPreviewing ? (!!viewableLink || !!resumeText) : true;

  if (!canShowSection) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <FileText className="w-5 h-5 text-primary" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isPreviewing ? (
          <div className="space-y-4">
            <div>
              <CardDescription>
                Link to your resume (PDF, etc.).
              </CardDescription>
              <div className="relative mt-2">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://example.com/my-resume.pdf"
                  value={resumeUrl}
                  onChange={handleUrlChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
            </div>

            <div>
              <CardDescription>Upload a file from your computer.</CardDescription>
              <div className="mt-2">
                <Button asChild variant="outline" className="w-full">
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {localFile ? `Selected: ${localFile.name}` : 'Upload File'}
                    <input id="resume-upload" type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={handleFileChange} />
                  </label>
                </Button>
              </div>
            </div>
            
             <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Then</span></div>
            </div>
            
            <div>
              <CardDescription>
                For the best results, paste your resume text below to enhance the AI analysis.
              </CardDescription>
              <Textarea 
                placeholder="Paste your resume content here..."
                rows={8}
                className="mt-2"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <Button onClick={handleEnhance} disabled={!resumeText || isEnhancing} className="w-full mt-2">
                  {isEnhancing ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2" />}
                  Enhance Portfolio with Resume
              </Button>
            </div>

          </div>
        ) : null}
        
        {viewableLink && (
             <Button asChild className="w-full" variant={isPreviewing ? 'default' : 'secondary'}>
                <a href={viewableLink} target="_blank" rel="noopener noreferrer">
                    View Uploaded Resume File
                </a>
            </Button>
        )}
        
        {!viewableLink && !isPreviewing && (
            <p className="text-sm text-muted-foreground text-center pt-2">No resume file linked or uploaded.</p>
        )}
        
      </CardContent>
    </Card>
  );
}
