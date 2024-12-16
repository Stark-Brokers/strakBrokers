import { Outlet } from 'react-router-dom'
import RenterSidebar from './RenterSidebar'

export default function RenterLayout({ language }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <RenterSidebar language={language} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
} 