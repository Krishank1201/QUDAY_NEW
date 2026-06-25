import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

interface ContactPageProps {
  lang: Language;
  content: any;
}

const ContactPage: React.FC<ContactPageProps> = ({ lang, content }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{name?: boolean, email?: boolean, subject?: boolean, message?: boolean}>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !validateEmail(formData.email),
      subject: !formData.subject.trim(),
      message: !formData.message.trim(),
    };
    
    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch(`https://formsubmit.co/ajax/QuDayadmin1@gmail.com`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject || "QuDay Connect Form Inquiry",
          message: formData.message
        })
      });

      if (!response.ok) throw new Error("Delivery failed");
      
      setStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        subject: '', 
        message: '' 
      });
      setErrors({});
    } catch (err) {
      console.error("Mail transmission error:", err);
      setStatus('error');
    }
  };

  useEffect(() => {
    let timer: number;
    if (status === 'success' || status === 'error') {
      timer = window.setTimeout(() => setStatus('idle'), 8000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="pt-20 pb-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-7xl md:text-9xl font-display font-black text-content-main tracking-tighter leading-[0.85] mb-12"
            >
              {content.title.split(' ')[0]} <br/>
              <span className="text-quantum-500">{content.title.split(' ').slice(1).join(' ')}</span>
            </motion.h1>
            <p className="text-content-dim text-2xl font-light leading-relaxed max-w-lg mb-12">
              {content.desc}
            </p>
            
            <div className="space-y-8">
              {[
                { label: lang === Language.EN ? 'Operational HQ' : 'Betriebszentrale', val: 'Leutragraben 1, 07743 Jena, DE', icon: 'solar:map-point-linear' },
                { label: 'Secure Line', val: '+49 (0) 3641 99-12345', icon: 'solar:phone-linear' }
              ].map((info, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-quantum-500/5 border border-quantum-500/20 flex items-center justify-center text-quantum-500 group-hover:bg-quantum-500 group-hover:text-surface-base transition-all duration-500">
                    <iconify-icon icon={info.icon} width="24"></iconify-icon>
                  </div>
                  <div>
                    <h4 className="text-content-sub text-[10px] font-black uppercase tracking-[0.3em] mb-1">{info.label}</h4>
                    <p className="text-content-main text-lg font-bold">{info.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="spotlight-card p-12 md:p-20 rounded-[4rem] min-h-[600px] flex flex-col justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-20 text-center space-y-8 relative z-10"
                  >
                    <button 
                      onClick={() => setStatus('idle')}
                      className="absolute top-[-20px] right-[-20px] w-10 h-10 rounded-full bg-surface-panel flex items-center justify-center hover:bg-green-500 hover:text-surface-base transition-colors interactive"
                    >
                      <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
                    </button>
                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        <iconify-icon icon="solar:check-circle-linear" width="48"></iconify-icon>
                      </motion.div>
                    </div>
                    <h3 className="text-4xl font-display font-black text-content-main uppercase tracking-tighter">Transmission Secure</h3>
                    <p className="text-green-500 text-lg uppercase tracking-widest font-bold">QuDay Team will get back to you shortly.</p>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 8 }}
                      className="h-1 bg-green-500 absolute bottom-[-40px] left-0"
                    />
                  </motion.div>
                ) : status === 'error' ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-20 text-center space-y-8 relative z-10"
                  >
                    <button 
                      onClick={() => setStatus('idle')}
                      className="absolute top-[-20px] right-[-20px] w-10 h-10 rounded-full bg-surface-panel flex items-center justify-center hover:bg-rose-500 hover:text-surface-base transition-colors interactive"
                    >
                      <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
                    </button>
                    <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        <iconify-icon icon="solar:danger-triangle-linear" width="48"></iconify-icon>
                      </motion.div>
                    </div>
                    <h3 className="text-4xl font-display font-black text-content-main uppercase tracking-tighter">Connection Failed</h3>
                    <p className="text-rose-500 text-lg uppercase tracking-widest font-bold">Failed to connect you with our team. Please try again later.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-10 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 relative">
                        <label className="text-[10px] font-black text-quantum-500 uppercase tracking-[0.4em] ml-2">
                          {content.labels.identity} {errors.name && <span className="text-rose-500 text-lg leading-none align-top">*</span>}
                        </label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if (errors.name) setErrors({...errors, name: false});
                          }}
                          className={`w-full bg-surface-panel border ${errors.name ? 'border-rose-500' : 'border-surface-border'} rounded-3xl px-8 py-5 focus:outline-none focus:ring-4 focus:ring-quantum-500/20 focus:border-quantum-500 transition-all text-content-main`}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-3 relative">
                        <label className="text-[10px] font-black text-quantum-500 uppercase tracking-[0.4em] ml-2">
                          {content.labels.endpoint} {errors.email && <span className="text-rose-500 text-lg leading-none align-top">*</span>}
                        </label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if (errors.email) setErrors({...errors, email: false});
                          }}
                          className={`w-full bg-surface-panel border ${errors.email ? 'border-rose-500' : 'border-surface-border'} rounded-3xl px-8 py-5 focus:outline-none focus:ring-4 focus:ring-quantum-500/20 focus:border-quantum-500 transition-all text-content-main`}
                          placeholder="johndoe123@gmail.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-3 relative">
                      <label className="text-[10px] font-black text-quantum-500 uppercase tracking-[0.4em] ml-2">
                        {content.labels.project} {errors.subject && <span className="text-rose-500 text-lg leading-none align-top">*</span>}
                      </label>
                      <input 
                        type="text" 
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData({...formData, subject: e.target.value});
                          if (errors.subject) setErrors({...errors, subject: false});
                        }}
                        className={`w-full bg-surface-panel border ${errors.subject ? 'border-rose-500' : 'border-surface-border'} rounded-3xl px-8 py-5 focus:outline-none focus:ring-4 focus:ring-quantum-500/20 focus:border-quantum-500 transition-all text-content-main`}
                        placeholder="Inquiry"
                      />
                    </div>
                    <div className="space-y-3 relative">
                      <label className="text-[10px] font-black text-quantum-500 uppercase tracking-[0.4em] ml-2">
                        {content.labels.transmission} {errors.message && <span className="text-rose-500 text-lg leading-none align-top">*</span>}
                      </label>
                      <textarea 
                        rows={5}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({...formData, message: e.target.value});
                          if (errors.message) setErrors({...errors, message: false});
                        }}
                        className={`w-full bg-surface-panel border ${errors.message ? 'border-rose-500' : 'border-surface-border'} rounded-3xl px-8 py-6 focus:outline-none focus:ring-4 focus:ring-quantum-500/20 focus:border-quantum-500 transition-all text-content-main resize-none`}
                        placeholder="Details..."
                      ></textarea>
                    </div>

                    <AnimatePresence>
                      {Object.values(errors).some(e => e) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }}
                          className="flex items-center justify-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 py-3 rounded-2xl border border-rose-500/20"
                        >
                          <iconify-icon icon="solar:danger-triangle-linear" width="16"></iconify-icon>
                          Please provide valid information for the marked fields.
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button disabled={status === 'loading'} type="submit" className={`w-full bg-content-main text-surface-base font-black py-6 rounded-3xl transition-all shadow-xl hover:bg-quantum-500 hover:text-white hover:shadow-quantum-500/30 hover:scale-[1.02] uppercase tracking-[0.4em] text-xs ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}>
                      {status === 'loading' ? 'TRANSMITTING...' : content.labels.cta}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;