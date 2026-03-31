import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  type: "sale" | "rent";
  category: "house" | "apartment" | "villa" | "commercial" | "penthouse" | "townhouse";
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
  features: string[];
  isFeatured: boolean;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Skyline Luxury Apartments",
    price: 450000,
    location: "Downtown Financial District",
    city: "New York",
    type: "sale",
    category: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: property1,
    description: "Experience urban luxury at its finest in this stunning high-rise apartment with panoramic city views, premium finishes, and world-class amenities.",
    features: ["Gym", "Pool", "Concierge", "Parking", "Smart Home"],
    isFeatured: true,
  },
  {
    id: "2",
    title: "Maple Grove Family Home",
    price: 320000,
    location: "Suburban Heights",
    city: "Austin",
    type: "sale",
    category: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    image: property2,
    description: "A charming family home nestled in a quiet neighborhood with a beautiful garden, spacious rooms, and modern kitchen.",
    features: ["Garden", "Garage", "Fireplace", "Basement", "Patio"],
    isFeatured: true,
  },
  {
    id: "3",
    title: "The Pinnacle Penthouse",
    price: 1200000,
    location: "Upper East Side",
    city: "New York",
    type: "sale",
    category: "penthouse",
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    image: property3,
    description: "An extraordinary penthouse with floor-to-ceiling windows offering breathtaking city views. Features designer interiors and private terrace.",
    features: ["Terrace", "Wine Cellar", "Home Theater", "Private Elevator", "Smart Home"],
    isFeatured: true,
  },
  {
    id: "4",
    title: "Ocean Breeze Villa",
    price: 8500,
    location: "Beachfront Paradise",
    city: "Miami",
    type: "rent",
    category: "villa",
    bedrooms: 6,
    bathrooms: 5,
    area: 5500,
    image: property4,
    description: "Wake up to ocean views in this exquisite beachfront villa. Features infinity pool, tropical garden, and direct beach access.",
    features: ["Infinity Pool", "Beach Access", "Garden", "BBQ Area", "Staff Quarters"],
    isFeatured: true,
  },
  {
    id: "5",
    title: "Heritage Row Townhouse",
    price: 2800,
    location: "Historic Quarter",
    city: "Boston",
    type: "rent",
    category: "townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 1900,
    image: property5,
    description: "A beautifully restored townhouse blending historic charm with modern comfort. Tree-lined street in a vibrant neighborhood.",
    features: ["Rooftop Deck", "Hardwood Floors", "Original Brick", "Updated Kitchen"],
    isFeatured: false,
  },
  {
    id: "6",
    title: "Innovation Hub Office Space",
    price: 5200,
    location: "Tech District",
    city: "San Francisco",
    type: "rent",
    category: "commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 3800,
    image: property6,
    description: "Premium open-plan office space with natural light, modern infrastructure, and prime location in the heart of the tech district.",
    features: ["Open Plan", "Meeting Rooms", "High-Speed Internet", "24/7 Access", "Parking"],
    isFeatured: false,
  },
];
