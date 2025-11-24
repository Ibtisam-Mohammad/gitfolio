'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Rss, Wand2, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Article } from '@/lib/types';
import { summarizeArticle } from '@/ai/flows/summarize-article';
import { useToast } from '@/hooks/use-toast';

interface ArticlesSectionProps {
  isPreviewing: boolean;
}

function ArticleCard({ article, onRemove, isPreviewing }: { article: Article; onRemove: (id: string) => void; isPreviewing: boolean; }) {
  return (
    <Card className="flex flex-col h-full bg-card/50 hover:bg-card hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-300 group">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{article.title}</CardTitle>
        {!isPreviewing && (
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2" onClick={() => onRemove(article.id)}>
                <Trash2 className="w-4 h-4" />
            </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 text-primary text-sm mb-2">
            <Wand2 className="w-4 h-4" />
            <span className="font-semibold">AI Summary</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {article.summary || 'Summary is being generated...'}
        </p>
      </CardContent>
      <CardFooter>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold flex items-center gap-1 group-hover:text-primary transition-colors">
          Read More <ArrowRight className="w-4 h-4" />
        </a>
      </CardFooter>
    </Card>
  );
}

function AddArticleForm({ onAddArticle }: { onAddArticle: (article: Omit<Article, 'id' | 'summary'>) => Promise<void> }) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !url || !content) return;

        setIsAdding(true);
        await onAddArticle({ title, url, content });
        
        // Reset form
        setTitle('');
        setUrl('');
        setContent('');
        setIsAdding(false);
    };

    return (
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Add an Article</CardTitle>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Article Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Article URL" type="url" value={url} onChange={e => setUrl(e.target.value)} required />
                <Textarea placeholder="Paste the full content of your article here for AI summarization..." value={content} onChange={e => setContent(e.target.value)} required rows={6} />
                <Button type="submit" disabled={isAdding} className="w-full">
                    {isAdding ? <Loader2 className="animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Add & Summarize Article</>}
                </Button>
            </form>
          </CardContent>
        </Card>
    );
}

export function ArticlesSection({ isPreviewing }: ArticlesSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const { toast } = useToast();
  
  const handleAddArticle = async (newArticleData: Omit<Article, 'id' | 'summary'>) => {
    const tempId = Date.now().toString();
    const newArticle: Article = {
      ...newArticleData,
      id: tempId,
      summary: 'Generating summary...',
    };
    
    setArticles(prev => [...prev, newArticle]);

    try {
      const result = await summarizeArticle({ articleContent: newArticle.content });
      setArticles(prev => prev.map(a => a.id === tempId ? { ...a, summary: result.summary } : a));
    } catch (e) {
      console.error(`Failed to summarize article`, e);
      toast({
          variant: "destructive",
          title: 'Summarization Failed',
          description: 'Could not generate an AI summary for this article.',
      });
      setArticles(prev => prev.map(a => a.id === tempId ? { ...a, summary: 'Could not generate summary.' } : a));
    }
  };

  const handleRemoveArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };
  
  if (isPreviewing && articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Rss className="w-7 h-7 text-primary" />
        <h2 className="text-3xl font-bold font-headline">My Articles</h2>
      </div>

      {!isPreviewing && (
        <AddArticleForm onAddArticle={handleAddArticle} />
      )}

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} onRemove={handleRemoveArticle} isPreviewing={isPreviewing} />
          ))}
        </div>
      ) : (
        !isPreviewing && (
            <div className="text-center text-muted-foreground py-8">
              <p>No articles added yet. Use the form above to add your first one.</p>
            </div>
        )
      )}
    </div>
  );
}
