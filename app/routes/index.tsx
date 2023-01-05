import { useLoaderData } from '@remix-run/react'
import { parse } from 'node-html-parser'
import { makeApi } from '~/lib/helpers'
import * as z from 'zod'

const environment = () =>
  z
    .object({
      MAILCHIMP_API_KEY: z.string(),
      MAILCHIMP_SUBDOMAIN: z.string(),
      MAILCHIMP_FOLDER_ID: z.string(),
    })
    .parse(process.env)

const api = makeApi(
  `https://${environment().MAILCHIMP_SUBDOMAIN}.api.mailchimp.com/3.0`,
  {
    Authorization: `Bearer ${environment().MAILCHIMP_API_KEY}-${
      environment().MAILCHIMP_SUBDOMAIN
    }`,
  },
)

export const loader = async () => {
  const { campaigns } = await api(`/campaigns`, {
    query: {
      status: 'sent',
      sort_field: 'send_time',
      sort_dir: 'DESC',
      folder_id: environment().MAILCHIMP_FOLDER_ID,
    },
  }).parse(
    z.object({
      campaigns: z.array(z.object({ long_archive_url: z.string() })),
    }),
  )

  try {
    const res = await fetch(campaigns[0].long_archive_url)

    if (res.headers.get('accept-ranges') === 'bytes') {
      return new Response(res.body, { headers: res.headers })
    } else {
      const root = parse(await res.text())
      root
        .querySelectorAll('#awesomewrap, .mcnPreviewText')
        .map((el) => el.remove())

      const bodyWithRewrittenLinks = (
        root.querySelector('body > center')?.toString() ?? ''
      ).replace(/Você está.+\./g, '')

      return new Response(bodyWithRewrittenLinks, { headers: res.headers })
    }
  } catch (error) {
    console.error(error)

    throw new Response('Not found', { status: 404 })
  }
}

export default function () {
  const data = useLoaderData()
  return <div dangerouslySetInnerHTML={{ __html: data }} />
}
