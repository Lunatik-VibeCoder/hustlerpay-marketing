export interface Stat {
  label: string;
  value: string;
}

export interface StatsSectionMetadata {
  title?: string;
  stats: Stat[];
}

export function StatsSection({ metadata }: { metadata: StatsSectionMetadata }) {
  const { title, stats } = metadata;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        {title && <h2 className="text-2xl font-bold text-foreground mb-10 text-center">{title}</h2>}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
