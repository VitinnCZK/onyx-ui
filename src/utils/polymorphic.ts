import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from 'react';

export type PolymorphicRef<As extends ElementType> = ComponentPropsWithRef<As>['ref'];

export type PolymorphicProps<As extends ElementType, Props = object> = Props & {
  /** Element or component rendered in place of the default one. */
  as?: As;
} & Omit<ComponentPropsWithoutRef<As>, keyof Props | 'as'>;

export type PolymorphicPropsWithRef<As extends ElementType, Props = object> = PolymorphicProps<
  As,
  Props
> & {
  ref?: PolymorphicRef<As>;
};

export interface PolymorphicComponent<DefaultAs extends ElementType, Props = object> {
  <As extends ElementType = DefaultAs>(props: PolymorphicPropsWithRef<As, Props>): ReactNode;
  displayName?: string;
}
