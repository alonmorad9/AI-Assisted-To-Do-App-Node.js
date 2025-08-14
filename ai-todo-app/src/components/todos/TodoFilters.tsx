import React from 'react'
import { TodoFilter } from '../../types'
import { Button } from '../ui/Button'

interface TodoFiltersProps {
  currentFilter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
  todoCounts: {
    all: number
    active: number
    completed: number
    dueToday: number
    highPriority: number
  }
}

export function TodoFilters({ currentFilter, onFilterChange, todoCounts }: TodoFiltersProps) {
  const filters = [
    { key: 'all' as TodoFilter, label: 'All', count: todoCounts.all },
    { key: 'active' as TodoFilter, label: 'Active', count: todoCounts.active },
    { key: 'completed' as TodoFilter, label: 'Completed', count: todoCounts.completed },
    { key: 'due-today' as TodoFilter, label: 'Due Today', count: todoCounts.dueToday },
    { key: 'priority' as TodoFilter, label: 'High Priority', count: todoCounts.highPriority },
  ]

  const containerStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
  }

  const filtersStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  }

  const filterButtonStyle = (isActive: boolean) => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: isActive ? '#3b82f6' : 'white',
    color: isActive ? 'white' : '#374151',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  })

  const badgeStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'inherit',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    minWidth: '1.25rem',
    textAlign: 'center' as const,
  }

  return (
    <div style={containerStyle}>
      <h3 style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        color: '#1f2937', 
        marginBottom: '0.75rem' 
      }}>
        Filter Todos
      </h3>
      
      <div style={filtersStyle}>
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            style={filterButtonStyle(currentFilter === filter.key)}
          >
            {filter.label}
            <span style={badgeStyle}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}