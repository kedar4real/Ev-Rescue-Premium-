import React from 'react';
import { 
  // Heroicons - Outline variants
  TruckIcon,
  BoltIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  Bars3Icon,
  HomeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  UsersIcon,
  Battery100Icon,
  SignalIcon,
  MapIcon,
  ArrowPathIcon,
  ClockIcon as TimerIcon,
  CurrencyDollarIcon,
  ReceiptRefundIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
  EnvelopeIcon,
  PhoneIcon as PhoneCallIcon,
  VideoCameraIcon,
  CameraIcon,
  PhotoIcon,
  DocumentIcon,
  FolderIcon,
  CircleStackIcon,
  ServerIcon,
  CloudIcon,
  GlobeAltIcon,
  SignalIcon as BluetoothIcon,
  RadioIcon,
  TvIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  PrinterIcon,
  BellIcon
} from '@heroicons/react/24/outline';

// Icon component with consistent sizing and styling
interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => {
  const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    // EV and Emergency Icons
    car: TruckIcon,
    zap: BoltIcon,
    mapPin: MapPinIcon,
    phone: PhoneIcon,
    messageCircle: ChatBubbleLeftRightIcon,
    user: UserIcon,
    bell: BellIcon,
    settings: Cog6ToothIcon,
    logout: ArrowRightOnRectangleIcon,
    plus: PlusIcon,
    search: MagnifyingGlassIcon,
    filter: FunnelIcon,
    calendar: CalendarIcon,
    clock: ClockIcon,
    star: StarIcon,
    checkCircle: CheckCircleIcon,
    alertTriangle: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    x: XMarkIcon,
    chevronDown: ChevronDownIcon,
    chevronRight: ChevronRightIcon,
    chevronLeft: ChevronLeftIcon,
    menu: Bars3Icon,
    home: HomeIcon,
    creditCard: CreditCardIcon,
    shield: ShieldCheckIcon,
    helpCircle: QuestionMarkCircleIcon,
    barChart3: ChartBarIcon,
    trendingUp: ChartBarSquareIcon,
    users: UsersIcon,
    truck: TruckIcon,
    battery: Battery100Icon,
    wifi: SignalIcon,
    signal: SignalIcon,
    navigation: MapIcon,
    target: ArrowPathIcon,
    route: ArrowPathIcon,
    timer: TimerIcon,
    dollarSign: CurrencyDollarIcon,
    receipt: ReceiptRefundIcon,
    fileText: DocumentTextIcon,
    download: ArrowDownTrayIcon,
    upload: ArrowUpTrayIcon,
    edit: PencilIcon,
    trash2: TrashIcon,
    eye: EyeIcon,
    eyeOff: EyeSlashIcon,
    lock: LockClosedIcon,
    unlock: LockOpenIcon,
    mail: EnvelopeIcon,
    phoneCall: PhoneCallIcon,
    video: VideoCameraIcon,
    camera: CameraIcon,
    image: PhotoIcon,
    file: DocumentIcon,
    folder: FolderIcon,
    database: CircleStackIcon,
    server: ServerIcon,
    cloud: CloudIcon,
    globe: GlobeAltIcon,
    bluetooth: BluetoothIcon,
    radio: RadioIcon,
    tv: TvIcon,
    monitor: ComputerDesktopIcon,
    smartphone: DevicePhoneMobileIcon,
    tablet: DeviceTabletIcon,
    laptop: ComputerDesktopIcon,
    printer: PrinterIcon,
    keyboard: DocumentIcon,
    mouse: ComputerDesktopIcon,
    headphones: SignalIcon,
    speaker: SignalIcon,
    gamepad2: PlusIcon,
    joystick: PlusIcon,
    puzzle: PlusIcon
  };

  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <div style={{ width: size, height: size }} className={className} />;
  }

  return (
    <IconComponent 
      width={size}
      height={size}
      className={className} 
      style={{ color }}
    />
  );
};

// Predefined icon sets for common use cases
export const EVIcons = {
  Car: (props: React.SVGProps<SVGSVGElement>) => <TruckIcon {...props} />,
  Zap: (props: React.SVGProps<SVGSVGElement>) => <BoltIcon {...props} />,
  Battery: (props: React.SVGProps<SVGSVGElement>) => <Battery100Icon {...props} />,
  Truck: (props: React.SVGProps<SVGSVGElement>) => <TruckIcon {...props} />,
  ElectricCar: (props: React.SVGProps<SVGSVGElement>) => <TruckIcon {...props} />,
  ElectricScooter: (props: React.SVGProps<SVGSVGElement>) => <TruckIcon {...props} />,
  ElectricBike: (props: React.SVGProps<SVGSVGElement>) => <Battery100Icon {...props} />,
};

