import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] dark:bg-[#18181b] py-10">
      <div className="card w-full max-w-xl text-center">
        <Image
          className="mx-auto mb-6 dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={26}
          priority
        />
        <h1 className="text-3xl font-bold mb-4">Welcome to the Recuitment Project</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          A minimalist platform for secure admin sharing and data access.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-base h-10 px-5"
            href="/login"
          >
            Admin Login
          </a>
          <a
            className="rounded-full border border-solid border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent font-medium text-base h-10 px-5"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </div>
      </div>
      <footer className="mt-12 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-400 dark:text-gray-600">
        <a
          className="hover:underline"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn
        </a>
        <a
          className="hover:underline"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          Examples
        </a>
        <a
          className="hover:underline"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
