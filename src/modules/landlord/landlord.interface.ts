import { PropertyStatus } from "../../../generated/prisma/enums";

export interface IUpdateProperty {
  categoryId?: string;
  title?: string;
  description?: string;
  rentAmount?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floor?: number;
  availableFrom?: Date;
  address?: string;
  city?: string;
  state?: string | null;
  country?: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  amenities?: string[];
  images?: string[];
  status?: PropertyStatus;
}

export interface IUpdateStatus {
  propertyId: string;
  status: PropertyStatus;
}
