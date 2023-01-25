import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet } from '@remix-run/react'
import styles from '~/styles.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Povo em Pé',
  viewport: 'width=device-width,initial-scale=1,maximum-scale=1',
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  )
}
