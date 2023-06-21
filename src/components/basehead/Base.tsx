import Head from 'next/head'

type BaseHeadProps = {
  title: string
  description: string
  pageTitle?: string
}

export const BaseHead = ({ title, description, pageTitle }: BaseHeadProps) => (
  <Head>
    <title>{`${title} ${pageTitle ? ` - ${pageTitle}` : ''}`}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
      integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
    <link rel="icon" href="/favicon.ico" />
  </Head>
)
