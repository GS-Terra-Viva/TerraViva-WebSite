import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

type Props = {
  titulo: string
  valor?: number | string 
  children: ReactNode
}

export default function AdminLayout({ titulo, children, valor }: Props) {
  return (
    <div className="min-h-screen flex bg-[#f4f3ee] text-gray-900">
      <AdminSidebar valor={valor} />

      <div className="flex-1 min-w-0">
        <header className="px-6 md:px-10 py-5 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{titulo}</h2>
        </header>

        {children}
      </div>
    </div>
  )
}
