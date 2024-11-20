"use client"

import { ComponentProps } from "react"

import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "./ui/input"

interface SearchBarProps extends ComponentProps<"input"> {
  className?: string
  placeholder?: string
  onValueChange?(value: string): void
}

const SearchBar = ({
  className,
  placeholder = "Search",
  onValueChange,
  ...props
}: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-4 top-3 size-4 text-grey-2" />
      <Input
        placeholder={placeholder}
        className={cn("h-10 rounded-full pl-11", className)}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      />
    </div>
  )
}

export default SearchBar
