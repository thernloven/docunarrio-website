import Image from "next/image";
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Rui Delgado Lopes",
    role: "Co-founder",
    image: "/team/rui.jpeg",
    linkedin: "https://www.linkedin.com/in/ruidelgadolopes/",
  },
  {
    name: "Elson Ferreira",
    role: "Co-founder",
    image: "/team/elson.png",
    linkedin: "https://www.linkedin.com/in/elsonferreira/",
  },
  {
    name: "Michell Blomberg",
    role: "Co-founder",
    image: "/team/michell.png",
    linkedin: "https://www.linkedin.com/in/michell-blomberg-0b860923/",
  },
  {
    name: "Lukas Thérn Loven",
    role: "Co-founder",
    image: "/team/lukas.jpeg",
    linkedin: "https://www.linkedin.com/in/lukasthernloven/",
  },
];

export default function About() {
  return (
    <section id="about" className="py-30">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* About text */}
        <div className="max-w-[720px] mx-auto text-center mb-20 reveal-up">
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
            About Us
          </span>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.025em] mb-6">
            Who we are
          </h2>
          <div className="text-[16px] text-text-secondary leading-[1.8] space-y-5 text-left">
            <p>
              Docunarrio is a Scandinavian tech company building private,
              human-centric AI for intelligent document search.
            </p>
            <p>
              Born from real operational challenges in highly regulated and
              information-dense environments, we help organizations instantly
              find the exact information they need across complex manuals, PDFs,
              and text-heavy documentation — without relying on outdated keyword
              search.
            </p>
            <p>
              Our platform enables natural language search, precise answers, and
              contextual understanding — all within a secure and fully private
              environment. Designed to integrate seamlessly into existing
              workflows, Docunarrio empowers professionals to work faster,
              safer, and with greater confidence.
            </p>
            <p className="font-medium text-text-primary">
              Inspired by aviation. Crafted for organizations that demand
              clarity, control, and trust.
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="reveal-up">
          <h3 className="text-center text-[clamp(22px,2.5vw,30px)] font-extrabold leading-[1.2] tracking-[-0.02em] mb-12">
            The Docunarrio Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[900px] mx-auto">
            {team.map((member, i) => (
              <div
                key={member.name}
                data-delay={i * 80}
                className="reveal-up group bg-white border border-border/40 rounded-2xl p-8 text-center transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-border/30">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-[16px] font-bold tracking-[-0.01em] mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-text-secondary mb-4">
                  {member.role}
                </p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent/5 text-accent hover:bg-accent hover:text-white transition-all"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  <Linkedin size={18} strokeWidth={1.5} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
