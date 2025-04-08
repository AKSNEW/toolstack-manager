import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertTriangle, User, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { employees } from '@/lib/data';
import { UnionMessage } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { fetchUnionMessages, createUnionMessage, updateMessageStatus, updateMessageVotes } from '@/services/unionService';

const UnionPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<UnionMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [category, setCategory] = useState<'complaint' | 'suggestion' | 'question'>('complaint');
  const [anonymous, setAnonymous] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for demo purposes
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadMessages();
  }, []);
  
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUnionMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить сообщения профсоюза",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Ошибка аутентификации",
        description: "Вы должны быть авторизованы, чтобы отправлять сообщения",
        variant: "destructive",
      });
      return;
    }
    
    if (!newMessage.trim()) {
      toast({
        title: "Ошибка",
        description: "Сообщение не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const message: Omit<UnionMessage, 'id'> = {
        content: newMessage,
        createdAt: new Date().toISOString(),
        authorId: user.id,
        anonymous,
        category,
        status: 'new',
        votes: []
      };
      
      const createdMessage = await createUnionMessage(message);
      setMessages([createdMessage, ...messages]);
      setNewMessage('');
      
      toast({
        title: "Сообщение отправлено",
        description: anonymous ? "Ваше анонимное сообщение отправлено" : "Ваше сообщение отправлено",
      });
    } catch (error) {
      console.error('Failed to submit message:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateStatus = async (id: string, status: 'new' | 'in-review' | 'resolved') => {
    try {
      await updateMessageStatus(id, status);
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));
      
      toast({
        title: "Статус обновлен",
        description: `Статус сообщения изменен на ${
          status === 'new' ? 'Новое' : 
          status === 'in-review' ? 'На рассмотрении' : 'Решено'
        }`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить статус сообщения",
        variant: "destructive",
      });
    }
  };
  
  const handleVote = async (id: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast({
        title: "Ошибка аутентификации",
        description: "Вы должны быть авторизованы, чтобы голосовать",
        variant: "destructive",
      });
      return;
    }
    
    const currentUserId = user.id;
    let updatedMessages = [...messages];
    
    const messageIndex = updatedMessages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) return;
    
    const message = { ...updatedMessages[messageIndex] };
    
    // Check if user already voted
    const existingVoteIndex = message.votes.findIndex(vote => vote.employeeId === currentUserId);
    
    let updatedVotes = [...message.votes];
    
    if (existingVoteIndex >= 0) {
      // User already voted
      const existingVote = message.votes[existingVoteIndex];
      
      if (existingVote.type === voteType) {
        // User is trying to vote the same way, remove their vote
        updatedVotes.splice(existingVoteIndex, 1);
      } else {
        // User is changing their vote
        updatedVotes[existingVoteIndex] = { employeeId: currentUserId, type: voteType };
      }
    } else {
      // User hasn't voted, add new vote
      updatedVotes.push({ employeeId: currentUserId, type: voteType });
    }
    
    try {
      await updateMessageVotes(id, updatedVotes);
      
      // Update the message in the state with new votes
      message.votes = updatedVotes;
      updatedMessages[messageIndex] = message;
      setMessages(updatedMessages);
      
      toast({
        title: voteType === 'up' ? "Голос отдан" : "Голос против принят",
        description: "Ваш голос учтен",
      });
    } catch (error) {
      console.error('Failed to update votes:', error);
      toast({
        title: "Ошибка голосования",
        description: "Не удалось обновить голоса",
        variant: "destructive",
      });
    }
  };
  
  const filteredMessages = messages.filter(message => {
    if (activeTab === 'all') return true;
    if (activeTab === 'complaints') return message.category === 'complaint';
    if (activeTab === 'suggestions') return message.category === 'suggestion';
    if (activeTab === 'questions') return message.category === 'question';
    if (activeTab === 'resolved') return message.status === 'resolved';
    return true;
  });
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'complaint':
        return <Badge variant="destructive">Жалоба</Badge>;
      case 'suggestion':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Предложение</Badge>;
      case 'question':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Вопрос</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Новое</Badge>;
      case 'in-review':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">На рассмотрении</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Решено</Badge>;
      default:
        return null;
    }
  };
  
  const getAuthorName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Пользователь';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getVotesCount = (votes: { employeeId: string; type: 'up' | 'down' }[]) => {
    const upVotes = votes.filter(vote => vote.type === 'up').length;
    const downVotes = votes.filter(vote => vote.type === 'down').length;
    return { upVotes, downVotes };
  };
  
  const hasUserVoted = (votes: { employeeId: string; type: 'up' | 'down' }[], voteType: 'up' | 'down') => {
    const currentUserId = 'e1'; // Current user ID
    return votes.some(vote => vote.employeeId === currentUserId && vote.type === voteType);
  };
  
  if (isLoading) {
    return (
      <TransitionWrapper>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Загрузка сообщений...</span>
          </div>
        </div>
      </TransitionWrapper>
    );
  }
  
  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Профсоюз</h1>
            <p className="text-muted-foreground mt-2">
              Анонимное общение с руководством и коллегами
            </p>
          </div>
          
          {/* Admin toggle for demo */}
          <Button 
            variant="outline"
            onClick={() => setIsAdmin(!isAdmin)}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            {isAdmin ? "Режим сотрудника" : "Режим администратора"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message form */}
          <div className="md:col-span-1">
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Отправить сообщение</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Ваше сообщение</Label>
                  <Textarea
                    id="message"
                    placeholder="Напишите ваше сообщение..."
                    rows={5}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory('complaint')}
                      className={`py-2 px-3 text-sm rounded-md ${
                        category === 'complaint' ? 'bg-red-100 text-red-800' : 'bg-muted'
                      }`}
                      disabled={isSubmitting}
                    >
                      Жалоба
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('suggestion')}
                      className={`py-2 px-3 text-sm rounded-md ${
                        category === 'suggestion' ? 'bg-blue-100 text-blue-800' : 'bg-muted'
                      }`}
                      disabled={isSubmitting}
                    >
                      Предложение
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('question')}
                      className={`py-2 px-3 text-sm rounded-md ${
                        category === 'question' ? 'bg-amber-100 text-amber-800' : 'bg-muted'
                      }`}
                      disabled={isSubmitting}
                    >
                      Вопрос
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="anonymous">Отправить анонимно</Label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    'Отправить сообщение'
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Messages list */}
          <div className="md:col-span-2">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="complaints">Жалобы</TabsTrigger>
                <TabsTrigger value="suggestions">Предложения</TabsTrigger>
                <TabsTrigger value="questions">Вопросы</TabsTrigger>
                <TabsTrigger value="resolved">Решенные</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
              {messages.length > 0 && filteredMessages.length > 0 ? (
                filteredMessages.map((message) => {
                  const { upVotes, downVotes } = getVotesCount(message.votes);
                  return (
                    <div key={message.id} className="glass p-4 rounded-lg">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.createdAt)}
                          </span>
                          {getCategoryBadge(message.category)}
                          {getStatusBadge(message.status)}
                        </div>
                        
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground">
                              Автор: {message.anonymous ? `${getAuthorName(message.authorId)} (анонимно)` : getAuthorName(message.authorId)}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={message.status === 'new'}
                                onClick={() => updateStatus(message.id, 'new')}
                                className="h-7 text-xs px-2"
                              >
                                Новое
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={message.status === 'in-review'}
                                onClick={() => updateStatus(message.id, 'in-review')}
                                className="h-7 text-xs px-2"
                              >
                                В работе
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={message.status === 'resolved'}
                                onClick={() => updateStatus(message.id, 'resolved')}
                                className="h-7 text-xs px-2"
                              >
                                Решено
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm mb-3">{message.content}</p>
                      
                      <div className="flex justify-between items-center">
                        {!message.anonymous && (
                          <div className="text-xs text-muted-foreground">
                            Автор: {getAuthorName(message.authorId)}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 ml-auto">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`px-2 py-1 ${hasUserVoted(message.votes, 'up') ? 'text-green-600' : ''}`}
                              onClick={() => handleVote(message.id, 'up')}
                              disabled={message.status === 'resolved'}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{upVotes}</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`px-2 py-1 ${hasUserVoted(message.votes, 'down') ? 'text-red-600' : ''}`}
                              onClick={() => handleVote(message.id, 'down')}
                              disabled={message.status === 'resolved'}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              <span>{downVotes}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass rounded-xl p-8 text-center">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">Сообщения не найдены</h3>
                  <p className="text-muted-foreground">
                    В этой категории пока нет сообщений
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default UnionPage;
