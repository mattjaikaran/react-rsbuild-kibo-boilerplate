import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
})
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  })

export function ProfileSettings() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com' },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Preview changes locally. No account server is connected.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              form.reset(values, { keepIsSubmitSuccessful: true }),
            )}
            className="space-y-4"
          >
            {(['firstName', 'lastName', 'email'] as const).map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {name === 'firstName'
                        ? 'First Name'
                        : name === 'lastName'
                          ? 'Last Name'
                          : 'Email'}
                    </FormLabel>
                    <FormControl>
                      <Input type={name === 'email' ? 'email' : 'text'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Save Changes</Button>
            {form.formState.isSubmitSuccessful && (
              <output className="block">
                Profile preview updated for this visit only; no server account was changed.
              </output>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export function SecuritySettings() {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })
  const submit = () => {
    form.reset(undefined, { keepIsSubmitSuccessful: true })
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Validate a password change without sending credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {name === 'currentPassword'
                          ? 'Current Password'
                          : name === 'newPassword'
                            ? 'New Password'
                            : 'Confirm New Password'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete={
                            name === 'currentPassword' ? 'current-password' : 'new-password'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit">Validate Password Change</Button>
              {form.formState.isSubmitSuccessful && (
                <output className="block">
                  Password validation passed. Credentials were cleared; your real password was not
                  changed.
                </output>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Connect an authentication provider to enable 2FA. This demo does not enroll accounts.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
