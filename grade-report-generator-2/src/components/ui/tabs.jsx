import { createContext, useContext, useState } from 'react'

const TabsContext = createContext(null)

export function Tabs({ defaultValue, value: controlled, onValueChange, children, className = '' }) {
  const [internal, setInternal] = useState(defaultValue)
  const value = controlled ?? internal
  const setValue = (v) => {
    setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '' }) {
  return (
    <div
      className={`inline-flex h-11 w-full items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600 ${className}`}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className = '' }) {
  const ctx = useContext(TabsContext)
  const active = ctx.value === value
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={`inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all ${
        active ? 'bg-white text-indigo-700 shadow' : 'hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className = '' }) {
  const ctx = useContext(TabsContext)
  if (ctx.value !== value) return null
  return <div className={`mt-4 ${className}`}>{children}</div>
}
