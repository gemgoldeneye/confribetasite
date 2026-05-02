import AsyncStorage from "@react-native-async-storage/async-storage";

const COMPLETE_KEY = "onboarding_complete";
const PROFILE_KEY = "user_profile";

export type VehicleType = "motor" | "car" | "supercar" | "truck" | "bus";

export interface UserProfile {
  name: string;
  phone: string;
  vehicle: VehicleType;
}

export async function isOnboardingComplete(): Promise<boolean> {
  const val = await AsyncStorage.getItem(COMPLETE_KEY);
  return val === "true";
}

export async function markOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(COMPLETE_KEY, "true");
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getProfile(): Promise<UserProfile | null> {
  const val = await AsyncStorage.getItem(PROFILE_KEY);
  return val ? (JSON.parse(val) as UserProfile) : null;
}
