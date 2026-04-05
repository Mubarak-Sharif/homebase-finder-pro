// ============ TYPES ============
export type UserRole = "COMMISSIONER_PA_ADMIN" | "ADMIN" | "MANAGER" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: "active" | "inactive";
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number; // per sqft
  origin: string;
  color: string;
  finish: string;
  thickness: string[];
  usage: string[];
  images: string[];
  description: string;
  stockStatus: "in_stock" | "limited" | "out_of_stock";
  featured: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number; // sqft
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; pricePerSqft: number }[];
  total: number;
  status: OrderStatus;
  customerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  area: string;
  orderType: "standard" | "bulk";
  paymentMethod: "cod" | "bank_transfer";
  notes: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// ============ MOCK USERS ============
export const mockUsers: User[] = [
  { id: "u1", name: "Commissioner Sahab", email: "commissioner@bsmarble.pk", phone: "03001234567", password: "admin123", role: "COMMISSIONER_PA_ADMIN", status: "active" },
  { id: "u2", name: "Ahmed Khan", email: "admin@bsmarble.pk", phone: "03009876543", password: "admin123", role: "ADMIN", status: "active" },
  { id: "u3", name: "Bilal Shah", email: "manager@bsmarble.pk", phone: "03211234567", password: "manager123", role: "MANAGER", status: "active" },
  { id: "u4", name: "Ali Hassan", email: "ali@gmail.com", phone: "03331234567", password: "customer123", role: "CUSTOMER", status: "active" },
  { id: "u5", name: "Sara Malik", email: "sara@gmail.com", phone: "03451234567", password: "customer123", role: "CUSTOMER", status: "active" },
];

