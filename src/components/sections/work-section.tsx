import { useReveal } from "@/hooks/use-reveal"

const PHOTOS = [
  "https://cdn.poehali.dev/projects/4aea8f52-05ac-4b65-a1c0-fff1f39adb30/files/1dff314c-c76d-419f-b981-08251d192d9d.jpg",
  "https://cdn.poehali.dev/projects/4aea8f52-05ac-4b65-a1c0-fff1f39adb30/files/2704bc50-88f3-46c1-804e-022a9fbc11b9.jpg",
]

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Случаи
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Истории наших пациентов</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4 md:space-y-6">
            {[
              {
                number: "01",
                title: "Михаил, 34 года",
                category: "Протез нижней конечности",
                year: "2024",
                direction: "left",
              },
              {
                number: "02",
                title: "Светлана, 52 года",
                category: "Ортопедический корсет",
                year: "2024",
                direction: "right",
              },
              {
                number: "03",
                title: "Александр, 28 лет",
                category: "Протез верхней конечности",
                year: "2023",
                direction: "left",
              },
            ].map((project, i) => (
              <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
            ))}
          </div>

          <div
            className={`hidden flex-col gap-4 md:flex transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            {PHOTOS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Пациент центра КулАяк ${i + 1}`}
                className="h-36 w-48 rounded-xl object-cover shadow-md lg:h-44 lg:w-56"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: { number: string; title: string; category: string; year: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`group flex items-center justify-between border-b border-foreground/10 py-5 transition-all duration-700 hover:border-foreground/20 md:py-6 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
          {project.number}
        </span>
        <div>
          <h3 className="mb-1 font-sans text-2xl font-light text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-3xl lg:text-4xl">
            {project.title}
          </h3>
          <p className="font-mono text-xs text-foreground/50 md:text-sm">{project.category}</p>
        </div>
      </div>
      <span className="font-mono text-xs text-foreground/30 md:text-sm">{project.year}</span>
    </div>
  )
}
