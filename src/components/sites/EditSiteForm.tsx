
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSite, deleteSite } from '@/lib/data/sites';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Site } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

// Import our form components
import SiteBasicInfoFields from '@/components/forms/site/SiteBasicInfoFields';
import SiteStatusFields from '@/components/forms/site/SiteStatusFields';
import SiteDateFields from '@/components/forms/site/SiteDateFields';
import SiteDescriptionField from '@/components/forms/site/SiteDescriptionField';
import FormActions from '@/components/forms/FormActions';
import { siteFormSchema, SiteFormData } from '@/components/forms/site/SiteFormSchema';

interface EditSiteFormProps {
  site: Site;
  onSuccess: () => void;
  onDelete?: () => void;
}

const EditSiteForm = ({ site, onSuccess, onDelete }: EditSiteFormProps) => {
  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: site.name,
      address: site.address,
      status: site.status as 'planning' | 'active' | 'completed',
      crewId: site.crewId || '',
      startDate: site.startDate || '',
      endDate: site.endDate || '',
      description: site.description,
    },
  });

  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (data: SiteFormData) => {
    try {
      // Update the site in the database
      const updatedSite = await updateSite(site.id, {
        name: data.name,
        address: data.address,
        status: data.status,
        crewId: data.crewId || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        description: data.description,
      });
      
      if (updatedSite) {
        toast.success('Объект успешно обновлен');
        onSuccess();
      } else {
        toast.error('Ошибка при обновлении объекта');
      }
    } catch (error) {
      toast.error('Ошибка при обновлении объекта');
      console.error(error);
    }
  };

  const handleDetachCrew = async () => {
    try {
      const updatedSite = await updateSite(site.id, {
        crewId: null
      });
      
      if (updatedSite) {
        toast.success('Бригада успешно откреплена от объекта');
        onSuccess();
      } else {
        toast.error('Ошибка при откреплении бригады');
      }
    } catch (error) {
      toast.error('Ошибка при откреплении бригады');
      console.error(error);
    }
  };

  const handleDeleteSite = async () => {
    try {
      const success = await deleteSite(site.id);
      
      if (success) {
        toast.success('Объект успешно удален');
        if (onDelete) onDelete();
      } else {
        toast.error('Ошибка при удалении объекта');
      }
    } catch (error) {
      toast.error('Ошибка при удалении объекта');
      console.error(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SiteBasicInfoFields control={control} />
          <SiteStatusFields control={control} />
          <SiteDateFields control={control} />
          <SiteDescriptionField control={control} />
          
          {site.crewId && (
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDetachCrew}
              >
                Открепить бригаду
              </Button>
            </div>
          )}
          
          <FormActions 
            onCancel={onSuccess} 
            isSubmitting={isSubmitting} 
            submitLabel="Сохранить изменения"
          />
        </form>
      </Form>
      
      <div className="mt-8 pt-6 border-t border-border">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить объект
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Объект будет удален навсегда, включая все связанные с ним данные.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSite} className="bg-destructive text-destructive-foreground">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default EditSiteForm;
