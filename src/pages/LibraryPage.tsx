
import React, { useState, useEffect } from 'react';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LibraryItem from '@/components/LibraryItem';
import AddLibraryItemForm from '@/components/AddLibraryItemForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LibraryItem as LibraryItemType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { fetchLibraryItems } from '@/services/libraryService';
import { Loader2 } from 'lucide-react';

const LibraryPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState<LibraryItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadLibraryItems = async () => {
      try {
        setIsLoading(true);
        const items = await fetchLibraryItems();
        setLibraryItems(items);
      } catch (error) {
        console.error('Error loading library items:', error);
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить материалы библиотеки',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLibraryItems();
  }, [toast]);
  
  const handleLibraryItemAdded = (newItem: LibraryItemType) => {
    setLibraryItems(prev => [newItem, ...prev]);
    setIsAddDialogOpen(false);
  };
  
  const bookItems = libraryItems.filter(item => item.type === 'book');
  const instructionItems = libraryItems.filter(item => item.type === 'instruction');
  const standardItems = libraryItems.filter(item => item.type === 'standard');

  if (isLoading) {
    return (
      <TransitionWrapper className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="text-muted-foreground">Загрузка материалов...</p>
        </div>
      </TransitionWrapper>
    );
  }

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Библиотека</h1>
            <p className="text-muted-foreground mt-2">
              Книги, инструкции и стандарты
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Добавить материал
          </Button>
        </div>
        
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="books">Книги</TabsTrigger>
            <TabsTrigger value="instructions">Инструкции</TabsTrigger>
            <TabsTrigger value="standards">СП и ГОСТы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookItems.map((item) => (
                <LibraryItem key={item.id} item={item} />
              ))}
              {bookItems.length === 0 && (
                <EmptyState 
                  title="Добавьте первую книгу" 
                  description="Поделитесь полезной литературой с коллегами"
                  onAdd={() => setIsAddDialogOpen(true)}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="instructions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructionItems.map((item) => (
                <LibraryItem key={item.id} item={item} />
              ))}
              {instructionItems.length === 0 && (
                <EmptyState 
                  title="Добавьте первую инструкцию" 
                  description="Загрузите полезные инструкции и руководства"
                  onAdd={() => setIsAddDialogOpen(true)}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="standards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardItems.map((item) => (
                <LibraryItem key={item.id} item={item} />
              ))}
              {standardItems.length === 0 && (
                <EmptyState 
                  title="Добавьте первый стандарт" 
                  description="Загрузите СП, ГОСТы и другие нормативные документы"
                  onAdd={() => setIsAddDialogOpen(true)}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить материал</DialogTitle>
          </DialogHeader>
          <AddLibraryItemForm onSuccess={handleLibraryItemAdded} />
        </DialogContent>
      </Dialog>
    </TransitionWrapper>
  );
};

const EmptyState = ({ title, description, onAdd }) => (
  <div className="glass rounded-xl p-12 text-center col-span-full">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6">
      {description}
    </p>
    <Button onClick={onAdd}>
      Добавить
    </Button>
  </div>
);

export default LibraryPage;
