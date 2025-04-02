
import React, { useState } from 'react';
import TransitionWrapper from '@/components/TransitionWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ToolboxItem from '@/components/ToolboxItem';
import AddToolboxItemForm from '@/components/AddToolboxItemForm';
import { toolboxItems } from '@/lib/data/toolbox';

const ToolboxPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ящик с инструментами</h1>
            <p className="text-muted-foreground mt-2">
              Рекомендации по инструментам и оборудованию
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Добавить инструмент
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolboxItems.map((item) => (
            <ToolboxItem key={item.id} item={item} />
          ))}
        </div>

        {toolboxItems.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Добавьте свой первый инструмент</h3>
            <p className="text-muted-foreground mb-6">
              Поделитесь своими находками и рекомендациями с коллегами
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Добавить инструмент
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить инструмент</DialogTitle>
          </DialogHeader>
          <AddToolboxItemForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </TransitionWrapper>
  );
};

export default ToolboxPage;
