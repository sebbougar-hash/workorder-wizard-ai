import { useSyncExternalStore } from "react";
import {
  analyzeMaintenanceRequest,
  type Analysis,
  type Category,
  type Priority,
  type Status,
} from "./analysis";

export interface Technician {
  id: string;
  name: string;
  specialty: Category;
  phone: string;
}

export const TECHNICIANS: Technician[] = [
  { id: "t1", name: "Mike HVAC", specialty: "HVAC", phone: "(555) 014-2201" },
  { id: "t2", name: "Sarah Plumbing", specialty: "Plumbing", phone: "(555) 014-2202" },
  { id: "t3", name: "David Electrical", specialty: "Electrical", phone: "(555) 014-2203" },
  { id: "t4", name: "John Appliance Repair", specialty: "Appliance", phone: "(555) 014-2204" },
  { id: "t5", name: "ABC General Maintenance", specialty: "Structural", phone: "(555) 014-2205" },
  { id: "t6", name: "Pro Pest Control", specialty: "Pest", phone: "(555) 014-2206" },
];

export function techniciansForCategory(category: Category) {
  const matches = TECHNICIANS.filter((t) => t.specialty === category);
  return matches.length ? matches : TECHNICIANS.filter((t) => t.specialty === "Structural");
}

export interface MaintenanceRequest {
  id: string;
  property: string;
  unit: string;
  tenant: string;
  description: string;
  category: Category;
  priority: Priority;
  riskLevel: Priority;
  status: Status;
  createdAt: string;
  assignedTechnician?: string;
  imageName?: string;
  imageDataUrl?: string;
  analysis: Analysis;
  tenantMessage?: string;
}

interface SeedInput {
  id: string;
  property: string;
  unit: string;
  tenant: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  createdAt: string;
  assignedTechnician?: string;
}

const SEEDS: SeedInput[] = [
  { id: "REQ-1041", property: "Sunset Apartments", unit: "12B", tenant: "John Carter", description: "The refrigerator is not cooling properly and food is getting warm. No smoke or burning smell.", category: "Appliance", priority: "Medium", status: "New", createdAt: "2026-08-15T07:20:00Z" },
  { id: "REQ-1040", property: "Downtown Lofts", unit: "5A", tenant: "Amelia Ross", description: "There is an active fire inside the electrical panel in the hallway closet.", category: "Electrical", priority: "Critical", status: "In Progress", createdAt: "2026-08-15T05:05:00Z", assignedTechnician: "David Electrical" },
  { id: "REQ-1039", property: "Park View Residences", unit: "3C", tenant: "Miguel Santos", description: "The washing machine is leaking water near an electrical outlet in the laundry area.", category: "Appliance", priority: "High", status: "Assigned", createdAt: "2026-08-14T16:40:00Z", assignedTechnician: "John Appliance Repair" },
  { id: "REQ-1038", property: "Riverside Homes", unit: "House 8", tenant: "Grace Kim", description: "The AC is running but the apartment is not getting cold at all.", category: "HVAC", priority: "Medium", status: "Under Review", createdAt: "2026-08-14T13:15:00Z" },
  { id: "REQ-1037", property: "Sunset Apartments", unit: "9D", tenant: "Peter Novak", description: "There is a burning smell coming from an electrical outlet in the bedroom.", category: "Electrical", priority: "High", status: "In Progress", createdAt: "2026-08-14T10:02:00Z", assignedTechnician: "David Electrical" },
  { id: "REQ-1036", property: "Downtown Lofts", unit: "2F", tenant: "Nadia Haddad", description: "The kitchen sink has a normal water leak under the cabinet.", category: "Plumbing", priority: "Medium", status: "Assigned", createdAt: "2026-08-13T18:45:00Z", assignedTechnician: "Sarah Plumbing" },
  { id: "REQ-1035", property: "Park View Residences", unit: "11A", tenant: "Owen Brady", description: "Several outlets stopped working and the breaker keeps tripping every evening.", category: "Electrical", priority: "High", status: "Under Review", createdAt: "2026-08-13T09:30:00Z" },
  { id: "REQ-1034", property: "Riverside Homes", unit: "House 3", tenant: "Lucia Ferrer", description: "Cockroach sightings in the kitchen cabinets over the past week.", category: "Pest", priority: "Medium", status: "Assigned", createdAt: "2026-08-12T15:10:00Z", assignedTechnician: "Pro Pest Control" },
  { id: "REQ-1033", property: "Sunset Apartments", unit: "4C", tenant: "Ethan Wallace", description: "The bedroom window will not lock and the frame is loose.", category: "Structural", priority: "Low", status: "Resolved", createdAt: "2026-08-12T11:25:00Z", assignedTechnician: "ABC General Maintenance" },
  { id: "REQ-1032", property: "Downtown Lofts", unit: "7B", tenant: "Priya Nair", description: "The dishwasher is not draining and water stays at the bottom.", category: "Appliance", priority: "Medium", status: "In Progress", createdAt: "2026-08-11T14:00:00Z", assignedTechnician: "John Appliance Repair" },
  { id: "REQ-1031", property: "Park View Residences", unit: "6E", tenant: "Tom Sheridan", description: "The heater is not heating the living room even at maximum thermostat setting.", category: "HVAC", priority: "Medium", status: "Resolved", createdAt: "2026-08-11T08:50:00Z", assignedTechnician: "Mike HVAC" },
  { id: "REQ-1030", property: "Riverside Homes", unit: "House 12", tenant: "Sofia Marques", description: "Major flooding in the basement after a pipe burst near the water heater.", category: "Plumbing", priority: "High", status: "In Progress", createdAt: "2026-08-10T19:35:00Z", assignedTechnician: "Sarah Plumbing" },
  { id: "REQ-1029", property: "Sunset Apartments", unit: "1A", tenant: "Daniel Okoro", description: "Minor paint peeling and cosmetic scuff marks in the hallway wall.", category: "Structural", priority: "Low", status: "Resolved", createdAt: "2026-08-10T12:05:00Z", assignedTechnician: "ABC General Maintenance" },
  { id: "REQ-1028", property: "Downtown Lofts", unit: "8C", tenant: "Hannah Lee", description: "The toilet keeps running continuously after flushing.", category: "Plumbing", priority: "Medium", status: "Resolved", createdAt: "2026-08-09T16:20:00Z", assignedTechnician: "Sarah Plumbing" },
  { id: "REQ-1027", property: "Park View Residences", unit: "10D", tenant: "Victor Almeida", description: "Ceiling stain in the bathroom is spreading and may indicate moisture above.", category: "Structural", priority: "Medium", status: "Under Review", createdAt: "2026-08-09T09:15:00Z" },
  { id: "REQ-1026", property: "Riverside Homes", unit: "House 5", tenant: "Emma Fischer", description: "The oven is not heating and the display stays off when turned on.", category: "Appliance", priority: "Medium", status: "Assigned", createdAt: "2026-08-08T13:40:00Z", assignedTechnician: "John Appliance Repair" },
  { id: "REQ-1025", property: "Sunset Apartments", unit: "15F", tenant: "Rachel Stone", description: "Rodent droppings found in the storage closet and a mouse was seen at night.", category: "Pest", priority: "Medium", status: "New", createdAt: "2026-08-08T07:55:00Z" },
];

