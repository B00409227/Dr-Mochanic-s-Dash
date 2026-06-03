import Link from 'next/link'
import type { Metadata } from 'next'

const ARTICLES: Record<string, { title: string; date: string; category: string; content: string }> = {
  'check-engine-light-explained': {
    title: 'Check Engine Light: What It Actually Means',
    date: '2025-05-01',
    category: 'Diagnostics',
    content: `That little orange engine symbol on your dashboard — officially called the Malfunction Indicator Lamp (MIL) — is responsible for more anxiety than almost any other warning light. But should you panic? Not necessarily. Let's break it down.

**What triggers the check engine light?**

Your car's Engine Control Unit (ECU) constantly monitors hundreds of sensors. When a reading falls outside the expected range for more than a set number of engine cycles, it logs a fault code (called a DTC — Diagnostic Trouble Code) and illuminates the check engine light.

The codes range from genuinely serious (like P0300 — multiple misfires, which can destroy a catalytic converter) to completely harmless (like P0442 — a tiny EVAP leak, usually caused by a loose fuel cap).

**Is it serious?**

Here's the key: the check engine light itself doesn't tell you severity. You need to read the code. The fastest way to do this is with a £15 OBD2 dongle from Amazon and a free app — or use Dr Mochanic's Dash app to scan your dashboard and get an AI explanation instantly.

**Immediate steps to take**

1. Check if the light is solid or flashing. A flashing light means an active misfire — pull over safely and don't drive. A solid light is less urgent but still needs attention.
2. Check your fuel cap is tight. Seriously — this causes around 10% of check engine lights.
3. Look for other symptoms: rough idle, power loss, smoke, unusual smells.
4. If the car drives normally and there are no other symptoms, you can continue driving carefully to a garage — but don't ignore it.

**Common causes by frequency**

The most common check engine codes in UK cars are: oxygen sensor failure (P013x), catalytic converter efficiency (P0420), EVAP system leaks (P044x), MAF sensor issues (P010x), and ignition coil/misfire codes (P030x).

**When to visit Dr Mochanic, Glasgow**

If your check engine light is flashing, if the car is running rough, if you're seeing coolant loss, or if the light stays on after trying the fuel cap — bring it in. We'll run a full diagnostic with our AI system and have a written report ready before we even start work.

Book at drmochanic.co.uk/book or use the Dr Mochanic's Dash app to pre-diagnose from home.`,
  },
  'tyre-tread-20p-test': {
    title: 'The 20p Tyre Test: How to Check Your Tread at Home',
    date: '2025-04-22',
    category: 'Safety',
    content: `Your tyres are the only part of your car in contact with the road. Everything — braking, steering, acceleration — depends on them having enough tread. Here's how to check yours in 60 seconds.

**The legal minimum**

In the UK, the legal minimum tread depth is 1.6mm across the central three-quarters of the tyre, around the full circumference. Driving below this limit is an immediate MOT failure, a £2,500 fine, and three penalty points per tyre.

**The 20p coin test**

Take a 20p coin and insert it into the tread grooves. The outer band of a 20p coin measures approximately 2mm.

If you can see the outer band when the coin is in the groove: your tread is below 3mm and you should be monitoring closely or replacing soon. If the outer band disappears entirely: you have more than 3mm of tread and your tyres are legal. If you can see the outer band and the numbers on the coin: you are dangerously close to or below the legal limit.

**When to replace?**

Most tyre professionals recommend replacing at 3mm rather than waiting until 1.6mm. Tests show that a car with 1.6mm tread takes significantly longer to stop in wet conditions than one with 3mm.

**Uneven wear**

Check for uneven wear patterns. Wear on the outer edges means your tyres are under-inflated. Wear in the centre means they are over-inflated. Wear on one edge only suggests a wheel alignment problem.

**Using the Dr Mochanic Dash app**

The tyre check feature in our app lets you photograph each tyre and uses AI to estimate tread depth and identify wear patterns. It'll tell you if they are safe, warn you when they are getting close, and estimate how many miles you have left.

Need new tyres or alignment? Bring it into Dr Mochanic, Glasgow — book at drmochanic.co.uk/book.`,
  },
  'obd2-explained': {
    title: "OBD2 Explained: Read Your Car's Mind with a £15 Dongle",
    date: '2025-04-10',
    category: 'Technology',
    content: `Since 1996, every car sold in the UK and EU has been required to include an OBD2 (On-Board Diagnostics, second generation) port. This little 16-pin socket is your direct line into your car's brain — and most drivers have no idea it exists.

**Where is the OBD2 port?**

It's almost always under the dashboard on the driver's side, within arm's reach of the steering column. Some cars hide it behind a panel or inside the glovebox.

**What can you read from it?**

With an ELM327 Bluetooth dongle (available for £10–£20 on Amazon) connected to your phone, you can read: live sensor data (RPM, speed, coolant temperature, throttle position, fuel trims, engine load), stored fault codes (DTCs) that triggered your check engine light, pending codes that haven't triggered the light yet, and emissions readiness monitors.

**Understanding fault codes**

OBD2 codes follow a standard format: a letter (P=powertrain, B=body, C=chassis, U=network), followed by four digits. P0 codes are standardised across all manufacturers. P1 codes are manufacturer-specific. Common ones to know: P0300 series = misfires, P0420/P0430 = catalytic converter, P017x = fuel mixture, P0440 series = fuel evaporative system.

**Using Dr Mochanic's Dash**

Our app's OBD2 tab connects to your dongle via Bluetooth and shows live gauges for all key readings. The Live Tuning mode gives you real-time AI analysis — like having a mechanic riding co-pilot, watching your data and flagging anything unusual.

The code lookup feature explains every code in plain English, with fix steps and cost estimates. No more Googling cryptic codes.

Ready to try it? Open Dr Mochanic's Dash at drmochanic.co.uk — free, no account needed. Or visit us in Glasgow at drmochanic.co.uk/book.`,
  },
  'brake-replacement-signs': {
    title: '5 Signs Your Brakes Need Replacing Right Now',
    date: '2025-03-28',
    category: 'Safety',
    content: `Your brakes are not optional equipment. They are the single most critical safety system on your car. Here are five signs that should send you straight to a garage.

**1. Squealing or squeaking**

Most modern brake pads include a built-in wear indicator — a small metal tab that contacts the disc when the pad wears down to around 2–3mm. This creates a high-pitched squeal specifically designed to be heard through the cabin. If you hear consistent squealing when braking (not just first thing in the morning after rain), your pads need replacing soon.

**2. Grinding noise**

This is more serious. Grinding means the pad material has worn through completely and metal is contacting metal. At this point, you are damaging the disc with every application of the brakes, turning a £80 pad job into a £200+ disc replacement. Get it seen immediately.

**3. Longer stopping distances**

If your car feels like it needs more pedal pressure than usual to stop, or your stopping distances feel longer, this could be worn pads, glazed discs, air in the brake lines, or brake fluid degradation. All need professional attention.

**4. Pulling to one side under braking**

If the car pulls left or right when you brake, one side is braking harder than the other. Common causes: seized caliper, uneven pad wear, or a brake fluid leak. This is a safety issue — book it in.

**5. Brake pedal vibration or pulsing**

A pulsing pedal under braking usually means warped brake discs. This happens when discs overheat repeatedly (often from riding the brakes downhill). The discs need to be machined or replaced.

**How often should brakes be replaced?**

Front pads typically last 30,000–60,000 miles. Rear pads last longer. Discs can last 70,000–100,000 miles if not damaged. But these are just averages — driving style makes a massive difference.

Worried about your brakes? Bring your car into Dr Mochanic, Glasgow — we will inspect them for free as part of any service booking. Book at drmochanic.co.uk/book.`,
  },
  'oil-change-frequency': {
    title: 'How Often Should You Actually Change Your Oil?',
    date: '2025-03-15',
    category: 'Maintenance',
    content: `The old advice was every 3,000 miles. But that was written for conventional oil in 1970s engines. Modern cars with synthetic oil and variable valve timing are a very different story.

**The honest answer: it depends**

Your car's owner's manual is your definitive source. Most modern cars with full synthetic oil specify 10,000–15,000 mile or annual oil changes, whichever comes first. Some BMW and VAG group cars now specify 18,000 miles. Older cars with conventional oil might need it every 5,000–7,500 miles.

**Why oil degrades**

Engine oil does several jobs: it lubricates moving parts, reduces friction and heat, carries dirt and metal particles to the filter, and provides a protective film on engine components. Over time and heat cycles, the base oil breaks down, additives are depleted, and the oil becomes contaminated with combustion byproducts.

**The risk of going too long**

Old, degraded oil becomes thick and sludgy. It stops flowing properly to all parts of the engine — particularly the top end, where variable camshaft actuators are notoriously sensitive. The result can be expensive: stretched timing chains, damaged VVT solenoids, or full engine seizure in extreme cases.

**Signs your oil needs changing**

Your oil change warning light has come on. The oil on the dipstick is black and gritty rather than amber. The engine sounds noisier than usual at cold start. You notice a burning smell from the engine.

**What oil to use?**

Always use the grade specified in your owner's manual. For most modern European cars this is 5W-30 or 5W-40 full synthetic. Using the wrong grade can void your warranty and cause real damage.

Need an oil change? Dr Mochanic, Glasgow offers oil and filter changes from £39 with same-day slots available. Book at drmochanic.co.uk/book.`,
  },
  'mot-preparation-checklist': {
    title: 'MOT Preparation: 10-Point Checklist to Pass First Time',
    date: '2025-03-01',
    category: 'MOT',
    content: `Around 35% of vehicles fail their MOT on their first attempt. The frustrating thing? Many of these failures are on simple, preventable issues that the owner could have fixed for free or under a tenner before the test.

Here is your 10-point pre-MOT checklist.

**1. Lights**
Check every single light: headlights (main beam and dipped), indicators (front and rear), brake lights, fog lights, reversing lights, number plate light. Have a friend walk around while you test each one. A single blown bulb is an MOT failure.

**2. Tyres**
Use the 20p test (see our tyre guide) on all four tyres. Check tread is above 1.6mm and look for cracks, bulges, or cuts in the sidewall. Check tyre pressure too.

**3. Windscreen**
Any chip or crack in the driver's line of vision (Zone A) larger than 10mm is a failure. Even outside Zone A, chips larger than 40mm fail. Get chips repaired before the test — most insurance policies cover this.

**4. Wipers and washers**
Blades must clear the screen effectively. Washer fluid reservoir must be full. Torn or smearing blades are a failure.

**5. Brakes**
If you feel anything abnormal — grinding, squealing, pulling, pulsing — have your brakes inspected before the test.

**6. Horn**
Press it. It must work. Takes 2 seconds to check.

**7. Steering**
Check for any looseness, clunking, or pulling when driving straight. Have the steering inspected if uncertain.

**8. Exhaust**
Check for obvious holes, excessive smoke, or strong smells under acceleration. A blowing exhaust joint is a common failure.

**9. Number plates**
Must be clean, intact, and the correct font. No cracks, faded characters, or non-standard formatting.

**10. Warning lights**
If any warning light is illuminated on your dashboard when the car is running (other than the seatbelt light after belting up), it will fail. Use Dr Mochanic's Dash to diagnose and fix any issues before your test.

**Book a pre-MOT check**

Dr Mochanic, Glasgow offers a pre-MOT inspection to identify and fix issues before your official test. Book at drmochanic.co.uk/book — same-day slots available.

Visit Dr Mochanic — Glasgow's AI Garage | drmochanic.co.uk`,
  },
}

