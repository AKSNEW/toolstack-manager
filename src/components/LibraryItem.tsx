
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, BookOpen, FileText, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { employees } from '@/lib/data/employees';
import { LibraryItem as LibraryItemType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { downloadLibraryFile } from '@/services/libraryService';

interface LibraryItemProps {
  item: LibraryItemType;
}

const LibraryItem: React.FC<LibraryItemProps> = ({ item }) => {
  const { toast } = useToast();
  const authorDetails = employees.find(emp => emp.id === item.authorId);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };
  
  const getIcon = () => {
    switch (item.type) {
      case 'book':
        return BookOpen;
      case 'standard':
        return FileSpreadsheet;
      case 'instruction':
      default:
        return FileText;
    }
  };
  
  const getTypeLabel = () => {
    switch (item.type) {
      case 'book':
        return 'Книга';
      case 'standard':
        return 'ГОСТ/СП';
      case 'instruction':
        return 'Инструкция';
      default:
        return 'Документ';
    }
  };
  
  const handleDownload = () => {
    if (item.fileUrl) {
      toast({
        title: "Скачивание начато",
        description: `Файл "${item.name}" скачивается`,
      });
      
      downloadLibraryFile(item.fileUrl)
        .catch(error => {
          console.error("Download error:", error);
          toast({
            title: "Ошибка скачивания",
            description: "Не удалось скачать файл",
            variant: "destructive"
          });
        });
    }
  };
  
  const Icon = getIcon();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-2">
            <div className={`p-2 rounded-lg ${
              item.type === 'book' ? 'bg-blue-50 text-blue-600' : 
              item.type === 'instruction' ? 'bg-amber-50 text-amber-600' : 
              'bg-green-50 text-green-600'
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription className="mt-1">
                {item.author && <span className="block">{item.author}</span>}
                {item.year && <span className="block">{item.year}</span>}
              </CardDescription>
            </div>
          </div>
          <Badge>{getTypeLabel()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            {authorDetails?.avatar && <AvatarImage src={authorDetails.avatar} alt={authorDetails.name} />}
            <AvatarFallback>{authorDetails ? getInitials(authorDetails.name) : '??'}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {(item as any).authorName || authorDetails?.name || 'Неизвестный пользователь'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-0">
        {item.fileUrl && (
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Скачать
          </Button>
        )}
        
        {item.externalLink && (
          <Button variant="outline" size="sm" onClick={() => window.open(item.externalLink, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Открыть
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LibraryItem;