function seedToRequest(seed: SeedInput): MaintenanceRequest {
  const analysis = analyzeMaintenanceRequest({
    description: seed.description,
    selectedCategory: seed.category,
    selectedPriority: seed.priority,
  });
  return {
    ...seed,
    category: analysis.category,
    priority: analysis.priority,
    riskLevel: analysis.riskLevel,
    analysis,
  };
}

let requests: MaintenanceRequest[] = SEEDS.map(seedToRequest);

export interface AppSettings {
  companyName: string;
  contactEmail: string;
  defaultPriority: Priority;
  emergencyEscalation: boolean;
  autoCategorization: boolean;
  aiTenantResponses: boolean;
}

let settings: AppSettings = {
  companyName: "Northgate Property Group",
  contactEmail: "maintenance@northgateproperties.com",
  defaultPriority: "Medium",
  emergencyEscalation: true,
  autoCategorization: true,
  aiTenantResponses: true,
};

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

let nextId = 1042;

export function addRequest(input: {
  property: string;
  unit: string;
  tenant: string;
  description: string;
  category: Category;
  priority: Priority;
  imageName?: string;
  imageDataUrl?: string;
  analysis: Analysis;
  tenantMessage?: string;
}): MaintenanceRequest {
  const created: MaintenanceRequest = {
    id: `REQ-${nextId++}`,
    property: input.property,
    unit: input.unit,
    tenant: input.tenant,
    description: input.description,
    category: input.analysis.category,
    priority: input.analysis.priority,
    riskLevel: input.analysis.riskLevel,
    status: "New",
    createdAt: new Date().toISOString(),
    imageName: input.imageName,
    imageDataUrl: input.imageDataUrl,
    analysis: input.analysis,
    tenantMessage: input.tenantMessage,
  };
  requests = [created, ...requests];
  emit();
  return created;
}

export function updateRequest(id: string, patch: Partial<MaintenanceRequest>) {
  requests = requests.map((r) => (r.id === id ? { ...r, ...patch } : r));
  emit();
}

export function updateSettings(patch: Partial<AppSettings>) {
  settings = { ...settings, ...patch };
  emit();
}

export function useRequests() {
  return useSyncExternalStore(
    subscribe,
    () => requests,
    () => requests,
  );
}

export function useRequest(id: string) {
  const all = useRequests();
  return all.find((r) => r.id === id);
}

export function useSettings() {
  return useSyncExternalStore(
    subscribe,
    () => settings,
    () => settings,
  );
}
