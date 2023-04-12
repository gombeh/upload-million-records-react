import Link from "next/link";

export default function Layouts({children}) {
  return (
    <div>
        <nav className="border px-10 py-2 shadow-md fixed inset-x-0">
            <Link href="/">
                <span className="mx-2 font-semibold">Home</span>
            </Link>
            <Link href="/upload">
                <span className="mx-2 font-semibold">Upload</span>
            </Link>
        </nav>  
        <div className="flex h-screen">
            <div className="m-auto">
                { children }
            </div>
        </div>
    </div>
  )
}
