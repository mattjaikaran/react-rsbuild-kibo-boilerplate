import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Briefcase, Code2, Mail, MessageCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  subject: z.string().trim().min(1),
  message: z.string().trim().min(1),
})

// TanStack file-router registration requires Route; its plugin owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

export function ContactPage() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: '', lastName: '', email: '', subject: '', message: '' },
  })
  const handleSubmit = form.handleSubmit((values) =>
    form.reset(values, { keepIsSubmitSuccessful: true }),
  )

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Get in touch with questions, feedback, or collaboration ideas
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    {...form.register('firstName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Your last name"
                    {...form.register('lastName')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register('email')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  {...form.register('subject')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  {...form.register('message')}
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
              {Object.keys(form.formState.errors).length > 0 && (
                <p role="alert">Complete all fields and enter a valid email address.</p>
              )}
              {form.formState.isSubmitSuccessful && (
                <output className="block">
                  Message preview accepted locally. This demo has not sent an email or contacted a
                  server.
                </output>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-x-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">hello@example.com</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="mb-3 font-medium">Follow us</p>
                <div className="flex gap-x-4">
                  <a
                    aria-label="GitHub"
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Code2 className="size-5" />
                  </a>
                  <a
                    aria-label="Twitter"
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <MessageCircle className="size-5" />
                  </a>
                  <a
                    aria-label="LinkedIn"
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Briefcase className="size-5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">How can I contribute?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check out our GitHub repository for contribution guidelines and open issues.
                </p>
              </div>

              <div>
                <p className="font-medium">Is this free to use?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yes! This boilerplate is open source and free to use for any project.
                </p>
              </div>

              <div>
                <p className="font-medium">Can I customize it?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Absolutely! The boilerplate is designed to be easily customizable and extensible.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
