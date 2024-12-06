import { useEffect, useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type SettingOption<ValueType> = {
  label: string
  value: ValueType
}

interface SettingItemRadioProps<ValueType> {
  title: string
  type: "radio"
  value: ValueType
  options: SettingOption<ValueType>[]
  isLoading?: boolean
  onValueChange(value: ValueType): void
}

interface SettingItemCheckboxProps<ValueType> {
  title: string
  type: "checkbox"
  value: ValueType[]
  options: SettingOption<ValueType>[]
  isLoading?: boolean
  onValueChange(value: ValueType[]): void
}

type SettingItemProps<ValueType> =
  | SettingItemRadioProps<ValueType>
  | SettingItemCheckboxProps<ValueType>

const SettingItem = <ValueType,>({
  title,
  type,
  options,
  value: defaultValue,
  isLoading,
  onValueChange,
}: SettingItemProps<ValueType>) => {
  const [value, setValue] = useState<ValueType | ValueType[]>(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="flex flex-col gap-y-3 px-4 py-3">
      <h5 className="text-muted-foreground subtitle-1">{title}</h5>

      {type === "radio" && (
        <RadioGroup
          value={value as string}
          onValueChange={(v) => {
            onValueChange(v as ValueType)
            setValue(v as ValueType)
          }}
          className="gap-y-4"
          disabled={isLoading}
        >
          {options.map((option) => {
            const optionValue = String(option.value) as string

            return (
              <div key={optionValue} className="flex items-center gap-x-2.5">
                <RadioGroupItem
                  id={optionValue}
                  value={option.value as string}
                  className="size-4"
                />
                <Label htmlFor={optionValue} className="!body-1">
                  {option.label}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      )}

      {type === "checkbox" && (
        <div className="flex flex-col gap-y-4">
          {options.map((option) => {
            const optionValue = option.value as string

            return (
              <div key={optionValue} className="flex items-center gap-x-2.5">
                <Checkbox
                  id={optionValue}
                  value={optionValue}
                  className="size-4"
                  checked={
                    Array.isArray(value)
                      ? value.includes(option.value)
                      : undefined
                  }
                  disabled={isLoading}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onValueChange([...defaultValue, option.value])
                      setValue([...defaultValue, option.value])
                    } else {
                      setValue(defaultValue.filter((v) => v !== option.value))
                      onValueChange(
                        defaultValue.filter((v) => v !== option.value),
                      )
                    }
                  }}
                />
                <Label htmlFor={optionValue} className="!body-1">
                  {option.label}
                </Label>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SettingItem
