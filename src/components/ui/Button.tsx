interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    href,
    onClick,
    disabled = false,
}: ButtonProps) {
    const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transform hover:scale-105 active:scale-95 transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-white',
        outline: 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white',
    };

    const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button onClick={onClick} disabled={disabled} className={classes}>
            {children}
        </button>
    );
}
