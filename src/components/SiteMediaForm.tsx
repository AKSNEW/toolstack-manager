
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SiteMedia } from '@/lib/types';
import { employees } from '@/lib/data/employees';
import { 
  ImageIcon,
  Video,
  Upload,
  X
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface SiteMediaFormProps {
  defectId: string;
  onSuccess: (media: SiteMedia) => void;
  onCancel: () => void;
}

const SiteMediaForm: React.FC<SiteMediaFormProps> = ({ defectId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: 'Ошибка',
        description: 'Укажите URL медиафайла',
        variant: 'destructive',
      });
      return;
    }
    
    const newMedia: SiteMedia = {
      id: `media-${Date.now()}`,
      defectId,
      type: mediaType,
      url,
      description: description || undefined,
      uploadedBy: 'emp-001', // Current user ID
      uploadedDate: new Date().toISOString(),
      thumbnailUrl: mediaType === 'video' && thumbnailUrl ? thumbnailUrl : undefined,
    };
    
    onSuccess(newMedia);
    
    toast({
      title: mediaType === 'image' ? 'Изображение добавлено' : 'Видео добавлено',
      description: 'Медиафайл успешно прикреплен к неисправности',
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="image" onValueChange={(value) => setMediaType(value as 'image' | 'video')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Изображение</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Видео</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL изображения</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Укажите прямую ссылку на изображение
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageDescription">Описание (необязательно)</Label>
            <Textarea
              id="imageDescription"
              placeholder="Описание изображения..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="video" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL видео</Label>
            <Input
              id="videoUrl"
              placeholder="https://example.com/video.mp4 или https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Поддерживаются прямые ссылки на видеофайлы или ссылки YouTube/Vimeo
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">URL превью (необязательно)</Label>
            <Input
              id="thumbnailUrl"
              placeholder="https://example.com/thumbnail.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoDescription">Описание (необязательно)</Label>
            <Textarea
              id="videoDescription"
              placeholder="Описание видео..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {mediaType === 'image' ? 'Добавить изображение' : 'Добавить видео'}
        </Button>
      </div>
    </form>
  );
};

export default SiteMediaForm;
