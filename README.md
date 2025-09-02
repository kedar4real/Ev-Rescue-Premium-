# 🚗 EV Rescue Premium - Emergency EV Charging Service
<!-- Force deployment - Latest commit: 9d1dbfd -->

A comprehensive, state-of-the-art emergency electric vehicle charging service platform built with Next.js 15, React 19, and modern web technologies.

## ✨ **Features Overview**

### 🚨 **Core Emergency Services**
- **Emergency Request System**: Multi-step form for requesting emergency charging
- **Real-time Location Tracking**: GPS-based location detection and sharing
- **Priority-based Response**: High, medium, and low priority request handling
- **Provider Assignment**: Intelligent provider matching and assignment

### 📍 **Live Tracking & Monitoring**
- **Real-time Location Updates**: Continuous GPS tracking every 10 seconds
- **Provider Tracking**: Monitor service provider location and ETA
- **Distance Calculations**: Real-time distance and arrival time estimates
- **Battery Monitoring**: Track vehicle battery levels during emergencies
- **Location Sharing**: Share coordinates via messaging apps or clipboard

### 💬 **Real-time Communication**
- **Live Chat System**: Real-time messaging with support and providers
- **Multiple Chat Rooms**: Emergency support, provider communication, general support
- **Location Sharing**: Share GPS coordinates directly in chat
- **Typing Indicators**: Real-time typing status and notifications
- **Message History**: Persistent chat history and conversation management

### 🆘 **Support & Customer Service**
- **24/7 Support Center**: Comprehensive FAQ and support ticket system
- **Emergency Support**: Immediate assistance for urgent situations
- **Live Chat Support**: Real-time customer service communication
- **Ticket Management**: Create, track, and manage support requests
- **Knowledge Base**: Searchable FAQ with categorized information

### 📊 **Analytics & Insights**
- **Performance Dashboard**: Comprehensive metrics and KPIs
- **Response Time Analytics**: Track and analyze service performance
- **Revenue Tracking**: Monitor subscription and service revenue
- **Geographic Insights**: Top locations and coverage analysis
- **Vehicle Type Analytics**: Popular EV models and usage patterns
- **Trend Analysis**: Monthly, quarterly, and yearly performance trends

### 💳 **Payment & Subscription**
- **Razorpay Integration**: Secure payment gateway with multiple payment methods
- **Subscription Plans**: Basic, Premium, and Enterprise tiers
- **Flexible Billing**: Monthly and yearly billing options
- **Multiple Payment Methods**: Credit cards, UPI, net banking, digital wallets
- **Secure Transactions**: SSL encryption and PCI compliance

### 👤 **User Management**
- **Profile Management**: Comprehensive user profile and preferences
- **Vehicle Management**: Add, edit, and manage multiple vehicles
- **Emergency Contacts**: Store and manage emergency contact information
- **Service History**: Complete history of all emergency requests
- **Rating System**: Rate and review service providers

### 🎨 **Modern UI/UX**
- **Dark Theme**: Professional dark theme with glassmorphism effects
- **Responsive Design**: Mobile-first responsive design
- **Smooth Animations**: CSS-based animations and transitions
- **Professional Design**: Uber-like professional appearance
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠 **Technology Stack**

### **Frontend**
- **Next.js 15**: App Router with Turbopack for fast development
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS 3**: Utility-first CSS framework with custom design system

### **Backend & Database**
- **Firebase**: Authentication, Firestore, and Storage
- **Real-time Updates**: Live data synchronization
- **User Management**: Comprehensive user profiles and roles

### **Payment & Integrations**
- **Razorpay**: Secure payment gateway integration
- **Multiple Currencies**: INR, USD, EUR support
- **Payment Methods**: Cards, UPI, net banking, wallets

### **UI Components**
- **Radix UI**: Accessible and customizable UI primitives
- **Custom Components**: Tailored components for emergency services
- **Responsive Design**: Mobile-first approach with touch interactions

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Firebase account
- Razorpay account (for payments)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ev-rescue-premium
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Razorpay Configuration
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 **Pages & Features**

