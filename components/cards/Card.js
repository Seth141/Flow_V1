/**
 * base card component for boards
 * used by both BoardCard and CreateBoardCard for consistentn styling
 */
export function Card({ children, onClick, boardColor, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`w-[194px] h-[96px] mr-[2%] mb-[2%] shadow-sm cursor-pointer box-border relative ${className}`}
      style={{ backgroundColor: boardColor }}
    >
      {children}
    </div>
  );
}

/* standard text styling for card title */
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`pt-2 pl-2 text-sm font-medium ${className}`}>{children}</h3>
  );
}

export function CreateBoardTitle({ children, className = '' }) {
  return <h3 className={`text-sm font-medium ${className}`}>{children}</h3>;
}
