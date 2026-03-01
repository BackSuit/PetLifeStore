import Document, { Head, Html, Main, NextScript } from "next/document"
import { Fragment } from "react"
import { GA_TRACKING_ID } from "src/libs/gtag.js"

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const isProduction = process.env.NODE_ENV === "production"

    return {
      ...initialProps,
      isProduction,
    }
  }

  render() {
    const { isProduction } = this.props

    return (
      <Html lang="en">
        <Head>
          {/* Google Fonts for editorial typography */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap"
            rel="stylesheet"
          />

          <link
            rel="shortcut icon"
            href="/meta/favicon.ico"
            type="image/x-icon"
          />
          <link rel="icon" href="/meta/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="/meta/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />

          {/* We only want to add the scripts if in production */}
          {isProduction && GA_TRACKING_ID && (
            <Fragment>
              <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8695710654350407"
                crossOrigin="anonymous"
              ></script>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </Fragment>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* Skimlinks affiliate script - only loads in production */}
          {isProduction && (
            <script
              type="text/javascript"
              src="https://s.skimresources.com/js/297702X1785198.skimlinks.js"
            />
          )}
        </body>
      </Html>
    )
  }
}
