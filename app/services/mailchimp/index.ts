import * as z from 'zod'
import { makeApi } from '~/lib/helpers'
import { campaignSchema, envSchema } from './schemas'

const env = envSchema.parse(process.env)

const BASE_URL = `https://${env.MAILCHIMP_SUBDOMAIN}.api.mailchimp.com/3.0`

const api = makeApi(BASE_URL, {
  Authorization: `Bearer ${env.MAILCHIMP_API_KEY}-${env.MAILCHIMP_SUBDOMAIN}`,
})

function getSentCampaigns() {
  return api(`/campaigns`, {
    query: {
      status: 'sent',
      sort_field: 'send_time',
      sort_dir: 'DESC',
      folder_id: env.MAILCHIMP_FOLDER_ID,
    },
  }).parse(z.object({ campaigns: z.array(campaignSchema) }))
}

async function getLatestSentCampaign() {
  const { campaigns } = await getSentCampaigns()
  return campaigns[0]
}

export { getSentCampaigns, getLatestSentCampaign }
