
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import FormSection from '@/components/forms/FormSection';

interface SiteBasicInfoFieldsProps {
  control: Control<any>;
}

const SiteBasicInfoFields = ({ control }: SiteBasicInfoFieldsProps) => {
  return (
    <FormSection>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Название объекта</FormLabel>
            <FormControl>
              <Input placeholder="Название объекта" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Адрес</FormLabel>
            <FormControl>
              <Input placeholder="Адрес объекта" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
};

export default SiteBasicInfoFields;
