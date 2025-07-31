import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

import { useChatStore } from '@/hooks'
import { Level } from '@/shared/schema'

export function LevelSelect() {
  const level = useChatStore((state) => state.level)
  const setLevel = useChatStore((state) => state.setLevel)

  const handleValueChange = (value: Level) => {
    setLevel(value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="level">Level</Label>
      <Select value={level ?? undefined} onValueChange={handleValueChange}>
        <SelectTrigger id="level" className="w-xs">
          <SelectValue placeholder="Select a level" />
        </SelectTrigger>
        <SelectContent>
          {Level.options.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
