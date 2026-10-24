import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../components/Button';
import styles from './Tokens.module.css';
import {
  baseColors,
  borderWidth,
  breakpoints,
  cssVariables,
  duration,
  easing,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  palette,
  lightColors,
  radius,
  shadows,
  sizes,
  spacing,
  themeVariables,
  themes,
  zIndex,
  type CssVariable,
  type ThemeName,
} from '.';

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Every visual decision is a design token, exposed as a CSS custom property (`var(--space-4)`) and as a JavaScript object (`import { spacing } from '@vitinnczk/ui'`). Components only use semantic colors, never the palette, so a theme only redefines the semantic layer. Use the theme switcher in the toolbar to see the palette and scales in both themes.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const cssVar = (name: CssVariable) => `var(${name})`;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </section>
  );
}

function Swatch({ name, label }: { name: CssVariable; label: string }) {
  return (
    <li className={styles.item}>
      <div className={styles.swatch} style={{ background: cssVar(name) }} />
      <span className={styles.label}>{label}</span>
      <code className={styles.meta}>{name}</code>
      <code className={styles.meta}>{cssVariables[name]}</code>
    </li>
  );
}

export const Palette: Story = {
  render: () => (
    <div className={styles.page}>
      <Section title="Base">
        <ul className={styles.grid}>
          {Object.keys(baseColors).map((color) => (
            <Swatch key={color} name={`--color-${color}`} label={color} />
          ))}
        </ul>
      </Section>
      {Object.entries(palette).map(([color, scale]) => (
        <Section key={color} title={color}>
          <ul className={styles.grid}>
            {Object.keys(scale).map((step) => (
              <Swatch key={step} name={`--color-${color}-${step}`} label={step} />
            ))}
          </ul>
        </Section>
      ))}
    </div>
  ),
};

const themeNames = Object.keys(themes) as ThemeName[];

