import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface antialiased flex items-center justify-center p-4">
      <div className="w-full max-w-[448px] bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/30 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span aria-hidden="true" className="material-symbols-outlined text-primary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">PanelService</h1>
          </div>
          <p className="text-sm text-on-surface-variant">Sign in to your workspace</p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="email">Email address</label>
            <input 
              className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder:text-outline" 
              id="email" 
              name="email" 
              placeholder="name@company.com" 
              required 
              type="email"
              defaultValue="admin@panelservice.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-on-surface" htmlFor="password">Password</label>
              <a className="text-sm text-primary hover:text-primary/80 transition-colors font-medium" href="#">Forgot password?</a>
            </div>
            <input 
              className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder:text-outline" 
              id="password" 
              name="password" 
              placeholder="Enter password" 
              required 
              type="password"
              defaultValue="password123"
            />
          </div>

          {/* Keep signed in */}
          <div className="flex items-center">
            <input 
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface transition-colors cursor-pointer" 
              id="remember" 
              name="remember" 
              type="checkbox" 
            />
            <label className="ml-3 block text-sm text-on-surface cursor-pointer" htmlFor="remember">Keep me signed in</label>
          </div>

          {/* Submit Button */}
          <Link 
            href="/"
            className="w-full h-12 bg-primary text-on-primary rounded-lg font-medium text-base hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors flex justify-center items-center"
          >
            Sign In
          </Link>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Don't have an account? <a className="text-primary hover:text-primary/80 font-medium transition-colors" href="#">Request access</a>
        </div>
      </div>
    </div>
  );
}