### **Public Pages**
- **Homepage** (`/`): Landing page with hero section and features
- **Login** (`/login`): User authentication
- **Register** (`/register`): User registration
- **Pricing** (`/pricing`): Subscription plans and payment

### **Authenticated Pages**
- **Dashboard** (`/dashboard`): User overview and quick actions
- **Emergency** (`/emergency`): Create emergency charging requests
- **Tracking** (`/tracking`): Live tracking of active requests
- **Chat** (`/chat`): Real-time communication
- **Profile** (`/profile`): User profile and settings
- **History** (`/history`): Service history and reviews
- **Support** (`/support`): Help center and tickets
- **Analytics** (`/analytics`): Performance insights (admin)

### **Admin Pages**
- **Admin Dashboard** (`/admin`): Comprehensive admin panel
- **User Management**: Manage users and roles
- **Request Monitoring**: Track all emergency requests
- **Provider Management**: Manage service providers
- **Analytics**: Business intelligence and reporting

## 🔧 **Configuration**

### **Firebase Setup**
1. Create a Firebase project
2. Enable Authentication, Firestore, and Storage
3. Add your Firebase config to environment variables
4. Set up Firestore security rules

### **Razorpay Setup**
1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Add keys to environment variables
4. Configure webhook endpoints

### **Customization**
- **Theme Colors**: Modify `tailwind.config.js` for brand colors
- **Components**: Customize UI components in `src/components/ui/`
- **Styling**: Update global styles in `src/app/globals.css`

## 📊 **Performance Features**

### **Real-time Updates**
- **WebSocket-like**: Real-time data synchronization
- **Location Tracking**: GPS updates every 10 seconds
- **Live Chat**: Instant message delivery
- **Status Updates**: Real-time request status changes

### **Optimization**
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component optimization
- **Lazy Loading**: Component and route lazy loading
- **Caching**: Intelligent caching strategies

## 🔒 **Security Features**

### **Authentication**
- **Firebase Auth**: Secure user authentication
- **Role-based Access**: User, provider, and admin roles
- **Session Management**: Secure session handling

### **Data Protection**
- **SSL Encryption**: HTTPS-only communication
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Built-in React security features
- **CSRF Protection**: Cross-site request forgery prevention

## 📱 **Mobile Features**

### **Responsive Design**
- **Mobile-first**: Optimized for mobile devices
- **Touch Interactions**: Touch-friendly interface elements
- **Progressive Web App**: PWA capabilities for mobile users

### **Location Services**
- **GPS Integration**: Native GPS support
- **Offline Maps**: Basic offline functionality
- **Location Sharing**: Easy coordinate sharing

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
npm start
```

### **Deployment Options**
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **AWS**: Scalable cloud deployment
- **Docker**: Containerized deployment

### **Environment Variables**
- Set production environment variables
- Configure production Firebase project
- Set up production Razorpay keys
- Configure domain and SSL certificates

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Standard commit messages

## 📈 **Roadmap**

### **Phase 1 (Current)**
- ✅ Core emergency request system
- ✅ Real-time tracking
- ✅ Live chat system
- ✅ Payment integration
- ✅ Basic analytics

### **Phase 2 (Next)**
- 🔄 AI-powered provider matching
- 🔄 Advanced route optimization
- 🔄 Predictive analytics
- 🔄 Mobile app development
- 🔄 IoT device integration

### **Phase 3 (Future)**
- 📋 Blockchain integration
- 📋 Advanced ML algorithms
- 📋 International expansion
- 📋 Partner API ecosystem
- 📋 Advanced reporting

## 📞 **Support**

### **Documentation**
- **API Reference**: Comprehensive API documentation
- **User Guide**: Step-by-step user instructions
- **Developer Guide**: Technical implementation details
- **FAQ**: Common questions and answers

### **Contact Information**
- **Email**: support@evrescue.com
- **Phone**: 1-800-EV-RESCUE
- **Live Chat**: Available 24/7 in the app
- **Support Tickets**: Create tickets for complex issues

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Firebase**: For backend services
- **Razorpay**: For payment gateway integration
- **Open Source Community**: For various libraries and tools

---

**Built with ❤️ for the EV community**

*Emergency charging when you need it most*
#   F o r c e   d e p l o y m e n t 
 
 