
import React, { useState, useEffect } from 'react';
import { fetchSites } from '@/lib/data/sites';
import { Site } from '@/lib/data';
import TransitionWrapper from '@/components/TransitionWrapper';
import { toast } from 'sonner';

// Import our new components
import SiteHeader from '@/components/sites/SiteHeader';
import SiteSearch from '@/components/sites/SiteSearch';
import SitesGrid from '@/components/sites/SitesGrid';
import SiteDialogs from '@/components/sites/SiteDialogs';

const SitesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isDefectJournalOpen, setIsDefectJournalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localSites, setLocalSites] = useState<Site[]>([]);

  useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSites();
        setLocalSites(data);
      } catch (error) {
        console.error("Error loading sites:", error);
        toast.error("Ошибка при загрузке объектов");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSites();
  }, []);

  // Refresh sites when a new one is added
  const handleAddSuccess = async () => {
    setIsAddDialogOpen(false);
    try {
      const data = await fetchSites();
      setLocalSites(data);
    } catch (error) {
      console.error("Error refreshing sites:", error);
    }
  };

  // Filter sites based on search and status
  const filteredSites = localSites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        site.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        site.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? site.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleSiteClick = (site: Site) => {
    setSelectedSite(site);
  };

  const openDefectJournal = (site: Site) => {
    setSelectedSite(site);
    setIsDefectJournalOpen(true);
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setSearchTerm('');
  };

  return (
    <TransitionWrapper className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SiteHeader onAddSite={() => setIsAddDialogOpen(true)} />
        
        <SiteSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          clearFilters={clearFilters}
        />
        
        <SitesGrid 
          isLoading={isLoading}
          sites={filteredSites}
          onSiteClick={handleSiteClick}
          onOpenDefectsJournal={openDefectJournal}
          clearFilters={clearFilters}
        />
        
        <SiteDialogs 
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isDefectJournalOpen={isDefectJournalOpen}
          setIsDefectJournalOpen={setIsDefectJournalOpen}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          onAddSuccess={handleAddSuccess}
        />
      </div>
    </TransitionWrapper>
  );
};

export default SitesPage;
