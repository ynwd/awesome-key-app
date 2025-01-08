export default function Button({ children, onClick, disabled, type }: { children: React.ReactNode, type?: "button" | "reset" | "submit", disabled?: boolean, onClick?: () => void }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
            {children}
        </button>
    );
}