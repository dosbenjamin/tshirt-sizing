import type { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<'button'>

export const Button = (props: Props) => (
  <button className="block p-4 bg-zinc-700 text-white rounded-md" {...props} />
)
