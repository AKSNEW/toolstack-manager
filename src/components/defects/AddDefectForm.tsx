
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';

interface AddDefectFormProps {
  onSubmit: (data: { title: string; description: string }) => void;
  onCancel: () => void;
}

const AddDefectForm: React.FC<AddDefectFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Наименование неисправности</Label>
          <Input
            id="title"
            placeholder="Введите короткое название неисправности"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Описание неисправности</Label>
          <Textarea
            id="description"
            placeholder="Подробно опишите обнаруженную неисправность"
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Отмена</Button>
        <Button onClick={handleSubmit}>Добавить</Button>
      </DialogFooter>
    </>
  );
};

export default AddDefectForm;
