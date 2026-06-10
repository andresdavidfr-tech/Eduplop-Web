export interface Lead {
  id: string;
  name: string;
  role: string;
  email: string;
  school: string;
  phone?: string;
  message?: string;
  coupon?: string;
  createdAt: string;
}

export type ToneType = "Empático y Cercano" | "Formal e Institucional" | "Directo y Claro";

export interface AIResponse {
  optimizedMessageText?: string;
  optimizedMessage?: string;
  isSimulation?: boolean;
  error?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  badge?: string;
  benefit: string;
}
