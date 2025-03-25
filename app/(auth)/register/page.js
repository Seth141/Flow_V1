import { register } from '@/actions/authentication';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="bg-white/20 backdrop-blur-sm text-gray-200 border-white rounded-lg shadow-lg flex flex-col">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="text-2xl tracking-tight font-semibold">Log in</div>
        <div className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </div>
      </div>

      <div className="p-6 pt-0">
        <form action={register}>
          <div className="flex flex-col gap-6">
            {/* Name */}
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your full name"
                className="border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                type="email"
                placeholder="name@email.com"
                className="border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                placeholder=""
                className="border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Submit */}
            <button
              className=" text-black inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-white/70 shadow hover:bg-white/80 h-9 px-4 py-2 w-full"
              type="submit"
            >
              Sign up
            </button>

            <div className="text-sm mt-4 text-center">
              Already have an account? <Link href="/login">Log in</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