// ============ MOCK CATEGORIES ============
export const mockCategories: Category[] = [
  { id: "c1", name: "Granite", description: "Premium quality granite for countertops and flooring", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400", sortOrder: 1, active: true },
  { id: "c2", name: "Ziarat White", description: "Classic white marble from Ziarat, Balochistan", image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400", sortOrder: 2, active: true },
  { id: "c3", name: "Quetta Marble", description: "Beautiful veined marble from Quetta region", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400", sortOrder: 3, active: true },
  { id: "c4", name: "Black & Gold", description: "Luxurious black marble with gold veining", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", sortOrder: 4, active: true },
  { id: "c5", name: "Onyx", description: "Translucent onyx marble for premium interiors", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", sortOrder: 5, active: true },
  { id: "c6", name: "Imported Marble", description: "Premium imported marble from Italy and Turkey", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400", sortOrder: 6, active: true },
];

// ============ MOCK PRODUCTS ============
export const mockProducts: Product[] = [
  {
    id: "p1", name: "Ziarat Super White", categoryId: "c2", price: 280,
    origin: "Ziarat, Balochistan", color: "White", finish: "Polished",
    thickness: ["15mm", "18mm", "20mm"], usage: ["Flooring", "Kitchen", "Stairs"],
    images: ["https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600"],
    description: "Premium Ziarat white marble with minimal veining. Perfect for modern interiors with a clean, luxurious finish.",
    stockStatus: "in_stock", featured: true
  },
  {
    id: "p2", name: "Black Galaxy Granite", categoryId: "c1", price: 450,
    origin: "India", color: "Black", finish: "Polished",
    thickness: ["18mm", "20mm", "30mm"], usage: ["Kitchen", "Countertops", "Stairs"],
    images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?w=600"],
    description: "Stunning black granite with gold specks. Ideal for kitchen countertops and statement flooring.",
    stockStatus: "in_stock", featured: true
  },
  {
    id: "p3", name: "Sahara Gold Onyx", categoryId: "c5", price: 850,
    origin: "Balochistan", color: "Gold", finish: "Polished",
    thickness: ["15mm", "18mm"], usage: ["Feature Walls", "Backlit Panels", "Bathroom"],
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600"],
    description: "Luxurious translucent onyx with golden tones. Creates breathtaking backlit feature walls.",
    stockStatus: "limited", featured: true
  },
  {
    id: "p4", name: "Nero Marquina", categoryId: "c4", price: 650,
    origin: "Spain (Imported)", color: "Black with White Veins", finish: "Polished",
    thickness: ["18mm", "20mm"], usage: ["Flooring", "Bathroom", "Feature Walls"],
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
    description: "Elegant black marble with distinctive white veining. A classic choice for sophisticated spaces.",
    stockStatus: "in_stock", featured: true
  },
  {
    id: "p5", name: "Quetta Pink", categoryId: "c3", price: 220,
    origin: "Quetta, Balochistan", color: "Pink/Beige", finish: "Polished",
    thickness: ["15mm", "18mm", "20mm"], usage: ["Flooring", "Stairs", "Outdoor"],
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600"],
    description: "Affordable and beautiful marble with warm pink tones. Great for residential flooring.",
    stockStatus: "in_stock", featured: false
  },
  {
    id: "p6", name: "Carrara White", categoryId: "c6", price: 1200,
    origin: "Italy (Imported)", color: "White with Grey Veins", finish: "Honed",
    thickness: ["18mm", "20mm"], usage: ["Bathroom", "Kitchen", "Feature Walls"],
    images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600"],
    description: "World-renowned Italian Carrara marble. The gold standard of luxury interior design.",
    stockStatus: "limited", featured: true
  },
  {
    id: "p7", name: "Sunny Grey Granite", categoryId: "c1", price: 320,
    origin: "China (Imported)", color: "Grey", finish: "Flamed",
    thickness: ["20mm", "30mm"], usage: ["Outdoor", "Stairs", "Flooring"],
    images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?w=600"],
    description: "Durable grey granite with flamed finish. Perfect for outdoor and high-traffic areas.",
    stockStatus: "in_stock", featured: false
  },
  {
    id: "p8", name: "Verona Beige", categoryId: "c3", price: 350,
    origin: "Quetta, Balochistan", color: "Beige", finish: "Polished",
    thickness: ["15mm", "18mm"], usage: ["Flooring", "Kitchen", "Bathroom"],
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600"],
    description: "Elegant beige marble with subtle veining. A versatile choice for any room.",
    stockStatus: "in_stock", featured: false
  },
];

// ============ MOCK ORDERS ============
export const mockOrders: Order[] = [
  {
    id: "ORD-001", userId: "u4", items: [{ productId: "p1", quantity: 200, pricePerSqft: 280 }, { productId: "p5", quantity: 150, pricePerSqft: 220 }],
    total: 89000, status: "delivered", customerName: "Ali Hassan", phone: "03331234567", whatsapp: "03331234567",
    address: "House 45, Block 3, Gulshan-e-Iqbal", area: "Gulshan-e-Iqbal", orderType: "standard", paymentMethod: "cod", notes: "", createdAt: "2025-03-28"
  },
  {
    id: "ORD-002", userId: "u5", items: [{ productId: "p4", quantity: 100, pricePerSqft: 650 }],
    total: 65000, status: "confirmed", customerName: "Sara Malik", phone: "03451234567", whatsapp: "03451234567",
    address: "Flat 12, Tower B, Clifton", area: "Clifton", orderType: "standard", paymentMethod: "bank_transfer", notes: "Please deliver before Friday", createdAt: "2025-04-01"
  },
  {
    id: "ORD-003", userId: "u4", items: [{ productId: "p6", quantity: 80, pricePerSqft: 1200 }],
    total: 96000, status: "pending", customerName: "Ali Hassan", phone: "03331234567", whatsapp: "03331234567",
    address: "House 45, Block 3, Gulshan-e-Iqbal", area: "Gulshan-e-Iqbal", orderType: "bulk", paymentMethod: "bank_transfer", notes: "Bulk order for new villa project", createdAt: "2025-04-03"
  },
];

// ============ MOCK REVIEWS ============
export const mockReviews: Review[] = [
  { id: "r1", productId: "p1", userName: "Ali Hassan", rating: 5, comment: "Excellent quality marble! Very satisfied with the finish.", date: "2025-03-15" },
  { id: "r2", productId: "p1", userName: "Usman Ghani", rating: 4, comment: "Good marble, delivery was on time.", date: "2025-03-20" },
  { id: "r3", productId: "p4", userName: "Sara Malik", rating: 5, comment: "Stunning marble! Our bathroom looks amazing now.", date: "2025-03-25" },
  { id: "r4", productId: "p2", userName: "Kamran Ali", rating: 4, comment: "Strong and beautiful granite. Perfect for kitchen.", date: "2025-03-28" },
];

// ============ SETTINGS ============
export interface AppSettings {
  orgName: string;
  whatsappNumber: string;
  city: string;
  deliveryInfo: string;
}

export const defaultSettings: AppSettings = {
  orgName: "BS Marble Karachi",
  whatsappNumber: "923001234567",
  city: "Karachi",
  deliveryInfo: "Delivery and transport charges will be confirmed separately based on your location within Karachi.",
};
