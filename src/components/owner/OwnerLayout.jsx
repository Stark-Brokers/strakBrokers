import { Outlet } from 'react-router-dom'
import OwnerSidebar from './OwnerSidebar'

export default function OwnerLayout({ language }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <OwnerSidebar language={language} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
} 