import { useRouter } from 'next/dist/client/router.js'
import { useMemo } from 'react'

import type { Link, Links } from 'shared/types/index.js'
import { Tree } from './Tree/index.js'
import { Link as DocLink } from './Link/index.js'

interface DocLinkTreeProps {
  links: Links
}

export function DocLinkTree({ links }: DocLinkTreeProps) {
  const router = useRouter()
  const docParam = router.query.doc
  const linkLists = useMemo(() => Object.values(links) as Link[][], [links])

  const activeLinkTitle = useMemo(() => {
    const flattenLinks = linkLists.flat()

    if (Array.isArray(docParam)) {
      const docSlug = docParam.join('/')
      return flattenLinks.find((link) => link.url === docSlug)?.title
    }

    if (typeof docParam === 'string') {
      return flattenLinks.find((link) => link.url === docParam)?.title
    }

    return undefined
  }, [docParam, linkLists])

  return (
    <ul>
      {linkLists.map((linkGroup, groupIndex) => {
        if (linkGroup.length === 0) {
          return null
        }

        const sections = linkGroup.map(({ url }) => url.split('/').slice(0, -1))
        const groupKey =
          sections[0]?.join('/') ??
          linkGroup[0]?.url ??
          linkGroup[0]?.title ??
          `link-group-${groupIndex}`

        return (
          <li key={groupKey}>
            <div>
              <Tree
                sections={sections}
                renderLinks={(section) =>
                  linkGroup
                    .filter(({ url }) => url.includes(section))
                    .map(({ title, url }) => {
                      const linkHref = `/docs/${url}`

                      return (
                        <li key={linkHref}>
                          <DocLink href={linkHref} active={activeLinkTitle === title}>
                            {title}
                          </DocLink>
                        </li>
                      )
                    })
                }
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
