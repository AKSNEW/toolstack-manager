
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ExternalLink, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { employees } from '@/lib/data/employees';
import { ToolboxItem as ToolboxItemType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ToolboxItemProps {
  item: ToolboxItemType;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ item }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(item.likes || 0);
  const [dislikes, setDislikes] = useState(item.dislikes || 0);
  const [userVoted, setUserVoted] = useState<'like' | 'dislike' | null>(null);
  const { toast } = useToast();

  const authorDetails = employees.find(emp => emp.id === item.authorId);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const handleLike = () => {
    if (userVoted === 'like') {
      setLikes(prev => prev - 1);
      setUserVoted(null);
    } else {
      if (userVoted === 'dislike') {
        setDislikes(prev => prev - 1);
      }
      setLikes(prev => prev + 1);
      setUserVoted('like');
    }
  };
  
  const handleDislike = () => {
    if (userVoted === 'dislike') {
      setDislikes(prev => prev - 1);
      setUserVoted(null);
    } else {
      if (userVoted === 'like') {
        setLikes(prev => prev - 1);
      }
      setDislikes(prev => prev + 1);
      setUserVoted('dislike');
    }
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `comment-${Date.now()}`,
        authorId: 'emp-001', // Здесь должен быть ID текущего пользователя
        content: newComment,
        createdAt: new Date().toISOString()
      };
      
      // В реальном приложении здесь был бы API-запрос
      toast({
        title: "Комментарий добавлен",
        description: "Ваш комментарий успешно добавлен",
      });
      
      setNewComment('');
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover object-center transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription className="mt-1">
              {formatCurrency(item.price)}
            </CardDescription>
          </div>
          {item.category && (
            <Badge variant="secondary">{item.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              {authorDetails?.avatar && <AvatarImage src={authorDetails.avatar} alt={authorDetails.name} />}
              <AvatarFallback>{authorDetails ? getInitials(authorDetails.name) : '??'}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{authorDetails?.name || 'Неизвестный автор'}</span>
          </div>
          
          {item.link && (
            <Button variant="outline" size="sm" onClick={() => window.open(item.link, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Ссылка
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${userVoted === 'like' ? 'text-green-600' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{likes}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${userVoted === 'dislike' ? 'text-red-600' : ''}`}
            onClick={handleDislike}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span>{dislikes}</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowComments(true)}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{item.comments?.length || 0}</span>
        </Button>
      </CardFooter>
      
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Комментарии</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {(item.comments && item.comments.length > 0) ? (
              item.comments.map(comment => {
                const commentAuthor = employees.find(emp => emp.id === comment.authorId);
                
                return (
                  <div key={comment.id} className="flex space-x-3 pb-3 border-b border-border last:border-0">
                    <Avatar className="h-8 w-8">
                      {commentAuthor?.avatar && <AvatarImage src={commentAuthor.avatar} alt={commentAuthor.name} />}
                      <AvatarFallback>{commentAuthor ? getInitials(commentAuthor.name) : '??'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-sm font-medium">{commentAuthor?.name || 'Неизвестный пользователь'}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Комментариев пока нет</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <Textarea 
              placeholder="Добавьте комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment}>Отправить</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ToolboxItem;