export const SemanticColors: Story = {
  render: () => (
    <div className={styles.page}>
      <Section
        title="Semantic colors"
        description="What components use. Each theme points them at the palette; every swatch is shown on its own theme."
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Token</th>
              {themeNames.map((theme) => (
                <th key={theme} scope="col">
                  {theme}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(lightColors).map((token) => {
              const name: CssVariable = `--color-${token}`;
              return (
                <tr key={token}>
                  <th scope="row">
                    <code className={styles.token}>{name}</code>
                  </th>
                  {themeNames.map((theme) => (
                    <td key={theme} data-theme={theme} className={styles.themed}>
                      <div className={styles.item}>
                        <div className={styles.swatch} style={{ background: cssVar(name) }} />
                        <code className={styles.meta}>{themeVariables[theme][name]}</code>
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>
    </div>
  ),
};

function Scale({
  title,
  description,
  values,
  prefix,
  preview,
}: {
  title: string;
  description?: ReactNode;
  values: Record<string, string>;
  prefix: string;
  preview?: (variable: string) => ReactNode;
}) {
  return (
    <Section title={title} description={description}>
      <ul className={styles.rows}>
        {Object.entries(values).map(([key, value]) => (
          <li key={key} className={styles.row}>
            <span className={styles.item}>
              <code className={styles.token}>{`--${prefix}-${key}`}</code>
              <code className={styles.meta}>{value}</code>
            </span>
            {preview?.(`var(--${prefix}-${key})`)}
          </li>
        ))}
      </ul>
    </Section>
  );
}

const sampleText = 'The quick brown fox jumps over the lazy dog';

export const Typography: Story = {
  render: () => (
    <div className={styles.page}>
      <Scale
        title="Font family"
        values={fontFamily}
        prefix="font-family"
        preview={(value) => (
          <p className={styles.sample} style={{ fontFamily: value }}>
            {sampleText}
          </p>
        )}
      />
      <Scale
        title="Font size"
        description="In rem, so text follows the browser font size."
        values={fontSize}
        prefix="font-size"
        preview={(value) => (
          <p className={styles.sample} style={{ fontSize: value }}>
            {sampleText}
          </p>
        )}
      />
      <Scale
        title="Font weight"
        values={fontWeight}
        prefix="font-weight"
        preview={(value) => (
          <p className={styles.sample} style={{ fontWeight: value }}>
            {sampleText}
          </p>
        )}
      />
      <Scale
        title="Line height"
        values={lineHeight}
        prefix="line-height"
        preview={(value) => (
          <p className={styles.sample} style={{ lineHeight: value }}>
            {sampleText}. {sampleText}. {sampleText}.
          </p>
        )}
      />
      <Scale
        title="Letter spacing"
        values={letterSpacing}
        prefix="letter-spacing"
        preview={(value) => (
          <p className={styles.sample} style={{ letterSpacing: value }}>
            {sampleText}
          </p>
        )}
      />
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className={styles.page}>
      <Scale
        title="Spacing (4px grid)"
        values={spacing}
        prefix="space"
        preview={(value) => <div className={styles.bar} style={{ width: value }} />}
      />
    </div>
  ),
};

function Box({ style }: { style: CSSProperties }) {
  return <div className={styles.box} style={{ borderRadius: cssVar('--radius-md'), ...style }} />;
}

export const RadiusAndShadows: Story = {
  name: 'Radius and shadows',
  render: () => (
    <div className={styles.page}>
      <Scale
        title="Border radius"
        values={radius}
        prefix="radius"
        preview={(value) => <Box style={{ borderRadius: value }} />}
      />
      <Scale
        title="Shadows"
        description="Their color comes from --shadow-color, which each theme sets."
        values={shadows}
        prefix="shadow"
        preview={(value) => <Box style={{ boxShadow: value }} />}
      />
    </div>
  ),
};

function MotionDemo() {
  const [moved, setMoved] = useState(false);

  const track = (style: CSSProperties) => (
    <div className={styles.track}>
      <div className={styles.dot} data-moved={moved || undefined} style={style} />
    </div>
  );

  return (
    <div className={styles.page}>
      <div>
        <Button variant="outline" aria-pressed={moved} onClick={() => setMoved(!moved)}>
          Play transitions
        </Button>
      </div>
      <Scale
        title="Duration"
        description="Under prefers-reduced-motion: reduce, every duration becomes 0.01ms."
        values={duration}
        prefix="duration"
        preview={(value) =>
          track({
            transitionDuration: value,
            transitionTimingFunction: cssVar('--easing-standard'),
          })
        }
      />
      <Scale
        title="Easing"
        values={easing}
        prefix="easing"
        preview={(value) =>
          track({
            transitionDuration: cssVar('--duration-slower'),
            transitionTimingFunction: value,
          })
        }
      />
    </div>
  );
}

export const Motion: Story = {
  render: () => <MotionDemo />,
};

export const ZIndex: Story = {
  name: 'Z-index',
  render: () => (
    <div className={styles.page}>
      <Section
        title="Z-index"
        description="Stacking order of floating layers, lowest to highest. Each layer below uses its token."
      >
        <div className={styles.stack}>
          {Object.entries(zIndex).map(([key, value], index) => (
            <div
              key={key}
              className={styles.layer}
              style={{
                zIndex: cssVar(`--z-index-${key}`),
                insetBlockStart: `calc(${index} * var(--space-8))`,
                insetInlineStart: `calc(${index} * var(--space-8))`,
              }}
            >
              <code className={styles.token}>{`--z-index-${key}`}</code>
              <code className={styles.meta}>{value}</code>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={styles.page}>
      <Scale
        title="Sizes"
        description="Icons, controls, the minimum touch target and the widths of floating layers."
        values={sizes}
        prefix="size"
        preview={(value) => <div className={styles.bar} style={{ width: value }} />}
      />
      <Scale
        title="Border width"
        values={borderWidth}
        prefix="border-width"
        preview={(value) => (
          <div className={styles.line} style={{ borderBlockStartWidth: value }} />
        )}
      />
      <Scale
        title="Breakpoints"
        description="Minimum viewport widths. Media queries can't read custom properties, so they repeat these values."
        values={breakpoints}
        prefix="breakpoint"
      />
    </div>
  ),
};
