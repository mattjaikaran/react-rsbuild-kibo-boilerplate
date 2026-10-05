import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useSetTheme, useTheme } from '@/lib/store'

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  taskReminders: z.boolean(),
})
const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['en', 'es', 'fr', 'de']),
})

export function NotificationSettings() {
  const form = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      taskReminders: true,
    },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Preview preferences for this visit. This demo does not send notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) =>
            form.reset(values, { keepIsSubmitSuccessful: true }),
          )}
          className="space-y-6"
        >
          {(
            [
              { name: 'emailNotifications', label: 'Email Notifications' },
              { name: 'pushNotifications', label: 'Push Notifications' },
              { name: 'weeklyDigest', label: 'Weekly Digest' },
              { name: 'taskReminders', label: 'Task Reminders' },
            ] as const
          ).map(({ name, label }) => (
            <div key={name} className="flex items-center justify-between">
              <Label htmlFor={name}>{label}</Label>
              <input id={name} type="checkbox" {...form.register(name)} />
            </div>
          ))}
          <Button type="submit">Save Preferences</Button>
          {form.formState.isSubmitSuccessful && (
            <output className="block">
              Notification preferences saved for this visit only. No notifications will be sent.
            </output>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export function AppearanceSettings() {
  const theme = useTheme()
  const setTheme = useSetTheme()
  const form = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: { theme, language: 'en' },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the theme on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => {
            setTheme(values.theme)
            form.reset(values, { keepIsSubmitSuccessful: true })
          })}
          className="space-y-6"
        >
          <fieldset>
            <legend className="mb-4 font-medium">Theme</legend>
            <div className="grid grid-cols-3 gap-4">
              {(['light', 'dark', 'system'] as const).map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2 rounded-lg border p-4 capitalize"
                >
                  <input type="radio" value={value} {...form.register('theme')} />
                  {value}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="space-y-2">
            <Label htmlFor="settings-language">Language preference</Label>
            <select
              id="settings-language"
              className="w-full rounded-md border bg-background p-2"
              {...form.register('language')}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
            <p className="text-sm text-muted-foreground">
              Preference preview only; demo content remains in English.
            </p>
          </div>
          <Button type="submit">Save Preferences</Button>
          {form.formState.isSubmitSuccessful && (
            <output className="block">
              Theme saved on this device. Language preference saved for this visit only.
            </output>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
