import type { LucideIcon } from 'lucide-react';
import {
  Building2, Calculator, CircleHelp, CodeXml, Compass, CreditCard, Dumbbell, GraduationCap, HandCoins, HeartPulse,
  Hospital, Landmark, Lightbulb, Luggage, Mail, MapPin, Megaphone, MessageCircle, MessageSquareText, Newspaper,
  Package, PenTool, Pill, Plane, ReceiptText, ScanBarcode, School, Server, ShieldCheck, Sparkles, ShoppingBag, ShoppingCart,
  Smartphone, Stethoscope, Target, Truck, UserCog, Users, UsersRound, UtensilsCrossed, Wallet, Workflow, Zap, BriefcaseBusiness,
} from 'lucide-react';

export type CatalogItem = { id: string; title: string; icon: LucideIcon; summary: string };

/* Services menu + "What we deliver" section. */
export const offerings: (CatalogItem & { points: string[] })[] = [
  { id: 'web', title: 'Web applications', icon: CodeXml, summary: 'Fast, secure web applications and portals, built around how your business actually works.', points: ['Business apps and dashboards', 'Customer and partner portals', 'Responsive on every screen'] },
  { id: 'mobile', title: 'Mobile applications', icon: Smartphone, summary: 'Android and iOS apps that feel native, work offline, and connect to your existing systems.', points: ['Android and iOS', 'Cross-platform builds', 'Store release and updates'] },
  { id: 'design', title: 'UI/UX design', icon: PenTool, summary: 'Research-led journeys and interfaces that make complex work feel simple.', points: ['User research and journeys', 'Wireframes and prototypes', 'Design systems'] },
  { id: 'automation', title: 'AI & automation', icon: Sparkles, summary: 'Assistants, document processing, and workflow automation, with people kept in the loop.', points: ['Knowledge assistants', 'Document processing', 'Workflow automation'] },
  { id: 'hosting', title: 'Domain & hosting', icon: Server, summary: 'Domains, cloud hosting, email, and SSL, set up properly and kept running.', points: ['Domain and DNS setup', 'Cloud hosting and backups', 'Business email and SSL'] },
  { id: 'marketing', title: 'Digital marketing', icon: Megaphone, summary: 'Search, social, and content that bring the right people to your product.', points: ['SEO and content', 'Social and paid campaigns', 'Analytics and reporting'] },
  { id: 'consultancy', title: 'Tech consultancy', icon: Lightbulb, summary: 'Independent advice on architecture, platforms, and where technology will pay off.', points: ['Technology roadmaps', 'Architecture reviews', 'Build-vs-buy decisions'] },
];

/* Industries menu + the filter on the Solutions section. */
export const industries: { id: string; title: string; icon: LucideIcon }[] = [
  { id: 'healthcare', title: 'Healthcare', icon: HeartPulse },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'finance', title: 'Finance & banking', icon: Landmark },
  { id: 'retail', title: 'Retail & e-commerce', icon: ShoppingBag },
  { id: 'hospitality', title: 'Food & hospitality', icon: UtensilsCrossed },
  { id: 'travel', title: 'Travel & tourism', icon: Plane },
  { id: 'logistics', title: 'Logistics', icon: Truck },
  { id: 'real-estate', title: 'Real estate', icon: Building2 },
  { id: 'media', title: 'Media & publishing', icon: Newspaper },
  { id: 'fitness', title: 'Fitness & wellness', icon: Dumbbell },
  { id: 'hr', title: 'HR & recruitment', icon: Users },
  { id: 'sales', title: 'Sales & marketing', icon: Target },
];

/* Solutions menu + "Ready-made solutions" section. */
export const solutions: (CatalogItem & { industry: string })[] = [
  { id: 'travel-booking', title: 'Travel booking software', icon: Plane, industry: 'travel', summary: 'Flights, hotels, buses, and holiday packages with bookings, payments, and agent accounts.' },
  { id: 'gym', title: 'Gym management software', icon: Dumbbell, industry: 'fitness', summary: 'Memberships, attendance, trainers, and renewals in one place.' },
  { id: 'hospital', title: 'Hospital software', icon: Hospital, industry: 'healthcare', summary: 'Patients, admissions, wards, billing, and records across departments.' },
  { id: 'courier', title: 'Courier & logistics', icon: Truck, industry: 'logistics', summary: 'Bookings, dispatch, live tracking, and proof of delivery.' },
  { id: 'fintech', title: 'Fintech software', icon: Wallet, industry: 'finance', summary: 'Wallets, payments, and financial workflows built with compliance in mind.' },
  { id: 'ecommerce', title: 'E-commerce portal', icon: ShoppingCart, industry: 'retail', summary: 'Storefront, catalogue, orders, payments, and delivery tracking.' },
  { id: 'school', title: 'School software', icon: School, industry: 'education', summary: 'Admissions, attendance, fees, exams, and parent communication.' },
  { id: 'online-education', title: 'Online education software', icon: GraduationCap, industry: 'education', summary: 'Courses, live classes, assessments, and certificates.' },
  { id: 'marketing-tools', title: 'Marketing tools', icon: Target, industry: 'sales', summary: 'Campaigns, lead capture, and messaging across channels.' },
  { id: 'billing', title: 'Billing & invoice software', icon: ReceiptText, industry: 'finance', summary: 'GST-ready invoices, payments, and account statements.' },
  { id: 'pharmacy', title: 'Pharmacy software', icon: Pill, industry: 'healthcare', summary: 'Stock, batches, expiry alerts, prescriptions, and billing.' },
  { id: 'job-portal', title: 'Job portal', icon: BriefcaseBusiness, industry: 'hr', summary: 'Job listings, applications, candidate profiles, and employer dashboards.' },
  { id: 'crm', title: 'CRM software', icon: UsersRound, industry: 'sales', summary: 'Leads, pipeline, follow-ups, and customer history for your sales team.' },
  { id: 'retail-pos', title: 'Retail POS', icon: ScanBarcode, industry: 'retail', summary: 'Fast checkout, inventory, and multi-store reporting.' },
  { id: 'clinic', title: 'Clinic management software', icon: Stethoscope, industry: 'healthcare', summary: 'Appointments, consultations, prescriptions, and follow-ups.' },
  { id: 'loan', title: 'Loan management software', icon: HandCoins, industry: 'finance', summary: 'Applications, approvals, EMI schedules, and collections.' },
  { id: 'hr', title: 'HR management software', icon: UserCog, industry: 'hr', summary: 'Employees, attendance, leave, and payroll.' },
  { id: 'restaurant-pos', title: 'Restaurant POS', icon: UtensilsCrossed, industry: 'hospitality', summary: 'Table orders, kitchen tickets, billing, and online orders.' },
  { id: 'real-estate', title: 'Real estate', icon: Building2, industry: 'real-estate', summary: 'Property listings, enquiries, site visits, and bookings.' },
  { id: 'news', title: 'News portal', icon: Newspaper, industry: 'media', summary: 'Publishing workflow, categories, and ad placements.' },
];