export const NavigationIcons = {
  MapPin: (props: React.SVGProps<SVGSVGElement>) => <MapPinIcon {...props} />,
  Navigation: (props: React.SVGProps<SVGSVGElement>) => <MapIcon {...props} />,
  Target: (props: React.SVGProps<SVGSVGElement>) => <ArrowPathIcon {...props} />,
  Route: (props: React.SVGProps<SVGSVGElement>) => <ArrowPathIcon {...props} />,
  Location: (props: React.SVGProps<SVGSVGElement>) => <MapPinIcon {...props} />,
};

export const ActionIcons = {
  Plus: (props: React.SVGProps<SVGSVGElement>) => <PlusIcon {...props} />,
  Edit: (props: React.SVGProps<SVGSVGElement>) => <PencilIcon {...props} />,
  Trash2: (props: React.SVGProps<SVGSVGElement>) => <TrashIcon {...props} />,
  Download: (props: React.SVGProps<SVGSVGElement>) => <ArrowDownTrayIcon {...props} />,
  Upload: (props: React.SVGProps<SVGSVGElement>) => <ArrowUpTrayIcon {...props} />,
  Search: (props: React.SVGProps<SVGSVGElement>) => <MagnifyingGlassIcon {...props} />,
  Filter: (props: React.SVGProps<SVGSVGElement>) => <FunnelIcon {...props} />,
};

export const StatusIcons = {
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => <CheckCircleIcon {...props} />,
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => <ExclamationTriangleIcon {...props} />,
  Info: (props: React.SVGProps<SVGSVGElement>) => <InformationCircleIcon {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <XMarkIcon {...props} />,
  Star: (props: React.SVGProps<SVGSVGElement>) => <StarIcon {...props} />,
};

export const CommunicationIcons = {
  Phone: (props: React.SVGProps<SVGSVGElement>) => <PhoneIcon {...props} />,
  MessageCircle: (props: React.SVGProps<SVGSVGElement>) => <ChatBubbleLeftRightIcon {...props} />,
  Mail: (props: React.SVGProps<SVGSVGElement>) => <EnvelopeIcon {...props} />,
  Video: (props: React.SVGProps<SVGSVGElement>) => <VideoCameraIcon {...props} />,
  Camera: (props: React.SVGProps<SVGSVGElement>) => <CameraIcon {...props} />,
};

export const UserIcons = {
  User: (props: React.SVGProps<SVGSVGElement>) => <UserIcon {...props} />,
  Users: (props: React.SVGProps<SVGSVGElement>) => <UsersIcon {...props} />,
  Settings: (props: React.SVGProps<SVGSVGElement>) => <Cog6ToothIcon {...props} />,
  LogOut: (props: React.SVGProps<SVGSVGElement>) => <ArrowRightOnRectangleIcon {...props} />,
  Shield: (props: React.SVGProps<SVGSVGElement>) => <ShieldCheckIcon {...props} />,
};

export const BusinessIcons = {
  CreditCard: (props: React.SVGProps<SVGSVGElement>) => <CreditCardIcon {...props} />,
  DollarSign: (props: React.SVGProps<SVGSVGElement>) => <CurrencyDollarIcon {...props} />,
  Receipt: (props: React.SVGProps<SVGSVGElement>) => <ReceiptRefundIcon {...props} />,
  BarChart3: (props: React.SVGProps<SVGSVGElement>) => <ChartBarIcon {...props} />,
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => <ChartBarSquareIcon {...props} />,
};

export const TimeIcons = {
  Clock: (props: React.SVGProps<SVGSVGElement>) => <ClockIcon {...props} />,
  Calendar: (props: React.SVGProps<SVGSVGElement>) => <CalendarIcon {...props} />,
  Timer: (props: React.SVGProps<SVGSVGElement>) => <TimerIcon {...props} />,
};

export const DirectionIcons = {
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <ChevronDownIcon {...props} />,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <ChevronRightIcon {...props} />,
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => <ChevronLeftIcon {...props} />,
  Menu: (props: React.SVGProps<SVGSVGElement>) => <Bars3Icon {...props} />,
  Home: (props: React.SVGProps<SVGSVGElement>) => <HomeIcon {...props} />,
};

// Usage examples:
// <Icon name="car" size={32} className="text-blue-500" />
// <EVIcons.Car size={24} className="text-green-500" />
// <NavigationIcons.MapPin size={20} />
