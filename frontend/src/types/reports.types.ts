import type { User } from "./user.type";
import type { ListingData } from "./listing.types";

export type ListingReportData = {
  _id: string;             
  listingID: string;       
  reporterID: string;      
  reason: string;          
  createdAt: string;
  updatedAt: string;
  user: User;              
  listingData: ListingData;
};