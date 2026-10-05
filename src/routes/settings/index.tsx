import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SettingsNavigation } from './-components/settings-navigation'
import type { SettingsTab } from './-components/settings-navigation'
import { ProfileSettings, SecuritySettings } from './-components/account-settings'
import { AppearanceSettings, NotificationSettings } from './-components/preference-settings'

// TanStack file-router registration requires Route; its plugin owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/settings/')({ component: SettingsPage })

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <SettingsNavigation activeTab={activeTab} onSelect={setActiveTab} />
        <div className="max-w-2xl flex-1">
          <div hidden={activeTab !== 'profile'}>
            <ProfileSettings />
          </div>
          <div hidden={activeTab !== 'security'}>
            <SecuritySettings />
          </div>
          <div hidden={activeTab !== 'notifications'}>
            <NotificationSettings />
          </div>
          <div hidden={activeTab !== 'appearance'}>
            <AppearanceSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
