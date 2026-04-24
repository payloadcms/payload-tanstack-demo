import { HeaderClient } from './HeaderClient'
import React from 'react'

export function Header({ data }: { data?: any }) {
  return <HeaderClient data={data || { navItems: [] }} />
}
