import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

interface FAQSectionProps {
  lang: Language;
}

const FAQSection: React.FC<FAQSectionProps> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: lang === Language.EN ? 'What is Quantum Key Distribution (QKD)?' : 'Was ist Quantum Key Distribution (QKD)?', 
      a: lang === Language.EN ? 'QKD uses the fundamental properties of quantum mechanics to distribute cryptographic keys. Unlike mathematical encryption, any attempt to eavesdrop changes the quantum state, making interception instantly detectable.' : 'QKD nutzt die grundlegenden Eigenschaften der Quantenmechanik, um kryptografische Schlüssel zu verteilen. Jeder Abhörversuch verändert den Quantenzustand und macht das Abfangen sofort erkennbar.' 
    },
    { 
      q: lang === Language.EN ? 'Why do we need QKD now?' : 'Warum brauchen wir QKD jetzt?', 
      a: lang === Language.EN ? 'The "Harvest Now, Decrypt Later" threat is real. Adversaries are storing encrypted data today to decrypt it once quantum computers become powerful enough. The NIST 2024 deadline emphasizes the urgency to transition to quantum-safe methods immediately.' : 'Die Bedrohung "Harvest Now, Decrypt Later" ist real. Gegner speichern heute verschlüsselte Daten, um sie zu entschlüsseln, sobald Quantencomputer leistungsfähig genug sind.' 
    },
    { 
      q: lang === Language.EN ? 'Does QuDay hardware integrate with existing fiber?' : 'Lässt sich die QuDay-Hardware in bestehende Glasfasern integrieren?', 
      a: lang === Language.EN ? 'Yes. Our systems are designed to operate over standard telecom dark fiber (C-band/O-band) without requiring a complete overhaul of your existing physical infrastructure.' : 'Ja. Unsere Systeme sind für den Betrieb über Standard-Telekommunikations-Dark-Fiber ausgelegt.' 
    },
    { 
      q: lang === Language.EN ? 'What is the maximum distance for your QKD links?' : 'Was ist die maximale Entfernung für Ihre QKD-Verbindungen?', 
      a: lang === Language.EN ? 'Our terrestrial fiber systems comfortably operate at 80-120km point-to-point depending on fiber attenuation. For longer distances, we use trusted nodes or our upcoming satellite uplink (Space-QKD) solutions.' : 'Unsere terrestrischen Glasfasersysteme arbeiten bequem bei 80-120 km Punkt-zu-Punkt.' 
    },
    { 
      q: lang === Language.EN ? 'Which protocols does QuDay support?' : 'Welche Protokolle unterstützt QuDay?', 
      a: lang === Language.EN ? 'We natively support entanglement-based protocols like BBM92 and E91, as well as prepare-and-measure protocols like BB84 and Reference-Independent QKD (RI-QKD).' : 'Wir unterstützen nativ verschränkungsbasierte Protokolle wie BBM92 und E91.' 
    },
    { 
      q: lang === Language.EN ? 'Is QuDay compliant with government standards?' : 'Ist QuDay konform mit Regierungsstandards?', 
      a: lang === Language.EN ? 'Yes, our systems are built towards EuroQCI standards, FIPS 140-3 compliance for cryptographic modules, and we operate an ISO 27001 certified development environment.' : 'Ja, unsere Systeme sind nach EuroQCI-Standards und FIPS 140-3 gebaut.' 
    },
    { 
      q: lang === Language.EN ? 'What happens if a fiber is cut or tampered with?' : 'Was passiert, wenn eine Faser durchtrennt oder manipuliert wird?', 
      a: lang === Language.EN ? 'Our real-time entanglement monitoring detects the disturbance instantly. The system will immediately halt key generation on that link and route traffic through alternative secure nodes.' : 'Unsere Echtzeit-Verschränkungsüberwachung erkennt die Störung sofort.' 
    },
    { 
      q: lang === Language.EN ? 'Do you offer software visualization?' : 'Bieten Sie Software-Visualisierung an?', 
      a: lang === Language.EN ? 'Absolutely. Our Software Suite provides real-time dashboards for Qubit Visualization, Flux Rate Analytics, and Entanglement Fidelity monitoring.' : 'Absolut. Unsere Software Suite bietet Echtzeit-Dashboards.' 
    },
    { 
      q: lang === Language.EN ? 'How long does a typical deployment take?' : 'Wie lange dauert ein typischer Einsatz?', 
      a: lang === Language.EN ? 'A standard point-to-point metropolitan link can be deployed, calibrated, and operational within 4-6 weeks after site assessment and fiber qualification.' : 'Eine Standard-Punkt-zu-Punkt-Stadtverbindung kann innerhalb von 4-6 Wochen bereitgestellt werden.' 
    },
    { 
      q: lang === Language.EN ? 'Do you provide consulting for quantum transition?' : 'Bieten Sie Beratung für den Quantenübergang an?', 
      a: lang === Language.EN ? 'Yes, our consultancy team helps organizations audit their current cryptographic posture and design a roadmap for quantum resilience.' : 'Ja, unser Beratungsteam hilft Organisationen.' 
    }
  ];

  return (
    <div className="py-24 bg-surface-base">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tighter mb-4 text-content-main">
            {lang === Language.EN ? 'Frequently Asked Questions' : 'Häufig gestellte Fragen'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-surface-border rounded-2xl overflow-hidden bg-surface-panel/30">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-surface-panel/50 transition-colors"
              >
                <span className="font-bold text-lg text-content-main pr-8">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-quantum-500/10 text-quantum-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                  <iconify-icon icon="solar:alt-arrow-down-linear" width="20"></iconify-icon>
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-content-dim font-light leading-relaxed border-t border-surface-border/50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
