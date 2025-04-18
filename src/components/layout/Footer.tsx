
import { Copyright } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Copyright className="h-4 w-4" />
          <span>{new Date().getFullYear()} PerformPath. All rights reserved.</span>
        </div>
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
