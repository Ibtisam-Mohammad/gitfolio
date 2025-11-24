'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Download, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FloatingActionButtonsProps {
  username: string;
  isPreview: boolean;
  onTogglePreview: () => void;
}

export function FloatingActionButtons({ username, isPreview, onTogglePreview }: FloatingActionButtonsProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('preview', 'true');
    navigator.clipboard.writeText(url.toString());
    toast({
      title: 'Link Copied!',
      description: 'The preview link to your portfolio has been copied.',
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const content = document.getElementById('portfolio-content');
      if (!content) {
        throw new Error('Portfolio content not found');
      }

      // Add a class to the body to hide controls during PDF generation
      document.body.classList.add('pdf-generating');

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 1440,
      });

      document.body.classList.remove('pdf-generating');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${username}-gitfolio.pdf`);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        variant: "destructive",
        title: 'Download Failed',
        description: 'Could not generate the PDF file.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 print:hidden">
      <Button onClick={onTogglePreview} size="icon" variant="outline" className="rounded-none h-12 w-12 bg-background/80 backdrop-blur-sm">
        {isPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        <span className="sr-only">{isPreview ? 'Exit Preview' : 'Enter Preview'}</span>
      </Button>
      <Button onClick={handleShare} size="icon" variant="outline" className="rounded-none h-12 w-12 bg-background/80 backdrop-blur-sm">
        <Share2 className="w-5 h-5" />
        <span className="sr-only">Share Portfolio</span>
      </Button>
      <Button onClick={handleDownload} size="icon" disabled={isDownloading} className="rounded-none h-12 w-12">
        {isDownloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        <span className="sr-only">Download as PDF</span>
      </Button>
    </div>
  );
}