export function generateStaticParams() {
  return Object.keys(ARTICLES).map(slug => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = ARTICLES[params.slug]
  if (!article) return { title: 'Blog - Dr Mochanic' }
  return { title: `${article.title} | Dr Mochanic Blog`, description: article.content.slice(0, 160) }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug]
  if (!article) return <div className="p-8 text-center" style={{ color: 'var(--muted)' }}>Article not found.</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/blog" className="text-sm font-rajdhani mb-6 inline-block" style={{ color: 'var(--cyan)' }}>← Back to Blog</Link>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>{article.category}</span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>{article.date}</span>
        </div>
        <h1 className="font-orbitron text-2xl sm:text-3xl leading-snug" style={{ color: 'var(--text)' }}>{article.title}</h1>
        <p className="text-sm font-rajdhani" style={{ color: 'var(--muted)' }}>By Dr Mochanic, Glasgow</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-4">
        {article.content.split('\n\n').map((para, i) => {
          if (para.startsWith('**') && para.endsWith('**')) {
            return <h2 key={i} className="font-rajdhani font-bold text-xl mt-6 mb-2" style={{ color: 'var(--cyan)' }}>{para.replace(/\*\*/g, '')}</h2>
          }
          if (para.startsWith('**') && para.includes('**')) {
            return <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--text)', opacity: 0.9 }} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          }
          return <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--text)', opacity: 0.85 }}>{para}</p>
        })}
      </div>

      <div className="mt-10 p-5 rounded-xl text-center space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>Need a hand? Book at Dr Mochanic, Glasgow</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Glasgow&apos;s AI-powered garage — honest pricing, expert technicians, same-day slots.</p>
        <Link href="/book" className="btn-red inline-block">Book a Service</Link>
      </div>

      <div className="text-center mt-8 text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
