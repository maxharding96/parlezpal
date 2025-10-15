import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useChatStore } from '@/hooks'
import { chatProviderEnum, type ChatProvider } from '@/shared/schema'

export function ChatProviderSelect() {
  const provider = useChatStore((state) => state.provider)
  const setProvider = useChatStore((state) => state.setProvider)

  const handleValueChange = (value: ChatProvider) => {
    setProvider(value)
  }

  const valueToLabel = (provider: ChatProvider) => {
    switch (provider) {
      case 'gemini':
        return 'Google Gemini (Recommended)'
      case 'openai':
        return 'Open AI'
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="chat provider">Chat Provider</Label>
      <Select value={provider} onValueChange={handleValueChange}>
        <SelectTrigger id="language" className="w-xs">
          <SelectValue placeholder="Select a chat provider" />
        </SelectTrigger>
        <SelectContent>
          {chatProviderEnum.options.map((provider) => (
            <SelectItem key={provider} value={provider}>
              {valueToLabel(provider)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
