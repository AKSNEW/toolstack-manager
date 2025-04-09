
import { Site } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { adaptSiteFromDB, adaptSiteForInsert, adaptSiteToDB } from '../supabase-site-adapters';

// Initial sites data for fallback
const initialSites: Site[] = [
  {
    id: 's1',
    name: 'ЖК Солнечный берег',
    address: 'ул. Приморская, 45',
    status: 'active',
    crewId: 'c1',
    startDate: '2023-09-01',
    description: 'Жилой комплекс из 3 зданий с подземной парковкой',
  },
  {
    id: 's2',
    name: 'Офисный центр Меркурий',
    address: 'пр. Ленина, 78',
    status: 'planning',
    description: 'Бизнес-центр класса А с панорамным остеклением',
  },
];

// This is a temporary mutable array until all components are migrated to use direct DB calls
export let sites: Site[] = [...initialSites];

// Function to fetch sites from database
export async function fetchSites(): Promise<Site[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*') as any;
    
    if (error) {
      console.error('Error fetching sites:', error);
      return sites; // Return the local data as fallback
    }
    
    if (!data || data.length === 0) {
      // If no sites exist in the database yet, seed with initial data
      await seedInitialSites();
      return sites;
    }
    
    // Update the local sites array
    const fetchedSites = data.map(site => adaptSiteFromDB(site as any));
    sites = fetchedSites;
    return fetchedSites;
  } catch (error) {
    console.error('Error in fetchSites:', error);
    return sites; // Return the local data as fallback
  }
}

// Function to create a new site
export async function createSite(site: Omit<Site, 'id'>): Promise<Site | null> {
  try {
    const siteData = adaptSiteForInsert(site);
    
    const { data, error } = await supabase
      .from('sites')
      .insert(siteData as any)
      .select() as any;
    
    if (error) {
      console.error('Error creating site:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after site creation');
      return null;
    }
    
    const newSite = adaptSiteFromDB(data[0] as any);
    sites.push(newSite); // Update local array
    return newSite;
  } catch (error) {
    console.error('Error in createSite:', error);
    return null;
  }
}

// Function to update a site
export async function updateSite(id: string, siteUpdate: Partial<Site>): Promise<Site | null> {
  try {
    const updates = adaptSiteToDB(siteUpdate);
    
    const { data, error } = await supabase
      .from('sites')
      .update(updates as any)
      .eq('id', id)
      .select() as any;
    
    if (error) {
      console.error('Error updating site:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after site update');
      return null;
    }
    
    const updatedSite = adaptSiteFromDB(data[0] as any);
    
    // Update the local array
    sites = sites.map(s => s.id === id ? updatedSite : s);
    
    return updatedSite;
  } catch (error) {
    console.error('Error in updateSite:', error);
    return null;
  }
}

// Function to delete a site
export async function deleteSite(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id) as any;
    
    if (error) {
      console.error('Error deleting site:', error);
      return false;
    }
    
    // Update the local array
    sites = sites.filter(s => s.id !== id);
    
    return true;
  } catch (error) {
    console.error('Error in deleteSite:', error);
    return false;
  }
}

// Function to seed initial sites data if none exists
async function seedInitialSites() {
  try {
    for (const site of initialSites) {
      // Create each initial site in the database
      await supabase
        .from('sites')
        .insert({
          name: site.name,
          address: site.address,
          status: site.status,
          crew_id: site.crewId,
          start_date: site.startDate,
          description: site.description
        } as any);
    }
    
    // Refetch sites after seeding
    const { data } = await supabase.from('sites').select('*') as any;
    if (data) {
      sites = data.map(site => adaptSiteFromDB(site as any));
    }
    
  } catch (error) {
    console.error('Error in seedInitialSites:', error);
  }
}

// Initialize by fetching sites
fetchSites().catch(console.error);
