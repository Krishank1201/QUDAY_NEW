import React from 'react';
import { Product, Language, TeamMember, NewsArticle, FAQItem, JourneyMilestone } from './types';

export const LOGO_SVG = (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path 
      d="M50 12 L85 28 V52 C85 74.0914 50 92 50 92 C50 92 15 74.0914 15 52 V28 L50 12Z" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="50" cy="52" r="9" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M50 32 V38" />
        <path d="M50 66 V72" />
        <path d="M30 52 H36" />
        <path d="M64 52 H70" />
        <path d="M36 38 L40 42" />
        <path d="M64 66 L60 62" />
        <path d="M36 66 L40 62" />
        <path d="M64 38 L60 42" />
    </g>
  </svg>
);

export const getLocalizedContent = (lang: Language) => ({
  nav: {
    home: lang === Language.EN ? 'Core' : 'Kern',
    services: lang === Language.EN ? 'Our Services' : 'Leistungen',
    products: lang === Language.EN ? 'Systems' : 'Systeme',
    news: lang === Language.EN ? 'Journey' : 'Reise',
    contact: lang === Language.EN ? 'Connect with Us' : 'Verbinden Sie uns',
    about: lang === Language.EN ? 'About Us' : 'Über uns',
  },
  hero: {
    overline: lang === Language.EN ? 'Jena • Germany • Physics-Layer Security' : 'Jena • Deutschland • Physische Sicherheit',
    title: lang === Language.EN ? 'Quantum Cyber-Sovereignty' : 'Quanten-Souveränität',
    desc: lang === Language.EN 
      ? "The quantum threat is real. With the NIST 2024 deadline fast approaching, relying on mathematical encryption is no longer enough. We implement the fundamental laws of quantum optics to eliminate algorithmic risks, providing the hardware for the next era of global communication security."
      : "Die Quantenbedrohung ist real. Mit der näher rückenden NIST-Frist 2024 reicht mathematische Verschlüsselung nicht mehr aus. Wir implementieren die fundamentalen Gesetze der Quantenoptik, um algorithmische Risiken zu eliminieren und liefern die Hardware für die nächste Ära globaler Kommunikationssicherheit.",
    cta: lang === Language.EN ? 'Explore Systems' : 'Systeme entdecken',
  },
  ticker: [
    "// ENTANGLEMENT FIDELITY: 95.00%",
    "// STATUS: OPTIMAL",
    "// NODE: JENA_HUB_01",
    "// PROTOCOL: BBM92 | BB84 | E91 | RI-QKD",
    "// SECURED KEY RATE: 95.0 Mb/s",
    "// QBER: 0.03%",
    "// ORIGIN: JENA_GER"
  ],
  services: [
    {
      id: 'software',
      title: lang === Language.EN ? 'Software Solutions' : 'Softwarelösungen',
      desc: lang === Language.EN ? 'Analysis and visualization suite' : 'Analyse- und Visualisierungs-Suite',
      items: [
        lang === Language.EN ? 'Qubit visualization' : 'Qubit Visualisierung',
        lang === Language.EN ? 'Entanglement monitoring' : 'Verschränkungs-Monitoring',
        lang === Language.EN ? 'Flux rate analytics' : 'Flux-Raten Analytik',
        lang === Language.EN ? 'Error correction' : 'Fehlerkorrektur',
        lang === Language.EN ? 'Custom software development' : 'Eigene Softwareentwicklung'
      ]
    },
    {
      id: 'hardware',
      title: lang === Language.EN ? 'Hardware Solutions' : 'Hardwarelösungen',
      desc: lang === Language.EN ? 'Physics-layer generation and control' : 'Physische Schichterzeugung und Steuerung',
      items: ['Quantum Source', 'Polarization Analyzing Module', 'Polarization Correction Module', 'QS System']
    },
    {
      id: 'consultancy',
      title: lang === Language.EN ? 'Consultancy' : 'Beratung',
      desc: lang === Language.EN ? 'Expert support across quantum topics' : 'Experten-Support für alle Quanten-Themen',
      items: [
        lang === Language.EN ? 'Quantum communication consulting' : 'Quantenkommunikations-Beratung',
        lang === Language.EN ? 'Support across all quantum topics' : 'Support für alle Quanten-Themen',
        lang === Language.EN ? 'Client-specific advisory' : 'Kundenspezifische Beratung'
      ]
    }
  ],
  hardwarePage: {
    hero: {
      title: lang === Language.EN ? "Physics-Layer Engineering" : "Engineering der physikalischen Schicht",
      desc: lang === Language.EN 
        ? "We provide the fundamental hardware components for the next era of global communication security."
        : "Wir liefern die fundamentalen Hardwarekomponenten für die nächste Ära der globalen Kommunikationssicherheit.",
      cta: lang === Language.EN ? "View Specifications" : "Spezifikationen ansehen"
    },
    workflow: {
        title: lang === Language.EN ? 'Scientific Workflow' : 'Wissenschaftlicher Workflow',
        desc: lang === Language.EN ? 'The technical pipeline from generation to verification' : 'Die technische Pipeline von der Erzeugung bis zur Verifizierung',
        steps: [
            { id: '01', title: lang === Language.EN ? 'Source' : 'Quelle' },
            { id: '02', title: lang === Language.EN ? 'Measurements' : 'Messungen' },
            { id: '03', title: lang === Language.EN ? 'Software' : 'Software' }
        ]
    }
  },
  consultancyPage: {
    hero: {
        title: lang === Language.EN ? "Quantum Security Without the PhD" : "Quantensicherheit ohne Doktortitel",
        desc: lang === Language.EN 
            ? "Your infrastructure is vulnerable to harvest-now-decrypt-later attacks. We translate quantum complexity into actionable protection for your specific architecture."
            : "Ihre Infrastruktur ist anfällig für 'Harvest-Now-Decrypt-Later'-Angriffe. Wir übersetzen Quantenkomplexität in umsetzbaren Schutz.",
        cta: lang === Language.EN ? "Schedule Assessment" : "Bewertung vereinbaren"
    },
    useCases: [
        { id: 'banking', title: lang === Language.EN ? 'Secure Inter-Branch Banking' : 'Sicheres Bankwesen', solution: 'QKD Network Deployment', outcome: lang === Language.EN ? 'Tamper-evident key exchange preventing man-in-the-middle attacks.' : 'Manipulationssicherer Schlüsselaustausch.' },
        { id: 'sat', title: lang === Language.EN ? 'Protect Satellite Comms' : 'Satellitenkommunikation', solution: 'Space-Qualified QKD', outcome: lang === Language.EN ? 'Quantum-safe space-to-ground transmission links.' : 'Quantensichere Raum-Boden-Übertragungsstrecken.' },
        { id: 'health', title: lang === Language.EN ? 'Future-Proof Healthcare' : 'Gesundheitswesen', solution: 'RI-QKD Protocol', outcome: lang === Language.EN ? 'Regulatory-ready encryption for sensitive patient data flows.' : 'Regulierungskonforme Verschlüsselung.' },
        { id: 'supply', title: lang === Language.EN ? 'Supply Chain Integrity' : 'Lieferkettenintegrität', solution: 'Entanglement Verification', outcome: lang === Language.EN ? 'Physical-layer authentication of node identity.' : 'Authentifizierung der Knotenidentität auf physikalischer Ebene.' }
    ],
    protocols: [
        { name: 'Quantum Communication', desc: lang === Language.EN ? 'Secure key distribution across fiber/satellite.' : 'Sichere Schlüsselverteilung über Glasfaser/Satellit.' },
        { name: 'Protocol Selection', desc: 'BB84, E91, BBM92, RI-QKD.' },
        { name: 'System Integration', desc: lang === Language.EN ? 'Deploy into existing fiber without overhaul.' : 'Einsatz in bestehende Glasfaser ohne Überholung.' },
        { name: 'Custom Protocols', desc: lang === Language.EN ? 'Non-standard security requirements & compliance.' : 'Nicht-Standard-Sicherheitsanforderungen.' }
    ],
    engagement: [
        { title: 'Advisory', price: 'Retainer', items: [lang === Language.EN ? 'Access to quantum scientists' : 'Zugang zu Quantenwissenschaftlern', lang === Language.EN ? '"Ask us anything" support' : '"Fragen Sie uns alles" Support'] },
        { title: 'Project-Based', price: 'Fixed Scope', items: [lang === Language.EN ? 'End-to-end QKD deployment' : 'End-to-End QKD-Einsatz', lang === Language.EN ? 'Infrastructure integration' : 'Infrastruktur-Integration'] },
        { title: 'Training', price: 'Workshop', items: [lang === Language.EN ? 'Team certification' : 'Team-Zertifizierung', lang === Language.EN ? 'Security literacy' : 'Sicherheitskompetenz'] }
    ]
  },
  softwarePage: {
    hero: {
        title: lang === Language.EN ? "Your Quantum Data, Visible" : "Ihre Quantendaten, sichtbar",
        desc: lang === Language.EN 
            ? "Raw photon counts become intuitive dashboards. Entanglement quality becomes real-time alerts. Control your quantum layer with precision."
            : "Rohe Photonenzahlen werden zu intuitiven Dashboards. Verschränkungsqualität wird zu Echtzeit-Alarmen.",
        cta: lang === Language.EN ? "Launch Interactive Demo" : "Interaktive Demo starten"
    },
    capabilities: [
        { title: 'Qubit Visualization', desc: lang === Language.EN ? 'State tomography & density matrix plots.' : 'Zustandstomographie & Dichtematrix-Plots.' },
        { title: 'Entanglement Monitoring', desc: lang === Language.EN ? 'Real-time fidelity tracking & Bell verification.' : 'Echtzeit-Fidelitätsverfolgung & Bell-Verifikation.' },
        { title: 'Flux Rate Analytics', desc: lang === Language.EN ? 'Detection histograms & timing jitter analysis.' : 'Detektionshistogramme & Timing-Jitter-Analyse.' },
        { title: 'Post-Analysis Suite', desc: lang === Language.EN ? 'Error correction decoding & privacy amplification.' : 'Fehlerkorrektur-Decodierung & Privacy Amplification.' }
    ]
  },
  protocols: [
    { id: 'bbm92', name: 'BBM92', desc: lang === Language.EN ? 'Entanglement-based secure distribution' : 'Verschränkungsbasierte sichere Verteilung' },
    { id: 'bb84', name: 'BB84', desc: lang === Language.EN ? 'The gold standard of QKD' : 'Der Goldstandard von QKD' },
    { id: 'e91', name: 'E91', desc: lang === Language.EN ? 'Bell inequality verification' : 'Bellsche Ungleichungsverifikation' },
    { id: 'riqkd', name: 'RI-QKD', desc: lang === Language.EN ? 'Reference Independent Protocols' : 'Referenzunabhängige Protokolle' },
    { id: 'custom', name: 'CLIENT-SPECIFIC', desc: lang === Language.EN ? 'Bespoke implementation protocols' : 'Maßgeschneiderte Protokolle' }
  ],
  products: {
    title: lang === Language.EN ? 'Systems & Components' : 'Systeme & Komponenten',
    introText: lang === Language.EN 
        ? "We develop and deliver quantum key distribution (QKD) systems and modular components based on entangled photons, enabling cyber security solutions on the fundamentals of physical laws."
        : "Wir entwickeln und liefern Quantenschlüsselverteilungssysteme (QKD) und modulare Komponenten auf Basis verschränkter Photonen für Cyber-Sicherheitslösungen.",
    items: [
      {
        id: 'qkd',
        name: 'RAMQ',
        category: lang === Language.EN ? 'Network' : 'Netzwerk',
        description: lang === Language.EN ? 'Complete BBM92-based secure communication infrastructure.' : 'Komplette BBM92-basierte sichere Kommunikationsinfrastruktur.',
        features: ['BBM92 Protocol', 'Entanglement-Based', 'Modular Rack'],
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800',
        details: [
          { type: 'text', content: 'The RAMQ system represents the pinnacle of quantum-secure communication, utilizing polarization-entangled photon pairs to distribute secret keys.' },
          { type: 'table', headers: ['Parameter', 'Value'], rows: [['Fidelity', '> 98%'], ['Key Rate', '1.2 kbps @ 10km'], ['Form Factor', '19" Rackmount']] }
        ]
      },
      {
        id: 'sources',
        name: 'HD Photon Sources',
        category: lang === Language.EN ? 'Photonics' : 'Photonik',
        description: lang === Language.EN ? 'High-fidelity entangled photon pair generation modules.' : 'Module zur Erzeugung verschränkter Photonenpaare mit hoher Fidelität.',
        features: ['Space Qualified', 'Fidelity > 97%', 'Sub-ns Timing'],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'pam',
        name: 'Polarization Analyzing Module',
        category: lang === Language.EN ? 'Measurement' : 'Messung',
        description: lang === Language.EN ? 'Polarization Analyzing Modules for precise state verification.' : 'Polarisationsanalysemodule zur präzisen Zustandsprüfung.',
        features: ['Passive Elements', 'High Extinction', 'Quad-Channel'],
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
        details: [
          { type: 'text', content: 'PAM → Basis (RL optional): H/V, D/A, R/L polarization; option for 850 and custom wavelength' }
        ]
      },
      {
        id: 'pcm',
        name: 'Polarization Correction Module',
        category: lang === Language.EN ? 'Hardware' : 'Hardware',
        description: lang === Language.EN ? 'Active Polarization Correction Module for fiber drift compensation.' : 'Aktives Polarisationskorrekturmodul zur Kompensation von Faserdrifts.',
        features: ['Real-time Correction', 'Low Insertion Loss', 'Auto-Feedback Loop'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
      }
    ] as Product[]
  },
  journey: [
    {
      year: '2025',
      title: lang === Language.EN ? 'Genesis Node' : 'Genesis-Knoten',
      content: lang === Language.EN 
        ? "In the heart of Jena's Optics Valley, we stabilized our first 405nm entangled source. It wasn't just an experiment; it was the proof that physics could outpace algorithms."
        : "Im Herzen des Jenaer Optics Valley haben wir unsere erste verschränkte 405-nm-Quelle stabilisiert. Es war der Beweis, dass Physik Algorithmen übertreffen kann.",
      tag: 'R&D',
      stats: 'Fidelity 92%',
      icon: 'solar:atom-bold-duotone'
    },
    {
      year: '2026',
      title: lang === Language.EN ? 'The First Mile' : 'Die erste Meile',
      content: lang === Language.EN
        ? "We laid the first dark fiber link between the university and the city bank. 12km of absolute security. The noise floor was high, but our active polarization correction held the line."
        : "Wir verlegten die erste Dark-Fiber-Verbindung zwischen Universität und Stadtbank. 12 km absolute Sicherheit.",
      tag: 'Deployment',
      stats: '12km Link',
      icon: 'solar:routing-2-bold-duotone'
    },
    {
      year: 'NOW',
      title: lang === Language.EN ? 'Metropolitan Grid' : 'Stadtnetz',
      content: lang === Language.EN
        ? "You are joining us as we scale. Our network now self-heals, routing keys around breaks. We are not just sending photons; we are building the immune system of the internet."
        : "Sie begleiten uns bei der Skalierung. Unser Netzwerk heilt sich jetzt selbst und leitet Schlüssel um Unterbrechungen herum.",
      tag: 'Scaling',
      stats: 'Active User',
      icon: 'solar:city-bold-duotone'
    },
    {
      year: 'FUTURE',
      title: lang === Language.EN ? 'Orbital Uplink' : 'Orbitaler Uplink',
      content: lang === Language.EN
        ? "The fiber ends, but the sky doesn't. We are space-qualifying our sources for LEO integration. Global, instant, unhackable keys from above. This is the horizon."
        : "Die Faser endet, aber der Himmel nicht. Wir qualifizieren unsere Quellen für die LEO-Integration. Globale, unhackbare Schlüssel von oben.",
      tag: 'Vision',
      stats: 'Global',
      icon: 'solar:planet-bold-duotone'
    }
  ] as JourneyMilestone[],
  about: {
    title: lang === Language.EN ? 'QuDay Team' : 'QuDay Team',
    vision: lang === Language.EN 
      ? "Born in Jena's Optics Valley, QuDay transforms sub-nanosecond photon distribution into a globally scalable security standard."
      : "Geboren im Jenaer Optics Valley, verwandelt QuDay die Photonenverteilung in einen weltweit skalierbaren Sicherheitsstandard.",
    values: [
      { title: lang === Language.EN ? 'Sovereignty' : 'Souveränität', desc: 'Independent European-made IP.' },
      { title: lang === Language.EN ? 'Integrity' : 'Integrität', desc: 'Physical-layer verification.' },
      { title: lang === Language.EN ? 'Research' : 'Forschung', desc: 'Deep-tech engineering.' }
    ]
  },
  team: [
    {
      id: '1',
      name: 'Uday Chandrashekhara',
      role: lang === Language.EN ? 'Founder & CEO' : 'Gründer & CEO',
      bio: lang === Language.EN 
        ? 'Pioneering the commercialization of quantum entanglement. Focusing on scalable architecture and strategic vision.' 
        : 'Pionierarbeit bei der Kommerzialisierung der Quantenverschränkung. Fokus auf skalierbare Architektur und strategische Vision.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      linkedin: 'https://www.linkedin.com/in/udaychandrashekara/'
    },
    {
      id: '2',
      name: 'Koushik D',
      role: lang === Language.EN ? 'Co-Founder & CTO' : 'Mitgründer & CTO',
      bio: lang === Language.EN 
        ? 'Leading the engineering of physical-layer security protocols and optical hardware integration.' 
        : 'Leitet das Engineering der Sicherheitsprotokolle auf physikalischer Ebene und die Integration optischer Hardware.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      linkedin: 'https://www.linkedin.com/in/koushikd21/'
    },
    {
      id: '3',
      name: 'Krishank D Boswan',
      role: lang === Language.EN ? 'Co-Founder & COO' : 'Mitgründer & COO',
      bio: lang === Language.EN 
        ? 'Orchestrating the operational deployment of quantum nodes and global supply chain logistics.' 
        : 'Orchestrierung des operativen Einsatzes von Quantenknoten und der globalen Lieferkettenlogistik.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      linkedin: 'https://www.linkedin.com/in/krishank-d-boswan-343894226/'
    }
  ] as TeamMember[],
  news: [
    { id: 'n1', date: 'AUG 2025', title: 'Network Upgrade', excerpt: 'Successful 12-node deployment in the Jena metropolitan area.', category: 'Deployment' },
    { id: 'n2', date: 'JUL 2025', title: 'Space Readiness', excerpt: 'Environmental testing complete for upcoming satellite integration.', category: 'Aerospace' }
  ] as NewsArticle[],
  faqs: [
    { question: 'What is BBM92?', answer: 'An entanglement-based protocol that provides inherent security against eavesdropping.' },
    { question: 'Why Jena?', answer: 'Jena is a global hub for optics and photonics, providing unparalleled research infrastructure.' }
  ] as FAQItem[],
  contact: {
    title: lang === Language.EN ? 'Connect with Us' : 'Kontaktieren Sie uns',
    desc: lang === Language.EN 
      ? 'Establish a secure handshake with our engineering team for specialized QKD inquiries.' 
      : 'Etablieren Sie einen sicheren Handshake mit unserem Ingenieurteam für spezialisierte QKD-Anfragen.',
    labels: {
      identity: 'Full Name',
      endpoint: 'Business Email',
      project: 'How can we help?',
      transmission: 'Details',
      cta: lang === Language.EN ? 'Connect with Us' : 'Verbinden Sie sich mit uns'
    }
  },
  footer: {
    rights: '© 2025 QuDay QUANTUM TECHNOLOGIES GMBH. JENA, GERMANY.',
    newsletter: 'Quantum Pulse',
    success: 'Securely Subscribed.'
  }
});