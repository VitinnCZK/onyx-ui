import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import styles from './Tokens.module.css';
import {
  baseColors,
  cssVariables,
  fontSize,
  fontWeight,
  lineHeight,
  palette,
  radius,
  semanticColors,
  shadows,
  spacing,
  type CssVariable,
} from '.';

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const cssVar = (name: CssVariable) => `var(${name})`;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
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

export const SemanticColors: Story = {
  render: () => (
    <div className={styles.page}>
      <Section title="Semantic colors">
        <ul className={styles.grid}>
          {Object.keys(semanticColors).map((token) => (
            <Swatch key={token} name={`--color-${token}`} label={token} />
          ))}
        </ul>
      </Section>
    </div>
  ),
};

function Scale({
  title,
  values,
  prefix,
  preview,
}: {
  title: string;
  values: Record<string, string>;
  prefix: string;
  preview: (variable: string) => ReactNode;
}) {
  return (
    <Section title={title}>
      <ul className={styles.rows}>
        {Object.entries(values).map(([key, value]) => (
          <li key={key} className={styles.row}>
            <span className={styles.item}>
              <code className={styles.meta}>{`--${prefix}-${key}`}</code>
              <code className={styles.meta}>{value}</code>
            </span>
            {preview(`var(--${prefix}-${key})`)}
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
        title="Font size"
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
        values={shadows}
        prefix="shadow"
        preview={(value) => <Box style={{ boxShadow: value }} />}
      />
    </div>
  ),
};
