export interface IReview {
  rating: number;
  comment: string;
  rentalRequestId: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
}
