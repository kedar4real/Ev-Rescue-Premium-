import { FleetMap } from '../../components/FleetMap'

export default function FleetManagementPage() {
  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fleet Management
          </h1>
          <p className="text-xl text-green-400 max-w-2xl mx-auto">
            Real-time tracking and management of all service vehicles
          </p>
        </div>

        {/* Fleet Map Component */}
        <FleetMap />
      </div>
    </div>
  )
}
