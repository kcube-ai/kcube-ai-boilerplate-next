import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { APP_NAME } from "@/config/app";
import { DIMENSIONS } from "@/constants/ui";

const faqs = [
  {
    question: `What is ${APP_NAME}?`,
    answer: `${APP_NAME} is a production-ready full-stack template combining FastAPI and Next.js 15. It provides authentication, modular architecture, and best practices to help you build SaaS applications quickly and confidently.`,
  },
  {
    question: "What features are included?",
    answer: `The template includes JWT authentication with email verification and 2FA, user management, password reset, modular backend architecture with layered design (API/Service/DB), PostgreSQL database with migrations, Redis rate limiting, SendGrid email integration, and a modern Next.js 15 frontend with TypeScript and Tailwind CSS.`,
  },
  {
    question: "How do I get started?",
    answer: `Clone the repository, copy .env.example to .env and configure your environment variables, run database migrations with Alembic, start the backend with uvicorn, and start the frontend with pnpm dev. Full setup instructions are available in the documentation.`,
  },
  {
    question: "Can I customize it for my needs?",
    answer: `Absolutely! The modular architecture makes it easy to add new features, modify existing ones, or remove what you don't need. Each module is self-contained with clear separation between API, service, and database layers.`,
  },
  {
    question: `Is it production-ready?`,
    answer: `Yes, ${APP_NAME} follows industry best practices with secure authentication, proper error handling, database migrations, rate limiting, Docker support, and comprehensive documentation. It's designed to be deployed to production with confidence.`,
  },
];

export function FAQSection() {
  return (
    <section id="faqs" className="py-16 lg:py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`bg-card ${DIMENSIONS.RADIUS_SM} border border-border px-6 py-2`}
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
