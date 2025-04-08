
import React from 'react';
import { Control } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import FormSection from '@/components/forms/FormSection';

interface SiteDescriptionFieldProps {
  control: Control<any>;
}

const SiteDescriptionField = ({ control }: SiteDescriptionFieldProps) => {
  return (
    <FormSection>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Описание объекта</FormLabel>
            <FormControl>
              <Textarea placeholder="Введите описание объекта" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
};

export default SiteDescriptionField;
