import NextLink from 'next/link'

import { Button, type ButtonProps } from './styles.js'

export function Link({ href, ...restOfProps }: ButtonProps) {
  return (
    <NextLink href={href} passHref>
      <Button {...restOfProps} />
    </NextLink>
  )
}
