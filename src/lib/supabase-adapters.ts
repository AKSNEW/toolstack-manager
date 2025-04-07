
import { Crew, SubCrew } from "./types";
import { Database } from "@/integrations/supabase/types";

// Type aliases for database rows
type CrewRow = Database['public']['Tables']['crews']['Row'];
type SubCrewRow = Database['public']['Tables']['subcrews']['Row'];
type SubCrewInsert = Database['public']['Tables']['subcrews']['Insert'];

// Convert database crew row to app Crew type
export function adaptCrewFromDB(crew: CrewRow): Crew {
  return {
    id: crew.id,
    name: crew.name,
    foreman: crew.foreman,
    supervisor: crew.supervisor,
    members: crew.members,
    subCrews: crew.subcrews || [],
    site: undefined
  };
}

// Convert app Crew type to database format
export function adaptCrewToDB(crew: Omit<Crew, 'id'> | Partial<Crew>): Partial<CrewRow> {
  // Handle subCrews field name difference between app and DB
  const result: Partial<CrewRow> = {};
  
  if ('name' in crew) result.name = crew.name;
  if ('foreman' in crew) result.foreman = crew.foreman;
  if ('supervisor' in crew) result.supervisor = crew.supervisor;
  if ('members' in crew) result.members = crew.members;
  if ('subCrews' in crew) result.subcrews = crew.subCrews;
  
  return result;
}

// Convert database subcrew row to app SubCrew type
export function adaptSubCrewFromDB(subCrew: SubCrewRow): SubCrew {
  return {
    id: subCrew.id,
    name: subCrew.name,
    foreman: subCrew.foreman,
    members: subCrew.members,
    specialization: subCrew.specialization
  };
}

// Convert app SubCrew type to database format for new inserts - ensuring required fields are present
export function adaptSubCrewForInsert(subCrew: Omit<SubCrew, 'id'>): SubCrewInsert {
  return {
    name: subCrew.name,
    foreman: subCrew.foreman,
    specialization: subCrew.specialization,
    members: subCrew.members
  };
}

// Convert app SubCrew type to database format for updates
export function adaptSubCrewToDB(subCrew: Partial<SubCrew>): Partial<SubCrewRow> {
  const result: Partial<SubCrewRow> = {};
  
  if ('name' in subCrew) result.name = subCrew.name;
  if ('foreman' in subCrew) result.foreman = subCrew.foreman;
  if ('members' in subCrew) result.members = subCrew.members;
  if ('specialization' in subCrew) result.specialization = subCrew.specialization;
  
  return result;
}
