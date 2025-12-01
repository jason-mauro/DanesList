import type { User } from "./user.type";
import type { ListingData } from "./listing.types"; // assuming you have ListingData type

export type ListingReportData = {
  _id: string;             // report ID
  listingID: string;       // reference to the listing
  reporterID: string;      // reference to the reporting user
  reason: string;          // report reason
  createdAt: string;
  updatedAt: string;
  user: User;              // the reporting user
  listingData: ListingData; // full listing details
};