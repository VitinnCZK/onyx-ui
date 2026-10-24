import { createContext, useContext } from 'react';
import { cn } from '@/utils/cn';

export interface FormFieldContextValue {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  disabled: boolean | undefined;
  required: boolean | undefined;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export interface FieldControlProps {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  'aria-describedby'?: string;
}

/** Merges the props of a form control with the ones its enclosing `FormField` provides. */
export function useFieldControl({
  id,
  disabled,
  required,
  invalid,
  'aria-describedby': describedBy,
}: FieldControlProps) {
  const field = useContext(FormFieldContext);
  const isInvalid = invalid ?? field?.invalid ?? false;

  return {
    id: id ?? field?.id,
    disabled: disabled ?? field?.disabled,
    required: required ?? field?.required,
    invalid: isInvalid,
    'aria-invalid': isInvalid || undefined,
    'aria-describedby': cn(field?.describedBy, describedBy) || undefined,
  };
}
