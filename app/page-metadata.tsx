// Server component that injects homepage JSON-LD
export function HomepageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://tools.manuchim.site/#website",
        url: "https://tools.manuchim.site",
        name: "ToolKit",
        description:
          "Free browser-based tools for developers and creators. No login required.",
        publisher: {
          "@type": "Organization",
          name: "ToolKit",
          url: "https://tools.manuchim.site",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://tools.manuchim.site/tools?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
