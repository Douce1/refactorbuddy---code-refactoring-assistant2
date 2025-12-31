
import React from 'react';

interface CodeBlockProps {
  code: string;
  label?: string;
  variant?: 'original' | 'refactored';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, label, variant = 'original' }) => {
  const bgColor = variant === 'original' ? 'bg-slate-800' : 'bg-emerald-950/40';
  const borderColor = variant === 'original' ? 'border-slate-700' : 'border-emerald-500/30';
  const labelColor = variant === 'original' ? 'text-slate-400' : 'text-emerald-400';

  return (
    <div className={`rounded-xl border ${borderColor} overflow-hidden shadow-2xl`}>
      {label && (
        <div className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b ${borderColor} flex justify-between items-center ${bgColor}`}>
          <span className={labelColor}>{label}</span>
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
          </div>
        </div>
      )}
      <pre className={`p-5 overflow-x-auto code-font text-sm leading-relaxed ${bgColor}`}>
        <code className={variant === 'original' ? 'text-slate-300' : 'text-emerald-50'}>
          {code || '// 코드가 여기에 표시됩니다...'}
        </code>
      </pre>
    </div>
  );
};
