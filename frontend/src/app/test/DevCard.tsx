import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface DeveloperCardProps {
  id: string;
  name: string;
  position: string;
  image: string;
  skills: string[];
}

export function DeveloperCard({
  id,
  name,
  position,
  image,
  skills,
}: DeveloperCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="py-2 bg-card-foreground group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
      <CardContent className="p-6 text-center">
        {/* Profile Image */}
        <div className="mb-4 w-32 h-32 mx-auto">
          <Image
            src={image}
            alt="img"
            className="w-full h-full object-cover rounded-full mx-auto"
            width={200}
            height={200}
          />
        </div>

        {/* Name and Position */}
        <div className="mb-4">
          <h3 className="text-lg text-black font-boldmb-1 text-balance">
            {name}
          </h3>
          <p className="text-sm font-medium text-orange-500 mb-2">{position}</p>
          <p className="text-xs text-black/80 font-mono">ID: {id}</p>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-black">Skills</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-orange-500/70 text-orange-50 hover:bg-primary/20 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
