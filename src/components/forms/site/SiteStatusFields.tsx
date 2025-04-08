
import React from 'react';
import { Control } from 'react-hook-form';
import { crews } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import FormSection from '@/components/forms/FormSection';

interface SiteStatusFieldsProps {
  control: Control<any>;
}

const SiteStatusFields = ({ control }: SiteStatusFieldsProps) => {
  return (
    <FormSection>
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Статус объекта</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус объекта" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="planning">Планирование</SelectItem>
                <SelectItem value="active">Активный</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="crewId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Назначенная бригада</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите бригаду (необязательно)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {crews.map(crew => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
};

export default SiteStatusFields;
