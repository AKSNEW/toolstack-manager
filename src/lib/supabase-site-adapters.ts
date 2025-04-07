
import { Site } from "./types";
import { Database } from "@/integrations/supabase/types";

// Type aliases for database rows
type SiteRow = Database['public']['Tables']['sites']['Row'];
type SiteInsert = Database['public']['Tables']['sites']['Insert'];

// Convert database site row to app Site type
export function adaptSiteFromDB(site: SiteRow): Site {
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    status: site.status as 'planning' | 'active' | 'completed',
    crewId: site.crew_id,
    startDate: site.start_date,
    endDate: site.end_date,
    description: site.description
  };
}

// Convert app Site type to database format for new inserts
export function adaptSiteForInsert(site: Omit<Site, 'id'>): SiteInsert {
  return {
    name: site.name,
    address: site.address,
    status: site.status,
    crew_id: site.crewId,
    start_date: site.startDate,
    end_date: site.endDate,
    description: site.description
  };
}

// Convert app Site type to database format for updates
export function adaptSiteToDB(site: Partial<Site>): Partial<SiteRow> {
  const result: Partial<SiteRow> = {};
  
  if ('name' in site) result.name = site.name;
  if ('address' in site) result.address = site.address;
  if ('status' in site) result.status = site.status;
  if ('crewId' in site) result.crew_id = site.crewId;
  if ('startDate' in site) result.start_date = site.startDate;
  if ('endDate' in site) result.end_date = site.endDate;
  if ('description' in site) result.description = site.description;
  
  return result;
}
