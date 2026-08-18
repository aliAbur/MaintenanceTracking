import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full mx-auto flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">shield_person</span>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-on-surface tracking-tight">
          PanelService
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          Sign in to access your administrative dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-2xl border border-outline-variant/30 sm:px-10">
          <form className="space-y-6" action="#">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-on-surface uppercase tracking-wide">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@panelservice.com"
                  className="appearance-none block w-full px-3 py-2 border border-outline rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-on-surface uppercase tracking-wide">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="password123"
                  className="appearance-none block w-full px-3 py-2 border border-outline rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-outline rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface-variant">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Link 
                href="/"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
