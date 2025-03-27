
import React from 'react';
import TransitionWrapper from '@/components/TransitionWrapper';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Панель управления</h1>
          <p className="text-muted-foreground mt-2">
            Общая информация об инструментах и оборудовании
          </p>
        </div>
        
        <Dashboard />
      </div>
    </TransitionWrapper>
  );
};

export default Index;
