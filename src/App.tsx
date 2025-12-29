import { useState } from 'react'
import InventoryDashboard from './components/inventory-dashboard'
import ResourceManagement from './components/resource-management'
import ProcurementRequest from './components/procurement-request'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-4">
        <h1 className="mb-8 text-xl font-bold text-foreground">SecureCore</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full rounded-lg px-4 py-2 text-left ${
              currentPage === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            Inventory Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('resources')}
            className={`w-full rounded-lg px-4 py-2 text-left ${
              currentPage === 'resources' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            Resource Management
          </button>
          <button
            onClick={() => setCurrentPage('procurement')}
            className={`w-full rounded-lg px-4 py-2 text-left ${
              currentPage === 'procurement' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            Procurement Requests
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <InventoryDashboard />}
        {currentPage === 'resources' && <ResourceManagement />}
        {currentPage === 'procurement' && <ProcurementRequest />}
      </main>
    </div>
  )
}

export default App