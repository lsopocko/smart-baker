export function Button({
    label,
    className = '',
    onClick,
  }: {
    label: string;
    className?: string;
    onClick?: (event: MouseEvent) => void;
  }): HTMLElement {
    const el = document.createElement('button');
    el.className = `.button ${className}`;
    el.textContent = label;
  
    if (onClick) el.addEventListener('click', onClick);
  
    return el;
  }