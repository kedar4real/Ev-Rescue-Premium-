import React from 'react';
import { Icon, EVIcons, NavigationIcons, ActionIcons, StatusIcons } from '../ui/icons';
import { FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import { MdElectricCar, MdChargingStation } from 'react-icons/md';
import { GiElectric } from 'react-icons/gi';

export const IconShowcase: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Icon Integration Showcase</h1>
        <p className="text-gray-600">Demonstrating different ways to import and use icons in your app</p>
      </div>

      {/* Lucide React Icons */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="zap" size={24} className="text-yellow-500" />
          Lucide React Icons
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Icon name="car" size={32} className="text-blue-500 mb-2" />
            <span className="text-sm text-gray-600">Car</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Icon name="battery" size={32} className="text-green-500 mb-2" />
            <span className="text-sm text-gray-600">Battery</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Icon name="mapPin" size={32} className="text-red-500 mb-2" />
            <span className="text-sm text-gray-600">Location</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Icon name="phone" size={32} className="text-purple-500 mb-2" />
            <span className="text-sm text-gray-600">Phone</span>
          </div>
        </div>
      </section>

      {/* React Icons */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GiElectric size={24} className="text-blue-500" />
          React Icons
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <FaCar size={32} className="text-blue-500 mb-2" />
            <span className="text-sm text-gray-600">Car (FA)</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Icon name="battery" size={32} className="text-green-500 mb-2" />
            <span className="text-sm text-gray-600">Battery (Lucide)</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <MdElectricCar size={32} className="text-green-600 mb-2" />
            <span className="text-sm text-gray-600">Electric Car (MD)</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <MdChargingStation size={32} className="text-orange-500 mb-2" />
            <span className="text-sm text-gray-600">Charging (MD)</span>
          </div>
        </div>
      </section>

      {/* Predefined Icon Sets */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="package" size={24} className="text-indigo-500" />
          Predefined Icon Sets
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <EVIcons.ElectricCar className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm text-gray-600">EV Car</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <EVIcons.Truck className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm text-gray-600">Truck</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <EVIcons.Battery className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="text-sm text-gray-600">Battery</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <EVIcons.Zap className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm text-gray-600">Power</span>
          </div>
        </div>
      </section>

      {/* Custom Icon Usage Examples */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="settings" size={24} className="text-gray-500" />
          Practical Usage Examples
        </h2>
        <div className="space-y-4">
          {/* Emergency Button */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="alertTriangle" size={24} className="text-red-500" />
              <div>
                <h3 className="font-medium text-gray-900">Emergency Call</h3>
                <p className="text-sm text-gray-600">Quick access to emergency services</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              <Icon name="phone" className="w-5 h-5" />
              Call Now
            </button>
          </div>

          {/* Location Display */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <NavigationIcons.MapPin className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-900">Current Location</h3>
                <p className="text-sm text-gray-600">123 Main St, City, State</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <Icon name="navigation" className="w-5 h-5" />
              Navigate
            </button>
          </div>

          {/* Battery Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <EVIcons.Battery className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-medium text-gray-900">Battery Level</h3>
                <p className="text-sm text-gray-600">75% - Good condition</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcons.CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Safe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Import Guide */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Import Icons</h2>
        <div className="space-y-4 text-sm">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">1. From Lucide React</h3>
            <code className="block bg-gray-100 p-2 rounded text-gray-800">
              {`import { Car, Zap, MapPin } from 'lucide-react';`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">2. From React Icons</h3>
            <code className="block bg-gray-100 p-2 rounded text-gray-800">
              {`import { FaCar, FaBattery } from 'react-icons/fa';`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">3. Using Our Icon System</h3>
            <code className="block bg-gray-100 p-2 rounded text-gray-800">
              {`import { Icon, EVIcons } from '@/components/ui/icons';`}
            </code>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">4. Custom SVG Icons</h3>
            <code className="block bg-gray-100 p-2 rounded text-gray-800">
              {`// Create custom SVG components in src/components/icons/CustomIcons.tsx`}
            </code>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Icon name="lightbulb" className="w-6 h-6 text-blue-500" />
          Pro Tips
        </h2>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <Icon name="checkCircle" className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Use consistent icon sizes across your app (16px, 20px, 24px, 32px)</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="checkCircle" className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Always include aria-label for accessibility when icons are decorative</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="checkCircle" className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Use semantic colors (red for errors, green for success, blue for info)</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="checkCircle" className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Consider lazy loading for large icon libraries to improve performance</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
