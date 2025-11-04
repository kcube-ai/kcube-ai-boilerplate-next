import { Database, Lock, Layers, Zap } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ANIMATIONS, DIMENSIONS } from "@/constants/ui";

const features = [
  {
    icon: Zap,
    title: "Fast Development",
    description:
      "Start building immediately with pre-configured authentication, database models, and API endpoints. No boilerplate setup required.",
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description:
      "Built-in JWT authentication, password hashing, email verification, 2FA support, and rate limiting to protect your application.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description:
      "Clean separation of concerns with API, service, and database layers. Easy to extend and maintain as your application grows.",
  },
  {
    icon: Database,
    title: "Production Ready",
    description:
      "PostgreSQL with migrations, Redis caching, Docker support, and comprehensive error handling. Deploy with confidence.",
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 lg:py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`border-border bg-card ${ANIMATIONS.HOVER_SHADOW} ${ANIMATIONS.TRANSITION_DEFAULT}`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto w-16 h-16 bg-primary/10 ${DIMENSIONS.RADIUS_SM} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
