type SectionHeadingProps = {
  kicker: string;
  title: string;
  accent?: string;
  description?: string;
};

export function SectionHeading({
  kicker,
  title,
  accent,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="kicker">{kicker}</p>
      <h2 className="display mt-3 text-[clamp(2.2rem,5vw,4.2rem)] tracking-[-0.05em]">
        {title}
        {accent ? (
          <>
            {" "}
            <em className="serif-italic">{accent}</em>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className="lede mt-4 text-lg text-muted">{description}</p>
      ) : null}
    </div>
  );
}
