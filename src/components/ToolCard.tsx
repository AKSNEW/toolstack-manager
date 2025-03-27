
import React from 'react';
import { Tool } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Package, Check, Clock, AlertTriangle } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onClick?: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(tool);
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
        <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5 mr-1" />
          <span>{tool.location}</span>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
