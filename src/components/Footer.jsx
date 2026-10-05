import { ArrowUp } from "lucide-react";

export const Footer = () => (
    <footer className="site-footer">
        <p>© {new Date().getFullYear()} Aditya Gawande <span>·</span> GenAI &amp; ML Engineer</p>
        <a href="#home" aria-label="Back to top"><span>BACK TO TOP</span><ArrowUp size={15} /></a>
    </footer>
);