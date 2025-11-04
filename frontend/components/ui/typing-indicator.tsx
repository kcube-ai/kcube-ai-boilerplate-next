import React from "react";

type TypingIndicatorProps = React.HTMLAttributes<HTMLDivElement>;

const TypingIndicator: React.FC<TypingIndicatorProps> = (props) => {
  return (
    <div className="flex pr-2" {...props}>
      <div className="flex items-center gap-1.5 bg-muted px-3 py-2 rounded-full">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0s]"></span>
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
