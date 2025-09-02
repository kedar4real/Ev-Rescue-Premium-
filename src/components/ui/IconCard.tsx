import React from 'react';
import { Icon } from './icons';

interface IconCardProps {
  iconName: string;
  title: string;
  description?: string;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'interactive' | 'highlighted';
}

export const IconCard: React.FC<IconCardProps> = ({
  iconName,
  title,
  description,
  size = 32,
  color = 'currentColor',
  className = '',
  onClick,
  variant = 'default'
}) => {
  const baseClasses = "flex flex-col items-center p-4 rounded-lg transition-all duration-200";
  
  const variants = {
    default: "border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    interactive: "border border-gray-200 hover:border-green-300 hover:bg-green-50 cursor-pointer hover:shadow-md",
    highlighted: "border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300"
  };

  const iconClasses = variants[variant];
  const combinedClasses = `${baseClasses} ${iconClasses} ${className}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={combinedClasses}
      onClick={handleClick}
      type={onClick ? 'button' : undefined}
    >
      <Icon 
        name={iconName} 
        size={size} 
        color={color}
        className="mb-3"
      />
      <h3 className="font-medium text-gray-900 text-center mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 text-center">{description}</p>
      )}
    </Component>
  );
};

// Quick access components for common use cases
export const EVIconCard: React.FC<Omit<IconCardProps, 'iconName'> & { iconName: keyof typeof import('./icons').EVIcons }> = (props) => (
  <IconCard {...props} />
);

export const NavigationIconCard: React.FC<Omit<IconCardProps, 'iconName'> & { iconName: keyof typeof import('./icons').NavigationIcons }> = (props) => (
  <IconCard {...props} />
);

export const ActionIconCard: React.FC<Omit<IconCardProps, 'iconName'> & { iconName: keyof typeof import('./icons').ActionIcons }> = (props) => (
  <IconCard {...props} />
);

export const StatusIconCard: React.FC<Omit<IconCardProps, 'iconName'> & { iconName: keyof typeof import('./icons').StatusIcons }> = (props) => (
  <IconCard {...props} />
);
