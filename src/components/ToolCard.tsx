
import React from 'react';
import { Tool } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Package, Check, Clock, AlertTriangle, ThumbsUp, ThumbsDown, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ToolCardProps {
  tool: Tool;
  onClick?: (tool: Tool) => void;
  onVote?: (toolId: string, value: 1 | -1) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, onVote }) => {
  const handleClick = () => {
    if (onClick) onClick(tool);
  };

  const handleVote = (e: React.MouseEvent, value: 1 | -1) => {
    e.stopPropagation();
    if (onVote) onVote(tool.id, value);
  };

  const getStatusIcon = () => {
    switch (tool.status) {
      case 'available':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'in-use':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (tool.status) {
      case 'available':
        return 'Доступен';
      case 'in-use':
        return 'Используется';
      case 'maintenance':
        return 'В ремонте';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = () => {
    switch (tool.status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-amber-100 text-amber-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate votes
  const getVoteCounts = () => {
    if (!tool.votes) return { likes: 0, dislikes: 0 };
    
    const likes = tool.votes.filter(v => v.value === 1).length;
    const dislikes = tool.votes.filter(v => v.value === -1).length;
    
    return { likes, dislikes };
  };

  const { likes, dislikes } = getVoteCounts();

  return (
    <div 
      className="card-hover glass rounded-xl overflow-hidden flex flex-col h-full"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <img 
          src={tool.image} 
          alt={tool.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
            getStatusColor()
          )}>
            {getStatusIcon()}
            {getStatusText()}
          </span>
        </div>
        {tool.isEdc && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
              EDC
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold leading-tight">{tool.name}</h3>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
            {tool.category}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {tool.description}
        </p>
        
        {tool.links && tool.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tool.links.slice(0, 3).map((_, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                <Link className="h-3 w-3" />
                <span>Ссылка {index + 1}</span>
              </Badge>
            ))}
            {tool.links.length > 3 && (
              <Badge variant="outline">+{tool.links.length - 3}</Badge>
            )}
          </div>
        )}
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5 mr-1" />
            <span>{tool.location}</span>
          </div>
          
          {onVote && (
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => handleVote(e, 1)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-600 transition-colors"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{likes}</span>
              </button>
              <button 
                onClick={(e) => handleVote(e, -1)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                <span>{dislikes}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
