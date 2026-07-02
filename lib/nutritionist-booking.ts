export type ConsultationOption = {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
};

export type AttachedMixType = "custom_box" | "recommendation" | "none";

export type AttachedMixSummary = {
  title: string;
  duration?: number | string;
  dailyGrams?: number;
  totalQuantityGrams?: number;
  finalPrice?: number;
  ingredients: string[];
};

export type NutritionistBooking = {
  bookingId: string;
  consultationType: string;
  consultationDuration: string;
  consultationPrice: string;
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
  preferredDate: string;
  preferredTimeSlot: string;
  reason: string;
  notes: string;
  attachedMixType: AttachedMixType;
  attachedMixSummary: AttachedMixSummary | null;
  status: "requested";
  createdAt: string;
};
