import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/shared/theme-toggle'

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  taskReminders: z.boolean(),
})
const appearanceSchema = z.object({
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
  const form = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: { language: 'en' },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the theme on this device.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">
              Follows your device until you switch. Changes are saved immediately on this device.
            </p>
          </div>
          <ThemeToggle />
        </div>
        <form
          onSubmit={form.handleSubmit((values) => {
            form.reset(values, { keepIsSubmitSuccessful: true })
          })}
          className="space-y-6"
        >
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
            <output className="block">Language preference saved for this visit only.</output>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
