# Design Integration Guide for EV Rescue Premium

This guide explains how to import design templates, icons, and other resources from external sources into your Next.js application.

## 🎨 Icon Libraries Integration

### 1. **Lucide React (Already Installed)**
```tsx
import { Car, Zap, MapPin } from 'lucide-react';

// Usage
<Car size={24} className="text-blue-500" />
<Zap size={32} className="text-yellow-500" />
```

### 2. **React Icons (Already Installed)**
```tsx
import { FaCar, FaBattery, FaMapMarkerAlt } from 'react-icons/fa';
import { MdElectricCar, MdChargingStation } from 'react-icons/md';
import { GiElectric } from 'react-icons/gi';

// Usage
<FaCar size={24} className="text-blue-500" />
<MdElectricCar size={32} className="text-green-500" />
```

### 3. **Heroicons (Already Installed)**
```tsx
import { 
  TruckIcon, 
  MapPinIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';

// Usage
<TruckIcon className="w-6 h-6 text-blue-500" />
<MapPinIcon className="w-8 h-8 text-red-500" />
```

## 🌐 Importing from External Sources

### 1. **SVG Icons from Websites**

#### **Step 1: Find SVG Icons**
- Visit icon websites like:
  - [Feather Icons](https://feathericons.com/)
  - [Heroicons](https://heroicons.com/)
  - [Tabler Icons](https://tabler-icons.io/)
  - [Phosphor Icons](https://phosphoricons.com/)

#### **Step 2: Download SVG**
```bash
# Right-click on icon → "Save image as" → Save as .svg
# Or copy the SVG code directly
```

#### **Step 3: Create Custom Icon Component**
```tsx
// src/components/icons/CustomIcon.tsx
import React from 'react';

interface CustomIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Paste SVG path data here */}
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
};
```

### 2. **Design Templates from Mobbin**

#### **Step 1: Study the Design**
- Analyze the app's UI patterns
- Note color schemes and typography
- Identify component structures

#### **Step 2: Extract Color Palette**
```tsx
// src/styles/colors.ts
export const mobbinColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
};
```

#### **Step 3: Create Component Variants**
```tsx
// src/components/ui/Button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'mobbin' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  className, 
  variant = 'default', 
  size = 'md', 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    mobbin: "bg-[#007AFF] text-white hover:bg-[#0056CC] shadow-lg",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};
```

### 3. **Importing from Figma**

#### **Step 1: Export Assets**
- Open Figma design
- Select components/icons
- Right-click → "Export" → Choose format (SVG/PNG)

#### **Step 2: Create Asset Components**
```tsx
// src/components/assets/FigmaIcon.tsx
import React from 'react';

interface FigmaIconProps {
  size?: number;
  className?: string;
}

export const FigmaIcon: React.FC<FigmaIconProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <div 
      className={className}
      style={{ 
        width: size, 
        height: size,
        backgroundImage: "url('/assets/figma-icon.svg')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    />
  );
};
```

## 🎯 Advanced Integration Techniques

### 1. **Dynamic Icon Loading**
```tsx
// src/components/DynamicIcon.tsx
import React, { useState, useEffect } from 'react';

interface DynamicIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  iconName, 
  size = 24, 
  className = "" 
}) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        // Dynamic import for icon libraries
        const iconModule = await import(`lucide-react`);
        if (iconModule[iconName]) {
          setIconComponent(() => iconModule[iconName]);
        }
      } catch (error) {
        console.error(`Failed to load icon: ${iconName}`, error);
      }
    };

    loadIcon();
  }, [iconName]);

  if (!IconComponent) {
    return <div style={{ width: size, height: size }} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};
```

### 2. **Icon Font Integration**
```tsx
// Add to src/app/globals.css
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

// Usage in components
<i className="fas fa-car text-blue-500 text-2xl"></i>
<i className="fas fa-battery-three-quarters text-green-500 text-xl"></i>
```

### 3. **Custom Icon Set Creation**
```tsx
// src/components/icons/EVRescueIcons.tsx
import React from 'react';

// Custom EV-specific icons
export const EVRescueIcons = {
  ChargingStation: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  
  EmergencyCall: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  
  MobileCharger: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
};
```

## 🚀 Best Practices

### 1. **Icon Organization**
```
src/
├── components/
│   ├── icons/
│   │   ├── index.ts          # Export all icons
│   │   ├── LucideIcons.tsx   # Lucide icons
│   │   ├── CustomIcons.tsx   # Custom SVG icons
│   │   └── IconSets.tsx      # Icon collections
│   └── ui/
└── assets/
    ├── icons/                # SVG files
    └── images/               # PNG/JPG files
```

### 2. **Performance Optimization**
```tsx
// Lazy load icon libraries
const IconLibrary = React.lazy(() => import('./IconLibrary'));

// Use React.memo for static icons
const StaticIcon = React.memo(({ icon, ...props }) => (
  <Icon {...props} name={icon} />
));
```

### 3. **Accessibility**
```tsx
// Always include aria-label for decorative icons
<Icon 
  name="car" 
  size={24} 
  aria-label="Car icon"
  className="text-blue-500" 
/>

// For interactive icons, include role and tabIndex
<button 
  onClick={handleClick}
  aria-label="Emergency call"
  role="button"
  tabIndex={0}
>
  <Icon name="phone" size={20} />
</button>
```

## 📱 Mobile-First Icon Design

### 1. **Touch-Friendly Sizes**
```tsx
// Minimum touch target: 44x44px
const TouchIcon = ({ children, ...props }) => (
  <div 
    className="min-w-[44px] min-h-[44px] flex items-center justify-center"
    {...props}
  >
    {children}
  </div>
);
```

### 2. **Responsive Icon Scaling**
```tsx
// Tailwind responsive classes
<Icon 
  name="car" 
  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" 
/>
```

## 🔧 Troubleshooting

### Common Issues:
1. **Icon not displaying**: Check import paths and component names
2. **TypeScript errors**: Ensure proper type definitions
3. **Styling conflicts**: Use `!important` or specific selectors
4. **Bundle size**: Consider tree-shaking and lazy loading

### Debug Commands:
```bash
# Check installed packages
npm list lucide-react react-icons heroicons

# Clear Next.js cache
rm -rf .next
npm run dev

# Check bundle analyzer
npm run build
npm run analyze
```

## 📚 Resources

- [Lucide Icons](https://lucide.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)
- [Tabler Icons](https://tabler-icons.io/)
- [Phosphor Icons](https://phosphoricons.com/)

## 🎨 Example Implementation

Here's how to use the icon system in your components:

```tsx
import { Icon, EVIcons, NavigationIcons } from '@/components/ui/icons';

export const EmergencyButton = () => (
  <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg">
    <Icon name="phone" size={20} />
    Emergency Call
  </button>
);

export const LocationDisplay = () => (
  <div className="flex items-center gap-2 text-gray-600">
    <NavigationIcons.MapPin size={16} />
    <span>Current Location</span>
  </div>
);
```

This comprehensive icon system gives you the flexibility to use icons from multiple sources while maintaining consistency across your application!
