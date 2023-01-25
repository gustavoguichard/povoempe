import { useLoaderData } from '@remix-run/react'
import { parse } from 'node-html-parser'
import { cacheHeader } from 'pretty-cache-header'
import type { HeadersFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { getLatestSentCampaign } from '~/services/mailchimp'

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheHeader({
    public: true,
    maxAge: '30m',
    sMaxage: '10m',
    staleIfError: '1y',
    staleWhileRevalidate: '1y',
  }),
})

export const loader = async () => {
  try {
    const campaign = await getLatestSentCampaign()
    const res = await fetch(campaign.long_archive_url)

    const root = parse(await res.text())
    root
      .querySelectorAll('#awesomewrap, .mcnPreviewText')
      .map((el) => el.remove())

    const body = (
      root.querySelector('body > center')?.toString() ?? ''
    ).replace(/Você está.+\./g, '')

    return json({
      styles: root.querySelector('style')?.toString(),
      body,
    })
  } catch (error) {
    console.error(error)

    throw json('Not found', 404)
  }
}

export default function () {
  const { body, styles } = useLoaderData<typeof loader>()
  return (
    <>
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}
