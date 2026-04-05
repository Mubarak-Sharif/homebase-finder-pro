## BS Marble Karachi - Implementation Plan

### Phase 1: Foundation
1. **Reset project** - Remove all Real Estatify code, update branding
2. **Design system** - Black/dark grey background, white text, gold accents, luxury marble feel
3. **Mock data layer** - Products, categories, users, orders with TypeScript interfaces
4. **Auth system** - React context with login/logout/register, localStorage persistence, role switching

### Phase 2: Core Layout & Navigation
5. **Customer layout** - Bottom nav (Home, Categories, Cart, Orders, Profile)
6. **Admin layout** - Sidebar dashboard layout for Admin/Manager/Commissioner
7. **Auth screens** - Welcome, Login, Signup pages
8. **Route guards** - ProtectedRoute component with role-based access

### Phase 3: Customer Screens
9. **Splash + Home** - Search, featured marbles, categories, WhatsApp button
10. **Categories + Product Listing** - Grid, filters (category, price, color, usage), sort
11. **Product Detail** - Image carousel, specs, add to cart, WhatsApp inquiry
12. **Cart + Checkout** - Cart management, checkout form, order confirmation
13. **My Orders + Profile** - Order history, profile management
14. **Marble Calculator** - Area calculator with cost estimation

### Phase 4: Admin Screens
15. **Dashboard** - KPI cards, mock charts
16. **Products Management** - CRUD table with form modal
17. **Categories Management** - CRUD list
18. **Orders Management** - Orders table with status updates
19. **Users Management** - User table (Admin/Commissioner only)
20. **Commissioner Panel** - High-level KPIs and oversight
21. **Settings** - Organization settings

### Tech: React + Tailwind + shadcn/ui, localStorage state, mobile-first responsive