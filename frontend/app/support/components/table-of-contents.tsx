interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function TableOfContents({
  sections,
  activeSection,
  onSectionClick,
}: TableOfContentsProps) {
  return (
    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-1">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Table of Contents
        </h2>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
        <div className="mt-8 bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Need Help?
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Contact our support team
          </p>
          <a
            href="mailto:support@sample.au"
            className="text-xs font-medium text-primary hover:text-primary/90"
          >
            support@sample.au
          </a>
        </div>
      </div>
    </aside>
  );
}
