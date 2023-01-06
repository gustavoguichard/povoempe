import * as z from 'zod'
import { makeApi } from '~/lib/helpers'

const envSchema = z.object({
  MAILCHIMP_API_KEY: z.string(),
  MAILCHIMP_SUBDOMAIN: z.string(),
  MAILCHIMP_FOLDER_ID: z.string(),
})

const campaignSchema = z.object({
  id: z.string(),
  web_id: z.coerce.number(),
  type: z.enum(['regular', 'plaintext', 'absplit', 'rss', 'variate']),
  create_time: z.string().datetime({ offset: true }),
  archive_url: z.string().url(),
  long_archive_url: z.string().url(),
  status: z.enum(['save', 'paused', 'schedule', 'sending', 'sent']),
  emails_sent: z.number(),
  send_time: z.string().datetime({ offset: true }),
  content_type: z.string(),
  resendable: z.boolean(),
  recipients: z.object({
    list_id: z.string(),
    list_is_active: z.boolean(),
    list_name: z.string(),
  }),
  settings: z.object({
    subject_line: z.string(),
    preview_text: z.string(),
    title: z.string(),
    from_name: z.string(),
    reply_to: z.string().email(),
  }),
})

export { envSchema, campaignSchema }
