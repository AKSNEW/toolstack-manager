
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, PaperclipIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'accountant';
  content: string;
  timestamp: Date;
  attachments?: {
    id: string;
    name: string;
    url?: string;
    file?: File;
  }[];
}

const AccountantChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'accountant',
      content: 'Здравствуйте! Я бухгалтер проекта. Чем могу помочь?',
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ]);
  const [attachments, setAttachments] = useState<{id: string, name: string, file: File}[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newAttachments = newFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file: file
      }));
      
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments.map(att => ({
        id: att.id,
        name: att.name,
        url: URL.createObjectURL(att.file)
      }))
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setAttachments([]);
    
    // Simulate accountant response
    setTimeout(() => {
      const accountantResponse: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'accountant',
        content: 'Спасибо за ваше сообщение! Я рассмотрю его и отвечу в ближайшее время.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, accountantResponse]);
      toast.success('Получен ответ от бухгалтера');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <AvatarFallback>МВ</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">Марина Волкова</h3>
            <p className="text-xs text-muted-foreground">Главный бухгалтер • В сети</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
              <p>{msg.content}</p>
              
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center space-x-2 text-sm bg-background/30 rounded p-1">
                      <PaperclipIcon className="h-4 w-4" />
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        className="underline truncate" 
                        rel="noreferrer"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-1 text-xs opacity-70 text-right">
                {new Intl.DateTimeFormat('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t space-x-2 flex flex-wrap gap-2">
          {attachments.map(attachment => (
            <div key={attachment.id} className="flex items-center space-x-1 bg-muted rounded-full px-3 py-1 text-sm">
              <span className="truncate max-w-[150px]">{attachment.name}</span>
              <button 
                onClick={() => removeAttachment(attachment.id)} 
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="p-4 border-t flex space-x-2 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Напишите сообщение бухгалтеру..."
          className="flex-1 min-h-[60px] max-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <Button 
          size="icon" 
          variant="outline" 
          onClick={handleAttachFile}
          title="Прикрепить файл"
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!message.trim() && attachments.length === 0}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AccountantChat;
