import { DeveloperCard } from "./DevCard";

const developers = [
  {
    id: "S11219309",
    name: "Rudr Prasad",
    position: "Project Manager",
    image: "/test/rudr.jpg",
    skills: ["ReactJS", "ASP.NET", "JIRA", "Leadership", "MySQL"],
  },
  {
    id: "S11221067",
    name: "Rishal Prasad",
    position: "Full Stack",
    image: "/test/rishal.jpg",
    skills: ["ReactJS", "ASP.NET", "Risk Management"],
  },
  {
    id: "S11221529",
    name: "Ahad Ali",
    position: "Frontend Developer",
    image: "/test/ahad.jpg",
    skills: ["ReactJS", "Tailwind CSS", "Canva", "Figma"],
  },
  {
    id: "S11219885",
    name: "Rahul Chand",
    position: "Project Manager",
    image: "/file.svg",
    skills: ["MySQL", "DB Design", "DevOpps", "Azure", "GitHub"],
  },
  {
    id: "S11208753",
    name: "Saurav Shankar",
    position: "Project Manager",
    image: "/file.svg",
    skills: ["Unit Test", "Regression", "MS Word", "Risk Analysis"],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Meet Our Development Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Our talented team of developers, designers, and engineers work
            together to create innovative solutions and deliver exceptional
            digital experiences.
          </p>
        </div>

        {/* Developer Cards Grid */}
        <div className="flex flex-wrap">
          {developers.map((developer, index) => (
            <div key={developer.id} className={`w-full sm:w-1/2 lg:w-1/3 p-3 `}>
              <DeveloperCard
                id={developer.id}
                name={developer.name}
                position={developer.position}
                image={developer.image}
                skills={developer.skills}
              />
            </div>
          ))}
        </div>

        {/* Team Stats Section */}
        <div className="mt-20 bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Team Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">8</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                Projects Completed
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
