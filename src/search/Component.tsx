'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useNavigate } from '@tanstack/react-router'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    navigate({ to: `/search${debouncedValue ? `?q=${debouncedValue}` : ''}` })
  }, [debouncedValue, navigate])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search"
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
