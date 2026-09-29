import { Fragment, type ReactNode } from "react";

// Answers arrive as Markdown: paragraphs, **bold**, *italic*, `code`, bullet
// and numbered lists, the odd heading. Small enough to render by hand, and
// nothing from the model is ever injected as HTML.

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={i++} className="font-semibold">{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={i++} className="font-mono text-[0.92em] bg-sand-tint px-1 py-0.5 rounded">{t.slice(1, -1)}</code>);
    else out.push(<em key={i++}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "ul"; items: { text: string; level: number }[] }
  | { kind: "ol"; items: { n: string; text: string }[] }
  | { kind: "hr" };

function parse(src: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: "p", text: para.join("\n") });
    para = [];
  };
  for (const raw of src.split(/\r?\n/)) {
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    if (!line) { flush(); continue; }
    let m: RegExpMatchArray | null;
    if (line.startsWith("#")) { flush(); blocks.push({ kind: "h", text: line.replace(/^#+\s*/, "") }); }
    else if (/^(-{3,}|\*{3,})$/.test(line)) { flush(); blocks.push({ kind: "hr" }); }
    else if ((m = line.match(/^[-*•]\s+(.*)$/))) {
      flush();
      const prev = blocks[blocks.length - 1];
      const item = { text: m[1], level: indent >= 2 ? 1 : 0 };
      if (prev?.kind === "ul") prev.items.push(item); else blocks.push({ kind: "ul", items: [item] });
    } else if ((m = line.match(/^(\d+[.)])\s+(.*)$/))) {
      flush();
      const prev = blocks[blocks.length - 1];
      const item = { n: m[1], text: m[2] };
      if (prev?.kind === "ol") prev.items.push(item); else blocks.push({ kind: "ol", items: [item] });
    } else para.push(line);
  }
  flush();
  return blocks;
}

export default function Markdown({ source }: { source: string }) {
  return (
    <div className="space-y-3 text-[16px] leading-[26px] text-ink">
      {parse(source).map((b, i) => {
        switch (b.kind) {
          case "h":
            return <h4 key={i} className="font-display text-[17px] font-semibold pt-1">{inline(b.text)}</h4>;
          case "hr":
            return <hr key={i} className="border-sand" />;
          case "ul":
            return (
              <ul key={i} className="space-y-1.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5" style={{ paddingLeft: it.level * 18 }}>
                    <span aria-hidden>•</span>
                    <span>{inline(it.text)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-1.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="tabular-nums">{it.n}</span>
                    <span>{inline(it.text)}</span>
                  </li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={i}>
                {b.text.split("\n").map((line, j) => (
                  <Fragment key={j}>{j > 0 && <br />}{inline(line)}</Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
