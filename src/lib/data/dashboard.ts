
import { tools } from './tools';
import { employees } from './employees';
import { crews } from './crews';
import { sites } from './sites';
import { DashboardStats } from '../types';

// Dashboard statistics
export const dashboardStats: DashboardStats = {
  totalTools: tools.length,
  availableTools: tools.filter(tool => tool.status === 'available').length,
  inUseTools: tools.filter(tool => tool.status === 'in-use').length,
  maintenanceTools: tools.filter(tool => tool.status === 'maintenance').length,
  totalEmployees: employees.length,
  activeRentals: employees.reduce((acc, emp) => acc + emp.activeRentals.length, 0),
  totalCrews: crews.length,
  totalSites: sites.length,
  activeSites: sites.filter(site => site.status === 'active').length,
};
