
import { Crew, SubCrew } from "./types";
import { Database } from "@/integrations/supabase/types";

// Type aliases for database rows
type CrewRow = Database['public']['Tables']['crews']['Row'];
type SubCrewRow = Database['public']['Tables']['subcrews']['Row'];

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
  const { subCrews, ...rest } = crew;
  return {
    ...rest,
    subcrews: subCrews
  };
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

// Convert app SubCrew type to database format
export function adaptSubCrewToDB(subCrew: Omit<SubCrew, 'id'> | Partial<SubCrew>): Partial<SubCrewRow> {
  return subCrew;
}
