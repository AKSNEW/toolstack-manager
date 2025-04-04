
import React, { useState } from 'react';
import { SiteMedia } from '@/lib/types';
import { employees } from '@/lib/data/employees';
import { 
  ImageIcon, 
  Video, 
  X, 
  ExternalLink,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SiteMediaGalleryProps {
  media: SiteMedia[];
  onDelete?: (mediaId: string) => void;
}

const SiteMediaGallery: React.FC<SiteMediaGalleryProps> = ({ media, onDelete }) => {
  const [selectedMedia, setSelectedMedia] = useState<SiteMedia | null>(null);
  
  const getEmployeeName = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId);
    return employee ? employee.name : 'Неизвестный сотрудник';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const isYoutubeUrl = (url: string) => {
    return url.includes('youtube.com/') || url.includes('youtu.be/');
  };
  
  const getYoutubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };
  
  const isVimeoUrl = (url: string) => {
    return url.includes('vimeo.com/');
  };
  
  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.split('vimeo.com/')[1].split('?')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  };
  
  const renderVideoEmbed = (url: string) => {
    let embedUrl = url;
    
    if (isYoutubeUrl(url)) {
      embedUrl = getYoutubeEmbedUrl(url);
    } else if (isVimeoUrl(url)) {
      embedUrl = getVimeoEmbedUrl(url);
    }
    
    return (
      <iframe 
        src={embedUrl} 
        className="w-full aspect-video rounded-md"
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      />
    );
  };
  
  if (media.length === 0) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <div className="flex justify-center mb-2">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <Video className="h-8 w-8 text-muted-foreground ml-2" />
        </div>
        <p className="text-muted-foreground">
          К этой неисправности не прикреплены медиафайлы
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <div 
            key={item.id} 
            className="relative rounded-md overflow-hidden border border-border group cursor-pointer"
            onClick={() => setSelectedMedia(item)}
          >
            {/* Media thumbnail/preview */}
            <div className="aspect-square bg-muted relative">
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt={item.description || 'Изображение'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  {item.thumbnailUrl ? (
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.description || 'Видео'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Video className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Media type badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 flex items-center gap-1"
            >
              {item.type === 'image' ? (
                <ImageIcon className="h-3 w-3" />
              ) : (
                <Video className="h-3 w-3" />
              )}
              <span>{item.type === 'image' ? 'Фото' : 'Видео'}</span>
            </Badge>
            
            {/* Delete button (if enabled) */}
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                <span className="truncate">{item.description || 'Нажмите для просмотра'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Media preview dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMedia?.type === 'image' ? 'Просмотр изображения' : 'Просмотр видео'}
            </DialogTitle>
            {selectedMedia?.description && (
              <DialogDescription>
                {selectedMedia.description}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="mt-2">
            {selectedMedia?.type === 'image' ? (
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.description || 'Изображение'} 
                className="w-full rounded-md max-h-[70vh] object-contain"
              />
            ) : (
              <div>
                {renderVideoEmbed(selectedMedia?.url || '')}
              </div>
            )}
            
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>
                  Добавлено: {getEmployeeName(selectedMedia?.uploadedBy || '')}
                </span>
                <span>
                  {formatDate(selectedMedia?.uploadedDate || '')}
                </span>
              </div>
              
              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedMedia?.url, '_blank')}
                  className="flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Открыть оригинал
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteMediaGallery;
