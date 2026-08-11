export function Select({ value, onValueChange, children }) {
  // simplified: children are SelectItem elements; we extract options
  const options = []
  const walk = (nodes) => {
    if (!nodes) return
    const arr = Array.isArray(nodes) ? nodes : [nodes]
    arr.forEach((n) => {
      if (!n) return
      if (n.type?.displayName === 'SelectItem' || n.props?.value !== undefined) {
        if (n.props?.value !== undefined) options.push({ value: n.props.value, label: n.props.children })
      }
      if (n.props?.children) walk(n.props.children)
    })
  }
  walk(children)

  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function SelectTrigger({ children }) {
  return children
}
export function SelectValue() {
  return null
}
export function SelectContent({ children }) {
  return children
}
export function SelectItem({ children }) {
  return children
}
SelectItem.displayName = 'SelectItem'
