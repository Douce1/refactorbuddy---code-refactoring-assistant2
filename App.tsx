
import React, { useState, useCallback } from 'react';
import { refactorCode } from './services/geminiService';
import { AppStatus, RefactorResult, SupportedLanguage } from './types';
import { CodeBlock } from './components/CodeBlock';

const LANGUAGES: SupportedLanguage[] = [
  'Auto-detect',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'HTML/CSS'
];

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('Auto-detect');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<RefactorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRefactor = useCallback(async () => {
    if (!inputCode.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const data = await refactorCode(inputCode, selectedLanguage);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
      setStatus(AppStatus.ERROR);
    }
  }, [inputCode, selectedLanguage]);

  const clearAll = () => {
    setInputCode('');
    setSelectedLanguage('Auto-detect');
    setResult(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              RefactorBuddy
            </h1>
          </div>
          <div className="hidden md:block text-sm text-slate-400">
            초보 개발자를 위한 코드 리팩토링 비서
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Input */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">코드를 개선해볼까요?</h2>
                <p className="text-slate-400">리팩토링이 필요한 코드를 입력하세요.</p>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">언어 선택</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-40 p-2.5 outline-none cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
              <div className="relative">
                <textarea
                  className="w-full h-64 p-6 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all code-font text-sm leading-relaxed"
                  placeholder="예: if (user.isActive == true) { return true; } else { return false; }"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleRefactor}
                disabled={status === AppStatus.LOADING || !inputCode.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                {status === AppStatus.LOADING ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95V4.69l3.393-.582a1 1 0 11.34 1.971l-3.733.64a1 1 0 01-1.157-1.157l.64-3.733a1 1 0 011.62-.782zm-4.73 1.134a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414L6.57 3.595a1 1 0 010-1.414zm-3.414 4a1 1 0 011-1H7.5a1 1 0 110 2H5.157l3.393 3.393a1 1 0 11-1.414 1.414L3.154 8.57a1 1 0 01-.107-1.389z" clipRule="evenodd" />
                    </svg>
                    <span>리팩토링 시작</span>
                  </>
                )}
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                초기화
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm animate-pulse">
                {error}
              </div>
            )}
          </section>

          {/* Right Column: Result */}
          <section className="space-y-6">
            {status === AppStatus.IDLE && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-3xl space-y-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 13V12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-400">결과를 기다리고 있어요</h3>
                  <p className="text-slate-500 text-sm mt-1">코드를 입력하고 버튼을 눌러보세요.</p>
                </div>
              </div>
            )}

            {status === AppStatus.LOADING && (
              <div className="space-y-6 animate-pulse">
                <div className="h-48 bg-slate-900 rounded-xl"></div>
                <div className="h-32 bg-slate-900 rounded-xl"></div>
                <div className="h-32 bg-slate-900 rounded-xl"></div>
              </div>
            )}

            {status === AppStatus.SUCCESS && result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CodeBlock code={result.refactoredCode} label={`개선된 코드 (${selectedLanguage === 'Auto-detect' ? '분석됨' : selectedLanguage})`} variant="refactored" />
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">리팩토링 이유</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400">학습 포인트</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {result.concepts.map((concept, idx) => (
                      <div key={idx} className="p-5 bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-xl hover:border-purple-500/30 transition-colors">
                        <h4 className="text-purple-300 font-bold mb-1">{concept.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{concept.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl italic text-indigo-300/80 text-sm text-center">
                  "{result.summary}"
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-20 py-10 border-t border-slate-900 text-center text-slate-600 text-xs">
        <p>© 2024 RefactorBuddy. Built for the next generation of engineers.</p>
      </footer>
    </div>
  );
};

export default App;
