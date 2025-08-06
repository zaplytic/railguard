export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">RailGuard</div>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="text-gray-300 hover:text-white">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="text-gray-300 hover:text-white">
              About
            </a>
          </li>
          <li>
            <a href="/contact" className="text-gray-300 hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export const clsx = (arg: string | string[]) => {
  if (Array.isArray(arg)) {
    return arg.join(" ");
  }
  return arg;
};
