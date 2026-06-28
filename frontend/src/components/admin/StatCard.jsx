import React from 'react'

const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0d1324] p-6 shadow-md transition-all hover:border-slate-700/50 hover:shadow-lg">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <h3 className="text-3xl font-extrabold text-white">{value}</h3>
      </div>
      <div className={`rounded-xl p-3 bg-opacity-10 ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  )
}

export default StatCard
