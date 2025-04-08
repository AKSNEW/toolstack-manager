
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSite } from '@/lib/data/sites';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

// Import our form components
import SiteBasicInfoFields from '@/components/forms/site/SiteBasicInfoFields';
import SiteStatusFields from '@/components/forms/site/SiteStatusFields';
import SiteDateFields from '@/components/forms/site/SiteDateFields';
import SiteDescriptionField from '@/components/forms/site/SiteDescriptionField';
import FormActions from '@/components/forms/FormActions';
import { siteFormSchema, SiteFormData, defaultSiteFormValues } from '@/components/forms/site/SiteFormSchema';

interface AddSiteFormProps {
  onSuccess: () => void;
}

const AddSiteForm = ({ onSuccess }: AddSiteFormProps) => {
  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: defaultSiteFormValues,
  });

  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (data: SiteFormData) => {
    try {
      // Create a new site in the database
      const newSite = await createSite({
        name: data.name,
        address: data.address,
        status: data.status,
        crewId: data.crewId || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        description: data.description,
      });
      
      if (newSite) {
        toast.success('Объект успешно создан');
        onSuccess();
      } else {
        toast.error('Ошибка при создании объекта');
      }
    } catch (error) {
      toast.error('Ошибка при создании объекта');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <SiteBasicInfoFields control={control} />
        <SiteStatusFields control={control} />
        <SiteDateFields control={control} />
        <SiteDescriptionField control={control} />
        <FormActions 
          onCancel={onSuccess} 
          isSubmitting={isSubmitting} 
          submitLabel="Создать объект"
        />
      </form>
    </Form>
  );
};

export default AddSiteForm;
