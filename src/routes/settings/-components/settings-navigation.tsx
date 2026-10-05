import { cn } from '@/lib/utils'
import { Bell, Palette, Shield, User } from 'lucide-react'
import type { ElementType } from 'react'

export type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance'

const tabs: { id: SettingsTab; label: string; icon: ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

export function SettingsNavigation({
  activeTab,
  onSelect,
}: {
  activeTab: SettingsTab
  onSelect: (tab: SettingsTab) => void
}) {
  return (
    <nav className="shrink-0 lg:w-64">
      <div className="space-y-1 lg:sticky lg:top-24">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <tab.icon className="size-5" />
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
