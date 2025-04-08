
import { z } from 'zod';

// Create a schema for form validation
export const siteFormSchema = z.object({
  name: z.string().min(3, { message: 'Название должно содержать минимум 3 символа' }),
  address: z.string().min(5, { message: 'Адрес должен содержать минимум 5 символов' }),
  status: z.enum(['planning', 'active', 'completed']),
  crewId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().min(10, { message: 'Описание должно содержать минимум 10 символов' }),
});

export type SiteFormData = z.infer<typeof siteFormSchema>;

export const defaultSiteFormValues: SiteFormData = {
  name: '',
  address: '',
  status: 'planning',
  crewId: '',
  startDate: '',
  endDate: '',
  description: '',
};
