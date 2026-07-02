import { AttachedMixSummary, AttachedMixType } from "@/lib/nutritionist-booking";

export type ReportFileMetadata = {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
};

export type ManualReportValues = {
  hba1c: string;
  fastingSugar: string;
  ldl: string;
  hdl: string;
  vitaminD: string;
  vitaminB12: string;
  hemoglobin: string;
  ferritin: string;
  tsh: string;
};

export type ReportRequest = {
  requestId: string;
  reportType: string;
  fileMetadata: ReportFileMetadata;
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  wellnessGoal: string;
  notes: string;
  manualValues: ManualReportValues;
  attachedMixType: AttachedMixType;
  attachedMixSummary: AttachedMixSummary | null;
  status: "submitted";
  createdAt: string;
  disclaimerAccepted: true;
};
