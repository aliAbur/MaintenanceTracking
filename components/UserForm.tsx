'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, updateUser } from '../lib/actions';
import Link from 'next/link';
import { UserProfile } from '@prisma/client';

export default function UserForm({ initialData }: { initialData?: UserProfile }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEditing) {
        await updateUser(initialData.id, formData);
      } else {
        await createUser(formData);
      }
      router.push('/users');
      router.refresh();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} user`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses = "h-10 rounded-lg border border-outline px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface bg-surface-container-lowest";

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-on-surface-variant text-sm">
        <Link href="/users" className="hover:text-primary transition-colors">Users</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">{isEditing ? 'Edit User' : 'Add New User'}</span>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-on-surface">{isEditing ? 'Edit User' : 'Add New User'}</h2>
        <p className="text-base text-on-surface-variant">
          {isEditing ? 'Update user account information and access permissions.' : 'Create a new account and configure their access permissions.'}
        </p>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {error && (
            <div className="p-4 bg-error-container text-sm font-semibold text-on-error-container rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5">error</span>
              <div>{error}</div>
            </div>
          )}

          {/* Personal Info Section */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 border-b border-outline-variant/50 pb-8">
            <div className="md:w-1/3">
              <h3 className="text-xl font-bold text-on-surface mb-2">Personal Information</h3>
              <p className="text-sm text-on-surface-variant">Basic details for the user's profile.</p>
            </div>
            <div className="md:w-2/3 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface uppercase tracking-wide" htmlFor="fullName">Full Name *</label>
                <input required defaultValue={initialData?.fullName || ''} className={inputClasses} id="fullName" name="fullName" placeholder="Jane Doe" type="text" />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide" htmlFor="email">Email Address *</label>
                  <input required defaultValue={initialData?.email || ''} className={inputClasses} id="email" name="email" placeholder="jane.doe@example.com" type="email" />
                </div>
              </div>
              {!isEditing && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide" htmlFor="password">Initial Password *</label>
                  <input required className={inputClasses} id="password" name="password" placeholder="••••••••" type="password" />
                  <p className="text-xs text-on-surface-variant mt-1">Must be at least 8 characters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Role & Permissions Section */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 pb-4">
            <div className="md:w-1/3">
              <h3 className="text-xl font-bold text-on-surface mb-2">Role & Permissions</h3>
              <p className="text-sm text-on-surface-variant">Define what this user can see and do within PanelService.</p>
            </div>
            <div className="md:w-2/3 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">System Role *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Admin Role */}
                  <label className="relative flex flex-col p-4 rounded-xl border border-outline-variant/50 cursor-pointer hover:border-primary transition-colors bg-surface-container-lowest has-[:checked]:border-primary has-[:checked]:bg-primary-container/5 has-[:checked]:ring-1 has-[:checked]:ring-primary group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary group-has-[:checked]:text-primary text-[20px]">admin_panel_settings</span>
                        <span className="text-sm font-bold text-on-surface">Admin</span>
                      </div>
                      <input defaultChecked={initialData?.role === 'Admin'} className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" name="role" type="radio" value="Admin" />
                    </div>
                    <p className="text-xs text-on-surface-variant">Full access to all settings, users, and tickets.</p>
                  </label>
                  
                  {/* Employee Role */}
                  <label className="relative flex flex-col p-4 rounded-xl border border-outline-variant/50 cursor-pointer hover:border-primary transition-colors bg-surface-container-lowest has-[:checked]:border-primary has-[:checked]:bg-primary-container/5 has-[:checked]:ring-1 has-[:checked]:ring-primary group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary group-has-[:checked]:text-primary text-[20px]">badge</span>
                        <span className="text-sm font-bold text-on-surface">Employee</span>
                      </div>
                      <input defaultChecked={!initialData || initialData?.role === 'Employee'} className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" name="role" type="radio" value="Employee" />
                    </div>
                    <p className="text-xs text-on-surface-variant">Can manage assigned tickets and standard tools.</p>
                  </label>
                  
                  {/* Observer Role */}
                  <label className="relative flex flex-col p-4 rounded-xl border border-outline-variant/50 cursor-pointer hover:border-primary transition-colors bg-surface-container-lowest has-[:checked]:border-primary has-[:checked]:bg-primary-container/5 has-[:checked]:ring-1 has-[:checked]:ring-primary group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary group-has-[:checked]:text-primary text-[20px]">visibility</span>
                        <span className="text-sm font-bold text-on-surface">Observer</span>
                      </div>
                      <input defaultChecked={initialData?.role === 'Observer'} className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" name="role" type="radio" value="Observer" />
                    </div>
                    <p className="text-xs text-on-surface-variant">Read-only access to specific dashboards and reports.</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/50">
            <Link href="/users" className="px-6 py-2.5 rounded-full text-secondary font-semibold text-sm hover:bg-surface-container-low transition-colors">
              Cancel
            </Link>
            <button disabled={isSubmitting} type="submit" className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
