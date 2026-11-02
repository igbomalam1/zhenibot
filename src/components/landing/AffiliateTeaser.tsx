import { useState } from 'react'

interface Integration {
  name: string
  category: 'Messaging' | 'Payments' | 'Spreadsheets & CRM' | 'Commerce & Logistics'
  description: string
}

const APPS: Integration[] = [
  { name: 'WhatsApp Business API', category: 'Messaging', description: 'Auto-reply to chats, share catalogs, collect order details & send reminders' },
  { name: 'Instagram Direct', category: 'Messaging', description: 'Instant answers to DMs and comment replies with automated buy links' },
  { name: 'Gmail & Google Workspace', category: 'Messaging', description: 'Monitor incoming quote emails, read PDF attachments & send professional replies' },
  { name: 'Outlook / Microsoft 365', category: 'Messaging', description: 'Enterprise inbox monitoring, automated notifications & quote forwarding' },
  { name: 'Paystack', category: 'Payments', description: 'Generate instant payment links, verify transactions & auto-issue digital receipts' },
  { name: 'Flutterwave', category: 'Payments', description: 'Accept local & card payments with automatic webhook status updates' },
  { name: 'Moniepoint & Kuda Webhooks', category: 'Payments', description: 'Instant bank transfer reconciliation without checking mobile apps manually' },
  { name: 'Google Sheets', category: 'Spreadsheets & CRM', description: 'Real-time sales entry, customer logs, order queues & staff activity sheets' },
  { name: 'Excel Online / OneDrive', category: 'Spreadsheets & CRM', description: 'Enterprise workbook synchronization across finance and sales teams' },
  { name: 'HubSpot & Zoho CRM', category: 'Spreadsheets & CRM', description: 'Auto-move leads from "New Message" to "Paid Deal" without human delay' },
  { name: 'Shopify & WooCommerce', category: 'Commerce & Logistics', description: 'Sync web store checkouts to WhatsApp order alerts and courier dispatch' },
  { name: 'Local Courier Fleets (SendMe / GIGL)', category: 'Commerce & Logistics', description: 'Automate parcel pickup requests and send tracking links to buyers' },
]

export function AffiliateTeaser() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Messaging', 'Payments', 'Spreadsheets & CRM', 'Commerce & Logistics']

  const filtered = selectedCategory === 'All'
    ? APPS
    : APPS.filter((app) => app.category === selectedCategory)

  return (
    <section id="integrations" className="w-full bg-white py-16 md:py-24 border-b border-black/10">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-4 mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-black">
            <span>Connects With Tools </span>
            <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">
              You Already Use
            </span>
          </h2>

          <div className="h-1 w-20 bg-[#459F34] md:mx-auto" />

          <p className="max-w-[700px] text-black/80 text-base md:text-lg">
            You don’t have to switch your favorite apps. We build bridge automations between the tools you and your customers use every day.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#459F34] text-white border-[#459F34]'
                  : 'bg-white text-black/70 border-black/10 hover:border-[#459F34] hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((app, index) => (
            <div
              key={index}
              className="p-6 border border-black/10 bg-white hover:border-[#459F34] hover:shadow-[0_4px_20px_rgba(69,159,52,0.1)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-bold uppercase text-black">
                  {app.name}
                </h4>
                <span className="text-[10px] uppercase font-bold text-[#459F34] bg-[#459F34]/10 px-2 py-0.5 border border-[#459F34]/20">
                  {app.category}
                </span>
              </div>
              <p className="text-xs text-black/70 leading-relaxed">
                {app.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
