// "Label: detail" bullet points render the label in full ink.
export default function LabeledPoint({ text }: { text: string }) {
  const split = text.indexOf(': ');
  if (split === -1) return <>{text}</>;
  return (
    <>
      <span className="text-ink">{text.slice(0, split)}</span>: {text.slice(split + 2)}
    </>
  );
}
