"use client"

import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "./ui/input"

interface SearchBarProps {
  className?: string
  placeholder?: string
  onChange?(value: string): void
}

const SearchBar = ({
  className,
  placeholder = "Search",
  onChange,
}: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-4 top-3 size-4 text-grey-2" />
      <Input
        placeholder={placeholder}
        className={cn("h-10 rounded-full pl-11", className)}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
