import Image from 'next/image'
import Link from 'next/link'
import logo from '../../public/theBloggerLogo2S.png'

export default function Navbar() {
  return (
    <nav className="px-6 py-4 shadow-sm border-b">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-xl font-bold">
            <Image src={logo} alt="logo" width={80} height={1000} />
          </Link>
        </div>

        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-gray-700 text-white text-xl">
            Home
          </Link>
          <Link href="/blog" className="hover:text-gray-700 text-white text-xl">
            Blog
          </Link>
          <Link href="/admin" className="hover:text-gray-700 text-white text-xl">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
