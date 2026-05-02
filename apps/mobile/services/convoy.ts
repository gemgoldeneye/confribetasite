import AsyncStorage from "@react-native-async-storage/async-storage";
import type { VehicleType, UserProfile } from "@/lib/onboarding";

export interface ConvoyMember {
  id: string;
  name: string;
  vehicle: VehicleType;
  isLeader: boolean;
}

export interface Convoy {
  id: string;
  name: string;
  code: string;
  members: ConvoyMember[];
  status: "waiting" | "active";
  createdAt: number;
}

export const VEHICLE_EMOJI: Record<VehicleType, string> = {
  motor: "🏍️",
  car: "🚗",
  supercar: "🏎️",
  truck: "🚛",
  bus: "🚌",
};

const ACTIVE_KEY = "active_convoy";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const STUB_MEMBERS: Pick<ConvoyMember, "name" | "vehicle">[] = [
  { name: "Alex", vehicle: "car" },
  { name: "Sam", vehicle: "motor" },
  { name: "Jordan", vehicle: "truck" },
  { name: "Casey", vehicle: "supercar" },
];

// ── Public API ────────────────────────────────────────────────────────────────

export async function getActiveConvoy(): Promise<Convoy | null> {
  const raw = await AsyncStorage.getItem(ACTIVE_KEY);
  return raw ? (JSON.parse(raw) as Convoy) : null;
}

export async function createConvoy(
  name: string,
  profile: UserProfile,
): Promise<Convoy> {
  await new Promise((r) => setTimeout(r, 600));
  const convoy: Convoy = {
    id: generateCode(),
    name,
    code: generateCode(),
    status: "waiting",
    createdAt: Date.now(),
    members: [
      {
        id: "me",
        name: profile.name,
        vehicle: profile.vehicle,
        isLeader: true,
      },
    ],
  };
  await AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(convoy));
  return convoy;
}

export async function joinConvoy(
  code: string,
  profile: UserProfile,
): Promise<Convoy> {
  await new Promise((r) => setTimeout(r, 1000));
  // Stub: pick 1–2 fake members to simulate an existing convoy
  const stubCount = 1 + Math.floor(Math.random() * 2);
  const shuffled = [...STUB_MEMBERS].sort(() => Math.random() - 0.5);
  const fakeMembers: ConvoyMember[] = shuffled
    .slice(0, stubCount)
    .map((m, i) => ({ ...m, id: `stub-${i}`, isLeader: i === 0 }));

  const convoy: Convoy = {
    id: generateCode(),
    name: "Road trip",
    code: code.toUpperCase(),
    status: "waiting",
    createdAt: Date.now(),
    members: [
      ...fakeMembers,
      { id: "me", name: profile.name, vehicle: profile.vehicle, isLeader: false },
    ],
  };
  await AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(convoy));
  return convoy;
}

export async function leaveConvoy(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_KEY);
}
