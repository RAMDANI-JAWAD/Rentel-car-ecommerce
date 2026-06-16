import { useState } from 'react'
import { Mail, User, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error('Please fill in all fields.')
      return
    }
    toast.success('Message sent successfully! We will get back to you soon.')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="contact-hero-container">
      <div className="contact-glass">
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Contact Us</h1>
          <p className="mb-8 text-base text-white/70">
            Have a question or want to book a test drive? Send us a message.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-11 w-full rounded-lg pl-10 pr-4 text-sm outline-none transition-colors focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-11 w-full rounded-lg pl-10 pr-4 text-sm outline-none transition-colors focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3 h-4 w-4" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message..."
                rows={5}
                className="w-full resize-none rounded-lg pl-10 pr-4 pt-2.5 text-sm outline-none transition-colors focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
