
export type Chapter = {
  id: string;
  title: string;
};

export type Subject = {
  id: string;
  name: string;
  chapters: Chapter[];
};

export type Class = {
  id: string;
  name: string;
  subjects: Subject[];
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  priceDetails: string;
  generations: number;
  features: string[];
  isFeatured?: boolean;
}
