import {
  DocsContainer as BaseDocsContainer,
  type DocsContainerProps,
} from '@storybook/addon-docs/blocks';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { create } from 'storybook/theming';
import { baseColors, palette } from '../src/tokens';

const docsThemes = {
  light: create({
    base: 'light',
    brandTitle: '@vitinnczk/ui',
    appContentBg: baseColors.white,
    colorSecondary: palette.primary[600],
  }),
  dark: create({
    base: 'dark',
    brandTitle: '@vitinnczk/ui',
    appContentBg: palette.neutral[900],
    appPreviewBg: palette.neutral[900],
    colorSecondary: palette.primary[400],
  }),
};

type GlobalsEvent = [{ globals: Record<string, unknown> }] | undefined;

/** Docs pages follow the toolbar theme, so components are shown on a matching background. */
export function DocsContainer({ context, ...props }: PropsWithChildren<DocsContainerProps>) {
  const { channel } = context;
  const [theme, setTheme] = useState(() => {
    const [latest] =
      (channel.last(GLOBALS_UPDATED) as GlobalsEvent) ??
      (channel.last(SET_GLOBALS) as GlobalsEvent) ??
      [];
    return latest?.globals.theme;
  });

  useEffect(() => {
    const onGlobals = ({ globals }: { globals: Record<string, unknown> }) =>
      setTheme(globals.theme);
    channel.on(GLOBALS_UPDATED, onGlobals);
    return () => channel.off(GLOBALS_UPDATED, onGlobals);
  }, [channel]);

  return (
    <BaseDocsContainer
      {...props}
      context={context}
      theme={theme === 'dark' ? docsThemes.dark : docsThemes.light}
    />
  );
}
