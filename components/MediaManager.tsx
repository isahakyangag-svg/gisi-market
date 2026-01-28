
import React, { useState, useMemo, useRef } from 'react';
import { MediaFile } from '../types';
import { Button } from './Button';

interface MediaManagerProps {
  media: MediaFile[];
  onUpdateMedia: (newMedia: MediaFile[]) => void;
  onSelect?: (file: MediaFile) => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ media, onUpdateMedia, onSelect }) => {
  const [currentFolder, setCurrentFolder] = useState('root');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folders logic: derive from media or track explicitly
  const allFolders = useMemo(() => {
    const set = new Set<string>(['root']);
    media.forEach(m => {
      const parts = m.folder.split('/');
      let currentPath = '';
      parts.forEach((p, i) => {
        currentPath += (i === 0 ? '' : '/') + p;
        if (currentPath) set.add(currentPath);
      });
    });
    return Array.from(set).sort();
  }, [media]);

  const filteredMedia = useMemo(() => {
    return media.filter(m => {
      const inFolder = m.folder === currentFolder;
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      return inFolder && matchesSearch;
    });
  }, [media, currentFolder, searchTerm]);

  const currentSubFolders = useMemo(() => {
    return allFolders.filter(f => {
      if (currentFolder === 'root') return f !== 'root' && !f.includes('/');
      return f.startsWith(currentFolder + '/') && f.split('/').length === currentFolder.split('/').length + 1;
    });
  }, [allFolders, currentFolder]);

  // Client-side image optimization
  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast to File[] to avoid 'unknown' type inference issues
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    setIsOptimizing(true);
    const newMediaItems: MediaFile[] = [];

    for (const file of files) {
      let finalUrl = '';
      if (file.type.startsWith('image/')) {
        finalUrl = await optimizeImage(file);
      } else {
        finalUrl = await new Promise((res) => {
          const r = new FileReader();
          r.onload = (le) => res(le.target?.result as string);
          r.readAsDataURL(file);
        });
      }

      newMediaItems.push({
        id: 'media-' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: finalUrl,
        type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
        size: file.size,
        folder: currentFolder,
        createdAt: new Date().toISOString(),
        dimensions: file.type.startsWith('image') ? 'Auto' : undefined
      });
    }

    onUpdateMedia([...newMediaItems, ...media]);
    setIsOptimizing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Удалить выбранные объекты (${selectedIds.length})?`)) {
      onUpdateMedia(media.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      setSelectedFile(null);
    }
  };

  const handleMoveToFolder = () => {
    const targetFolder = prompt('Введите путь папки (например: products/summer):', currentFolder);
    if (targetFolder === null) return;
    
    onUpdateMedia(media.map(m => 
      selectedIds.includes(m.id) || (selectedFile && m.id === selectedFile.id)
        ? { ...m, folder: targetFolder || 'root' }
        : m
    ));
    setSelectedIds([]);
    alert('Объекты перемещены');
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const breadcrumbs = currentFolder === 'root' ? ['root'] : ['root', ...currentFolder.split('/')];

  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-500">
      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleUpload} />

      {/* Main content Area */}
      <div className="flex-grow flex flex-col gap-6">
        
        {/* Toolbar */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
             {breadcrumbs.map((crumb, i) => (
               <React.Fragment key={crumb + i}>
                 <button 
                    onClick={() => {
                      if (crumb === 'root') setCurrentFolder('root');
                      else {
                        const path = currentFolder.split('/').slice(0, i).join('/');
                        setCurrentFolder(path || 'root');
                      }
                    }}
                    className={`text-xs font-black uppercase tracking-widest transition-colors ${i === breadcrumbs.length - 1 ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
                 >
                    {crumb === 'root' ? 'Home' : crumb}
                 </button>
                 {i < breadcrumbs.length - 1 && <span className="text-slate-200">/</span>}
               </React.Fragment>
             ))}
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Поиск..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl text-xs font-bold border border-transparent focus:border-indigo-100 focus:bg-white outline-none w-48 md:w-64 transition-all"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             
             <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
             </div>

             <div className="h-8 w-px bg-slate-100 mx-1" />
             
             <Button variant="primary" size="sm" className="rounded-2xl px-6" onClick={() => fileInputRef.current?.click()} isLoading={isOptimizing}>
                {isOptimizing ? 'Оптимизация...' : 'Загрузить'}
             </Button>
          </div>
        </div>

        {/* Floating Bulk Actions bar */}
        {selectedIds.length > 0 && !onSelect && (
          <div className="flex items-center gap-6 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-top-10">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Выбрано: {selectedIds.length}</span>
             <div className="flex gap-4">
                <button onClick={handleMoveToFolder} className="text-[10px] font-black uppercase tracking-widest hover:text-indigo-300">Переместить</button>
                <button onClick={handleDeleteSelected} className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300">Удалить</button>
                <button onClick={() => setSelectedIds([])} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white">Отмена</button>
             </div>
          </div>
        )}

        {/* Files Grid/List */}
        <div className="flex-grow bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 overflow-y-auto hide-scrollbar min-h-[500px]">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
               {currentSubFolders.map(folder => (
                 <button 
                    key={folder}
                    onClick={() => setCurrentFolder(folder)}
                    className="flex flex-col items-center gap-3 p-4 rounded-[2rem] hover:bg-indigo-50/40 transition-all group"
                 >
                    <div className="w-full aspect-square bg-indigo-50/50 rounded-3xl flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow-sm">
                       <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-600 truncate w-full text-center tracking-widest px-2">{folder.split('/').pop()}</span>
                 </button>
               ))}
               
               {filteredMedia.map(file => (
                 <div 
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-[2rem] transition-all group relative cursor-pointer ${selectedFile?.id === file.id ? 'bg-indigo-50 ring-2 ring-indigo-100 shadow-lg shadow-indigo-100/50' : 'hover:bg-slate-50'}`}
                 >
                    {!onSelect && (
                      <div 
                        onClick={(e) => toggleSelect(file.id, e)}
                        className={`absolute top-6 left-6 z-10 w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedIds.includes(file.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white/80 border-slate-200 opacity-0 group-hover:opacity-100'}`}
                      >
                         {selectedIds.includes(file.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    )}

                    <div className="w-full aspect-square bg-slate-50 rounded-3xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform shadow-sm">
                       {file.type === 'image' ? (
                         <img src={file.url} className="w-full h-full object-cover mix-blend-multiply" alt={file.name} />
                       ) : (
                         <div className="text-slate-300">
                            {file.type === 'video' ? <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> : <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                         </div>
                       )}
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-600 truncate w-full text-center tracking-widest px-2">{file.name}</span>
                 </div>
               ))}

               {filteredMedia.length === 0 && currentSubFolders.length === 0 && (
                 <div className="col-span-full py-40 text-center flex flex-col items-center opacity-20">
                    <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6">
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="font-black text-sm uppercase tracking-[0.2em]">Папка пуста</p>
                    <button onClick={() => fileInputRef.current?.click()} className="mt-4 text-xs font-black text-indigo-600 hover:underline">Загрузить первый файл</button>
                 </div>
               )}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                  {!onSelect && (
                    <th className="pb-6 px-4 w-12">
                      <input type="checkbox" checked={selectedIds.length === filteredMedia.length && filteredMedia.length > 0} onChange={() => setSelectedIds(selectedIds.length === filteredMedia.length ? [] : filteredMedia.map(m => m.id))} className="rounded border-slate-200 text-indigo-600" />
                    </th>
                  )}
                  <th className="pb-6">Объект</th>
                  <th className="pb-6">Размер</th>
                  <th className="pb-6">Тип</th>
                  <th className="pb-6">Дата создания</th>
                  <th className="pb-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentSubFolders.map(folder => (
                   <tr key={folder} onClick={() => setCurrentFolder(folder)} className="group cursor-pointer hover:bg-indigo-50/20 transition-colors">
                     {!onSelect && <td className="py-4"></td>}
                     <td className="py-4 flex items-center gap-4 px-2">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></div>
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-700">{folder.split('/').pop()}</span>
                     </td>
                     <td className="py-4 text-xs text-slate-300 font-bold">—</td>
                     <td className="py-4 text-xs text-slate-300 font-black uppercase tracking-tighter">Папка</td>
                     <td className="py-4 text-xs text-slate-300 font-bold">—</td>
                     <td className="py-4 text-right px-4">
                        <svg className="w-5 h-5 ml-auto text-slate-200 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                     </td>
                   </tr>
                ))}
                {filteredMedia.map(file => (
                   <tr key={file.id} onClick={() => setSelectedFile(file)} className={`group cursor-pointer hover:bg-slate-50 transition-colors ${selectedFile?.id === file.id ? 'bg-indigo-50/50' : ''}`}>
                     {!onSelect && (
                       <td className="py-4 px-4">
                          <input type="checkbox" checked={selectedIds.includes(file.id)} onChange={(e) => { e.stopPropagation(); toggleSelect(file.id, e as any); }} className="rounded border-slate-200 text-indigo-600" />
                       </td>
                     )}
                     <td className="py-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 p-0.5">
                           {file.type === 'image' ? <img src={file.url} className="w-full h-full object-cover rounded-lg mix-blend-multiply" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>}
                        </div>
                        <span className="text-sm font-bold text-slate-700 truncate max-w-xs">{file.name}</span>
                     </td>
                     <td className="py-4 text-xs text-slate-400 font-bold">{(file.size / 1024).toFixed(1)} KB</td>
                     <td className="py-4 text-xs text-slate-400 font-black uppercase tracking-widest">{file.type}</td>
                     <td className="py-4 text-xs text-slate-400 font-bold">{new Date(file.createdAt).toLocaleDateString()}</td>
                     <td className="py-4 text-right px-4">
                        <button onClick={(e) => { e.stopPropagation(); if(confirm('Удалить?')) onUpdateMedia(media.filter(m => m.id !== file.id)); }} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg></button>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Sidebar with Glassmorphism */}
      <div className="w-96 bg-white/70 backdrop-blur-2xl rounded-[3.5rem] border border-white/50 shadow-2xl shrink-0 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
        {selectedFile ? (
          <>
            <div className="p-10 border-b border-slate-50 flex-grow overflow-y-auto hide-scrollbar">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Информация</h4>
                 <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <div className="w-full aspect-square bg-slate-50 rounded-[3rem] overflow-hidden mb-10 border border-slate-100 p-2 shadow-inner flex items-center justify-center">
                 {selectedFile.type === 'image' ? (
                    <img src={selectedFile.url} className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-110 cursor-zoom-in" alt="Preview" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                       <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                 )}
              </div>
              
              <div className="space-y-8">
                 <div className="group">
                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Имя файла</p>
                    <p className="text-sm font-black text-slate-900 break-all leading-tight">{selectedFile.name}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div><p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Размер</p><p className="text-xs font-black text-slate-700">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p></div>
                    <div><p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Формат</p><p className="text-xs font-black text-slate-700 uppercase">{selectedFile.type}</p></div>
                 </div>

                 {selectedFile.dimensions && (
                   <div><p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Резолюция</p><p className="text-xs font-black text-slate-700">{selectedFile.dimensions}</p></div>
                 )}

                 <div>
                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Расположение</p>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                       <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">/{selectedFile.folder}</p>
                    </div>
                 </div>
                 
                 <div className="pt-8 border-t border-slate-100">
                    <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50">
                       <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Оптимизировано</span>
                       </div>
                       <p className="text-[9px] text-emerald-600/70 leading-relaxed font-bold">Файл прошел автоматическую компрессию NovaScale™ для мгновенной загрузки на клиенте.</p>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="p-10 bg-slate-50/80 backdrop-blur-md space-y-3">
               {onSelect ? (
                  <Button 
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100"
                    onClick={() => onSelect(selectedFile)}
                  >
                    Выбрать этот файл
                  </Button>
               ) : (
                  <>
                    <button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = async (e: any) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const optimizedUrl = await optimizeImage(file);
                            onUpdateMedia(media.map(m => m.id === selectedFile.id ? { ...m, url: optimizedUrl, name: file.name, size: file.size } : m));
                            alert('Контент успешно замещен. Все ссылки сохранены.');
                        };
                        input.click();
                      }}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                    >
                      Заменить контент
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={handleMoveToFolder} className="py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Переместить</button>
                      <button onClick={() => { if(confirm('Удалить файл навсегда?')) { onUpdateMedia(media.filter(m => m.id !== selectedFile.id)); setSelectedFile(null); } }} className="py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">Удалить</button>
                    </div>
                  </>
               )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-16 text-center">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-200 shadow-inner">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h5 className="font-black text-xs uppercase tracking-[0.3em] text-slate-300 leading-loose">Выберите файл<br/>для инспекции</h5>
             <p className="text-[10px] text-slate-300 font-bold mt-4 max-w-[180px]">Здесь появятся подробные характеристики, метаданные и инструменты редактирования.</p>
          </div>
        )}
      </div>
    </div>
  );
};
