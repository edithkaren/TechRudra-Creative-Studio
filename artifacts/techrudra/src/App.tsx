import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Check,
  Circle,
  Mail,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type WorkItem = {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  color: string;
  number: string;
  shape: 'orbit' | 'wave' | 'grid' | 'petal';
};

const workItems: WorkItem[] = [
  {
    id: 'aether',
    title: 'Aether / 01',
    client: 'Aether Objects',
    category: 'Brand world',
    year: '2024',
    description: 'A living identity for objects designed to outlast the room.',
    color: 'coral',
    number: '01',
    shape: 'orbit',
  },
  {
    id: 'monument',
    title: 'Monument Valley',
    client: 'Field Notes',
    category: 'Digital experience',
    year: '2024',
    description: 'A scrollable atlas of the people who keep cities moving.',
    color: 'lime',
    number: '02',
    shape: 'wave',
  },
  {
    id: 'sora',
    title: 'Sora Radio',
    client: 'Sora',
    category: 'Campaign',
    year: '2023',
    description: 'A nocturnal broadcast identity built from signal, sound and sky.',
    color: 'violet',
    number: '03',
    shape: 'grid',
  },
  {
    id: 'common',
    title: 'Common Ground',
    client: 'Common Ground',
    category: 'Digital experience',
    year: '2023',
    description: 'A participatory map for finding the places we share.',
    color: 'cream',
    number: '04',
    shape: 'petal',
  },
];

const services = [
  ['01', 'World-building', 'Brand systems, visual languages and the little details that make an idea feel inevitable.'],
  ['02', 'Digital theatre', 'Websites and interactive stories that know when to move, and when to hold a gaze.'],
  ['03', 'Generative craft', 'Useful AI, art direction and strange new tools for making work with a pulse.'],
];

function useReveal() {
  const [visible, setVisible] = useState<Set<string>>(new Set());

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      setVisible(new Set(nodes.map((node) => node.dataset.reveal ?? '')));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((current) => {
          const next = new Set(current);
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.getAttribute('data-reveal') ?? '');
          });
          return next;
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (id: string) => visible.has(id);
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function Header({ onInquiry }: { onInquiry: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['Work', '#work'],
    ['Approach', '#approach'],
    ['Services', '#services'],
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
      <a className="wordmark" href="#top" data-testid="link-home" onClick={closeMenu}>
        <BrandMark />
        <span>techrudra</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a href={href} key={href} data-testid={`link-${label.toLowerCase()}`}>
            {label}
          </a>
        ))}
      </nav>
      <button className="header-cta" onClick={onInquiry} data-testid="button-header-inquiry">
        Start a project <ArrowUpRight size={15} strokeWidth={1.8} />
      </button>
      <button
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen((open) => !open)}
        data-testid="button-menu-toggle"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <a href={href} key={href} onClick={closeMenu} data-testid={`mobile-link-${label.toLowerCase()}`}>
              {label} <ArrowUpRight size={17} />
            </a>
          ))}
          <button onClick={() => { closeMenu(); onInquiry(); }} data-testid="button-mobile-inquiry">
            Start a project <ArrowUpRight size={17} />
          </button>
        </nav>
      )}
    </header>
  );
}

function VisualMark({ shape, color }: { shape: WorkItem['shape']; color: string }) {
  return (
    <div className={`work-visual visual-${shape} tone-${color}`} aria-hidden="true">
      <span className="visual-number">/ {shape === 'orbit' ? 'a' : shape === 'wave' ? 'm' : shape === 'grid' ? 's' : 'c'}</span>
      <div className="visual-core" />
      <div className="visual-line line-one" />
      <div className="visual-line line-two" />
      <div className="visual-line line-three" />
    </div>
  );
}

function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <article className={`work-card work-card-${index + 1}`} data-testid={`card-work-${item.id}`}>
      <div className="work-card-top">
        <span>{item.number} / {item.category}</span>
        <span>{item.year}</span>
      </div>
      <VisualMark shape={item.shape} color={item.color} />
      <div className="work-card-bottom">
        <div>
          <p className="eyebrow">{item.client}</p>
          <h3>{item.title}</h3>
          <p className="work-description">{item.description}</p>
        </div>
        <button className="round-arrow" aria-label={`View ${item.title}`} data-testid={`button-view-work-${item.id}`}>
          <ArrowUpRight size={18} />
        </button>
      </div>
    </article>
  );
}

function InquiryModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', brief: '' });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.name.trim() && form.email.trim() && form.brief.trim()) setSent(true);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
        <button className="modal-close" onClick={onClose} aria-label="Close project inquiry" data-testid="button-close-inquiry">
          <X size={20} />
        </button>
        {sent ? (
          <div className="success-state">
            <div className="success-icon"><Check size={25} /></div>
            <p className="eyebrow">Transmission received</p>
            <h2>Good ideas have a way of finding each other.</h2>
            <p>We&apos;ll be in touch at {form.email} within a few days.</p>
            <button className="text-link" onClick={onClose} data-testid="button-close-success">Back to the studio <ArrowUpRight size={16} /></button>
           </div>
        ) : (
          <>
            <p className="eyebrow">Let&apos;s make a mark</p>
            <h2 id="inquiry-title">Tell us the thing<br /><em>you can&apos;t stop thinking about.</em></h2>
            <form onSubmit={submit}>
              <label>
                Your name
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Rudraksh Paliwal" data-testid="input-inquiry-name" />
              </label>
              <label>
                Where can we reach you?
                <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="hello@yourstudio.com" data-testid="input-inquiry-email" />
              </label>
              <label>
                A few words about the idea
                <textarea required rows={3} value={form.brief} onChange={(event) => setForm({ ...form, brief: event.target.value })} placeholder="It starts with..." data-testid="input-inquiry-brief" />
              </label>
              <button className="submit-button" type="submit" data-testid="button-submit-inquiry">Send into the ether <ArrowUpRight size={17} /></button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function Home() {
  const reveal = useReveal();
  const [activeFilter, setActiveFilter] = useState('All work');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const filters = ['All work', 'Brand world', 'Digital experience', 'Campaign'];
  const filteredWork = useMemo(
    () => activeFilter === 'All work' ? workItems : workItems.filter((item) => item.category === activeFilter),
    [activeFilter],
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      node.style.setProperty('--mouse-x', `${x * 16}px`);
      node.style.setProperty('--mouse-y', `${y * 11}px`);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <main className="site-shell" id="top">
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
      <Header onInquiry={() => setInquiryOpen(true)} />

      <section className="hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="hero-grid" />
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="hero-content">
          <p className="kicker hero-kicker"><span className="pulse-dot" /> Independent creative studio / New Delhi — Worldwide</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-line hero-line-one">Make <em>them</em></span>
            <span className="hero-line hero-line-two">feel something.</span>
          </h1>
          <div className="hero-foot">
            <p className="hero-intro">TechRudra is an AI creative studio for people with a stubborn idea and a little bit of nerve.</p>
            <a className="scroll-cue" href="#manifesto" data-testid="link-scroll-manifesto">
              <span>Enter slowly</span>
              <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <div className="hero-side-note">TR / 001</div>
        <div className="hero-stamp"><Asterisk size={17} /> Remember this</div>
      </section>

      <section className="manifesto section-dark" id="manifesto">
        <div className="section-index">01 <span>Point of view</span></div>
        <div className={`manifesto-copy ${reveal('manifesto-copy') ? 'is-visible' : ''}`} data-reveal="manifesto-copy">
          <p className="eyebrow">A note from the studio</p>
          <h2>Good work doesn&apos;t fill a screen.<br /><span>It leaves a trace.</span></h2>
          <p className="manifesto-detail">We make identities, websites and digital worlds for ideas that deserve more than a template. Human instinct leads. Technology follows close behind, carrying the impossible bits.</p>
          <a className="text-link light-link" href="#approach" data-testid="link-read-approach">Read our approach <MoveUpRight size={16} /></a>
        </div>
        <div className="manifesto-orbit" aria-hidden="true">
          <div className="orbit-ring ring-a" />
          <div className="orbit-ring ring-b" />
          <span className="orbit-label">curiosity<br />over certainty</span>
          <span className="orbit-cross">+</span>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / Selected work</p>
            <h2>Things we&apos;ve<br /><em>set in motion.</em></h2>
          </div>
          <p className="section-aside">A small selection of collaborations, experiments and happy accidents.</p>
        </div>
        <div className="filter-row" role="tablist" aria-label="Filter selected work">
          {filters.map((filter) => (
            <button
              key={filter}
              role="tab"
              aria-selected={activeFilter === filter}
              className={activeFilter === filter ? 'active' : ''}
              onClick={() => setActiveFilter(filter)}
              data-testid={`button-filter-${filter.toLowerCase().replaceAll(' ', '-')}`}
            >
              {filter} <span>{filter === 'All work' ? workItems.length : workItems.filter((item) => item.category === filter).length}</span>
            </button>
          ))}
        </div>
        <div className="work-grid" data-testid="grid-selected-work">
          {filteredWork.map((item, index) => <WorkCard item={item} index={index} key={item.id} />)}
        </div>
        <div className="work-footer"><span>More in the making</span><span className="footer-rule" /><span>Scroll to continue</span></div>
      </section>

      <section className="services-section section-dark" id="services">
        <div className="section-index">03 <span>What we do</span></div>
        <div className="services-intro">
          <p className="eyebrow">Useful magic</p>
          <h2>The right amount<br />of <em>strange.</em></h2>
          <p>We don&apos;t sell a menu. We bring the right mix of thinking, making and technical mischief to the table.</p>
        </div>
        <div className="services-list">
          {services.map(([number, title, copy]) => (
            <div className="service-row" key={number} data-testid={`row-service-${number}`}>
              <span className="service-number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <ArrowUpRight className="service-arrow" size={21} />
            </div>
          ))}
        </div>
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-top">
          <div className="section-index">04 <span>How we think</span></div>
          <p className="eyebrow">The studio loop</p>
        </div>
        <div className="approach-title">
          <h2>We start with a <em>question.</em><br />We leave with a world.</h2>
          <div className="approach-orbit" aria-hidden="true"><Circle size={11} /><div /><span>01—04</span></div>
        </div>
        <div className="process-steps">
          {[
            ['01', 'Listen harder', 'Before we make a move, we find the tension. The useful bit hiding between what you say and what you mean.'],
            ['02', 'Build a strange draft', 'Rough edges are evidence of life. We get a version on its feet quickly, then follow the energy.'],
            ['03', 'Make it feel inevitable', 'Craft is the quiet work: rhythm, type, transitions, the one detail nobody can name but everyone remembers.'],
            ['04', 'Release it into the wild', 'A good experience keeps growing after launch. We leave you with a living system, not a locked box.'],
          ].map(([number, title, copy]) => (
            <div className="process-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="interlude" aria-label="Studio statement">
        <div className="interlude-noise" />
        <div className="interlude-copy">
          <Sparkles size={18} />
          <p>Technology is the material.<br /><strong>Wonder is the outcome.</strong></p>
        </div>
        <span className="interlude-caption">A practice for the beautifully unfinished</span>
      </section>

      <section className="inquiry-section" id="contact">
        <div className="inquiry-star"><Asterisk size={27} strokeWidth={1.2} /></div>
        <p className="eyebrow">05 / Open channel</p>
        <h2>Got a feeling<br /><em>about something?</em></h2>
        <p className="inquiry-sub">Tell us before it becomes a sensible idea.</p>
        <button className="big-cta" onClick={() => setInquiryOpen(true)} data-testid="button-open-inquiry">
          Start a project <ArrowUpRight size={21} />
        </button>
        <div className="inquiry-meta">
          <a href="mailto:hello@techrudra.studio" data-testid="link-email"><Mail size={15} /> hello@techrudra.studio</a>
          <span>Based in India / working everywhere</span>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top" data-testid="link-footer-home"><BrandMark /><span>techrudra</span></a>
        <p>Ideas in, memories out.</p>
        <div><span>© 2024 TechRudra</span><a href="#top" data-testid="link-back-top">Back to top <ArrowUpRight size={14} /></a></div>
      </footer>
      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
