
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const FormActions = ({ 
  onCancel, 
  isSubmitting, 
  submitLabel = 'Сохранить',
  cancelLabel = 'Отмена' 
}: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Сохранение...' : submitLabel}
      </Button>
    </div>
  );
};

export default FormActions;
