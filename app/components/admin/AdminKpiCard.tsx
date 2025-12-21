type IconName = "calendar" | "money" | "mail" | "map";

function Icon({ name }: { name: IconName }) {
  const common = "h-5 w-5";

  if (name === "calendar")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 8H5v10h14V10Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "money")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm1 17.93V20h-2v-1.07c-1.943-.31-3.276-1.62-3.4-3.32H9.6c.09.85.79 1.53 2.4 1.53 1.7 0 2.3-.68 2.3-1.36 0-.71-.38-1.09-2.6-1.62-2.46-.6-4.22-1.52-4.22-3.59 0-1.67 1.3-2.89 3.32-3.23V4h2v1.09c2.12.36 3.18 1.77 3.28 3.1h-1.98c-.1-.9-.7-1.5-2.3-1.5-1.5 0-2.2.54-2.2 1.28 0 .69.58 1.04 2.6 1.54 2.02.5 4.22 1.28 4.22 3.66 0 1.78-1.25 3.09-3.32 3.44Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "mail")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"
          fill="currentColor"
        />
      </svg>
    );

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14.5a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AdminKpiCard({
  title,
  value,
  delta,
  icon,
}: {
  title: string;
  value: string;
  delta: string;
  icon: IconName;
}) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
            {title}
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
            {value}
          </div>
          <div className="mt-1 text-xs font-semibold text-emerald-700">
            ↑ {delta}
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[var(--color-primary)]">
          <Icon name={icon} />
        </div>
      </div>
    </div>
  );
}
