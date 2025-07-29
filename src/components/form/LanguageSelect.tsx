import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useChatStore } from '@/hooks'
import { Language } from '@/shared/schema'

export function LanguageSelect() {
  const language = useChatStore((state) => state.language)
  const setLanguage = useChatStore((state) => state.setLanguage)

  const handleValueChange = (value: Language) => {
    setLanguage(value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="language">Language</Label>
      <Select value={language ?? undefined} onValueChange={handleValueChange}>
        <SelectTrigger id="language" className="w-xs">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {Language.options.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
