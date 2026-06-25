
import React from 'react';
import { motion } from 'framer-motion';
import { Product, Language } from '../types';
import { generateProductPDF } from '../services/pdfGenerator';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  lang: Language;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 50 }}
        className="relative bg-[#050505] border border-cyan-500/20 w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.1)] flex flex-col"
      >
        {/* Header */}
        <div className="p-10 md:p-12 border-b border-white/5 flex justify-between items-start shrink-0 bg-[#050505] z-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                {product.category}
              </span>
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                ID: {product.id.toUpperCase()}_SYS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">
              {product.name}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-cyan-500 hover:text-black transition-all interactive"
          >
            <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 md:p-20 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-16">
            {!product.details ? (
               <p className="text-zinc-400 text-lg">Detailed specifications for this system are currently being compiled. Please contact our engineering team.</p>
            ) : (
              product.details.map((section, idx) => {
                if (section.type === 'text') {
                  return (
                    <p key={idx} className="text-xl md:text-2xl font-light text-zinc-300 leading-relaxed">
                      {section.content}
                    </p>
                  );
                }
                if (section.type === 'image') {
                  return (
                    <figure key={idx} className="w-full">
                      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={section.src} alt={section.alt} className="w-full h-auto object-cover" />
                      </div>
                      {section.caption && (
                        <figcaption className="mt-4 text-center text-xs font-mono text-zinc-500 uppercase tracking-widest">
                          {section.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                if (section.type === 'table') {
                  return (
                    <div key={idx} className="overflow-x-auto rounded-3xl border border-white/10 shadow-2xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-cyan-900/20 border-b border-cyan-500/20">
                            {section.headers.map((h, i) => (
                              <th key={i} className="p-6 text-xs font-black text-cyan-400 uppercase tracking-widest first:pl-8">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white/5 divide-y divide-white/5">
                          {section.rows.map((row, rI) => (
                            <tr key={rI} className="hover:bg-white/10 transition-colors">
                              {row.map((cell, cI) => (
                                <td key={cI} className={`p-6 text-sm text-zinc-300 font-mono first:pl-8 ${cI === 0 ? 'font-bold text-white' : ''}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return null;
              })
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-10 border-t border-white/5 bg-[#050505] shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="hidden md:block text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">
                System Configurator Available
            </span>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => generateProductPDF(product, lang)}
                className="px-6 py-4 bg-transparent border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 font-black uppercase tracking-[0.2em] text-xs rounded-full transition-all flex items-center justify-center gap-2 interactive cursor-pointer"
              >
                <iconify-icon icon="solar:document-download-linear" width="18"></iconify-icon>
                <span>{lang === Language.EN ? 'Download Specifications PDF' : 'Spezifikationen PDF'}</span>
              </button>
              <button className="px-10 py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.3em] text-xs rounded-full hover:bg-white transition-colors interactive shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer">
                  Request Quote
              </button>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

export default ProductDetailsModal;
