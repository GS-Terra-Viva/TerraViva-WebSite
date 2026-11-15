import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

type Props = {
  titulo: string
  children: ReactNode
}

export default function AdminLayout({ titulo, children }: Props) {
  return (
    <div className="min-h-screen flex bg-[#f4f3ee] text-gray-900">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <header className="px-6 md:px-10 py-5 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold">{titulo}</h2>
        </header>

        {children}
      </div>
    </div>
  )
}
