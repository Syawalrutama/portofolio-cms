import React from 'react'

// Base pulsing shimmer skeleton
export const SkeletonPulse = ({ className }) => {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-800/40 ${className}`} />
  )
}

// Skeleton for StatCards on Dashboard
export const StatCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#0d1324] p-6 shadow-md">
      <SkeletonPulse className="h-12 w-12 rounded-lg shrink-0" />
      <div className="space-y-2 flex-1">
        <SkeletonPulse className="h-4 w-20" />
        <SkeletonPulse className="h-6 w-12" />
      </div>
    </div>
  )
}

// Skeleton for grid items like projects, certificates, skills
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-xl border border-slate-800 bg-[#0d1324] p-5 shadow-md space-y-4">
          <SkeletonPulse className="aspect-video w-full rounded-lg" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <SkeletonPulse className="h-5 w-1/2" />
              <SkeletonPulse className="h-4 w-12" />
            </div>
            <SkeletonPulse className="h-3 w-full" />
            <SkeletonPulse className="h-3 w-4/5" />
          </div>
          <div className="flex gap-4 pt-2 border-t border-slate-800/50">
            <SkeletonPulse className="h-8 flex-1" />
            <SkeletonPulse className="h-8 flex-1" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton for list items like Inbox messages list
export const ListSkeleton = ({ count = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-800 bg-[#0d1324] p-5 shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <SkeletonPulse className="h-4 w-1/3" />
              <SkeletonPulse className="h-3 w-1/4" />
            </div>
            <SkeletonPulse className="h-6 w-16" />
          </div>
          <SkeletonPulse className="h-3 w-full" />
          <SkeletonPulse className="h-3 w-5/6" />
          <div className="flex gap-3 pt-2 justify-end">
            <SkeletonPulse className="h-7 w-20" />
            <SkeletonPulse className="h-7 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton for Profile Form Settings
export const FormSkeleton = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1324] p-6 shadow-md space-y-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row pb-6 border-b border-slate-800">
        <SkeletonPulse className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-32" />
          <SkeletonPulse className="h-3 w-48" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4 border-t border-slate-800/50">
        <SkeletonPulse className="h-10 w-32" />
      </div>
    </div>
  )
}
