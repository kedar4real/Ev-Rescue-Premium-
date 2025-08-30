'use client'

import { Dashboard } from "../components/Dashboard"

export default function Home() {
  const handleNavigate = (view: string) => {
    console.log(`Navigating to: ${view}`)
    // You can implement actual navigation here
  }

  return (
    <div className="min-h-screen">
      <Dashboard />
    </div>
  )
}
