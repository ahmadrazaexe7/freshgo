type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">{description}</p>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

