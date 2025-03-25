import { login } from '@/actions/authentication';
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
        <form action={login}>
          <div className="flex flex-col gap-6">
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

            <div className="grid gap-2">
              <div className="flex flex-row justify-between">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password">Forgot password?</Link>
              </div>

              <input
                name="password"
                type="password"
                placeholder=""
                className="border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <button
              className=" text-black inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-white/70 shadow hover:bg-white/80 h-9 px-4 py-2 w-full"
              type="submit"
            >
              Login
            </button>

            <div className="text-sm mt-4 text-center">
              Dont have an account? <Link href="/register">Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
