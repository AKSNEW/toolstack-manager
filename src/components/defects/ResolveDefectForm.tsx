
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { employees } from '@/lib/data/employees';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResolveDefectFormProps {
  onSubmit: (data: { resolution: string; resolvedBy: string }) => void;
  onCancel: () => void;
}

const ResolveDefectForm: React.FC<ResolveDefectFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    resolution: '',
    resolvedBy: ''
  });

  const handleResolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, resolution: e.target.value }));
  };

  const handleResolvedByChange = (value: string) => {
    setFormData(prev => ({ ...prev, resolvedBy: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="resolvedBy">Кем устранено</Label>
          <Select
            value={formData.resolvedBy}
            onValueChange={handleResolvedByChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите сотрудника" />
            </SelectTrigger>
            <SelectContent>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="resolution">Описание выполненных работ</Label>
          <Textarea
            id="resolution"
            placeholder="Опишите подробно, как была устранена неисправность и какие работы были выполнены"
            rows={4}
            value={formData.resolution}
            onChange={handleResolutionChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Отмена</Button>
        <Button onClick={handleSubmit}>Подтвердить</Button>
      </DialogFooter>
    </>
  );
};

export default ResolveDefectForm;