/* APIs menu + "API integrations" section. */
export const apis: CatalogItem[] = [
  { id: 'payments', title: 'Payment gateways', icon: CreditCard, summary: 'UPI, cards, net banking, and wallets with reconciliation.' },
  { id: 'sms', title: 'SMS & OTP', icon: MessageSquareText, summary: 'Transactional alerts and one-time passwords.' },
  { id: 'whatsapp', title: 'WhatsApp Business', icon: MessageCircle, summary: 'Notifications, chat, and conversational flows.' },
  { id: 'email', title: 'Email delivery', icon: Mail, summary: 'Transactional and campaign email that lands in the inbox.' },
  { id: 'maps', title: 'Maps & location', icon: MapPin, summary: 'Geocoding, routes, and live location tracking.' },
  { id: 'travel', title: 'Travel APIs', icon: Luggage, summary: 'Flight, hotel, and bus inventory and booking.' },
  { id: 'shipping', title: 'Shipping & tracking', icon: Package, summary: 'Courier booking, labels, and shipment tracking.' },
  { id: 'recharge', title: 'Recharge & bill payments', icon: Zap, summary: 'Mobile, DTH, and utility bill payments.' },
  { id: 'kyc', title: 'KYC & verification', icon: ShieldCheck, summary: 'Identity, PAN, and bank account verification.' },
  { id: 'accounting', title: 'Accounting & GST', icon: Calculator, summary: 'Sync invoices and ledgers with your accounting tools.' },
];

/* "SaaS" section. Placeholder selection and plan details: confirm before launch. */
export const saasProducts = ['crm', 'hr', 'billing', 'school', 'clinic', 'restaurant-pos'];
/* Shown in the "Know about our plans" dialog. Placeholder wording: confirm before launch. */
export const saasIncludes = ['Hosting, SSL, and maintenance', 'Backups and security updates', 'New features as they ship', 'Your logo, colours, and domain', 'Support from our team'];
export const saasPricing = 'Pricing depends on the product, the number of users, and the modules you need. Monthly and annual billing are available. Tell us what you need and we will send a quote.';
export const saasBenefits = [
  { title: 'Live in days', body: 'Start on a proven product instead of building from zero.' },
  { title: 'Hosted & maintained', body: 'We run the servers, backups, security updates, and upgrades.' },
  { title: 'Your brand', body: 'Your logo, colours, and domain on every screen.' },
  { title: 'Grows with you', body: 'Add custom modules and integrations when you need them.' },
];

/* Company menu. `open` expands a folded section when it is the link target. */
export const companyLinks: (Omit<CatalogItem, 'id'> & { href: string; open?: string })[] = [
  { title: 'About us', href: '#about', icon: Compass, summary: 'Who we are and how we think.' },
  { title: 'Our team', href: '#team', open: 'team', icon: Users, summary: 'The people behind the work.' },
  { title: 'How we work', href: '#process', icon: Workflow, summary: 'From first call to launch and beyond.' },
  { title: 'FAQs', href: '#faq', open: 'faq-fold', icon: CircleHelp, summary: 'Scope, cost, ownership, and support.' },
];

export const industryOf = (id: string) => industries.find(industry => industry.id === id);

/* Every option the contact form offers, grouped. Values are stable ids; labels go into the inquiry. */
export const interestGroups = [
  { label: 'Services', options: offerings.map(item => ({ value: `service:${item.id}`, label: item.title })) },
  { label: 'Ready-made solutions', options: solutions.map(item => ({ value: `solution:${item.id}`, label: item.title })) },
  { label: 'Other', options: [{ value: 'saas', label: 'SaaS subscription' }, { value: 'api', label: 'API integration' }, { value: 'scope', label: 'Help defining the scope' }] },
];
export const interestLabel = (value: string) =>
  interestGroups.flatMap(group => group.options).find(option => option.value === value)?.label ?? value;
