import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'

import { User } from 'lucide-react'
import { useId, type HTMLProps } from 'react'

export const SignInInput = ({
  label,
  className,
  error,
  ...inputProps
}: {
  label: string
  placeholder?: string
  className?: string
  error?: string | null
} & HTMLProps<HTMLInputElement>) => {
  const id = useId()
  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel htmlFor={id} className='text-lg'>
        {label}
      </FieldLabel>
      <div className='relative'>
        <User
          className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
          size={24}
        />
        <Input
          className='h-14 pl-13 md:text-lg'
          {...inputProps}
          aria-invalid={!!error}
          id={id}
        />
      </div>
      {!!error && <FieldDescription>{error}</FieldDescription>}
    </Field>
  )
}
