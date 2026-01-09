import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { PANELS } from '@/types'

const FEATURED_PANELS = ['P1', 'P3', 'P4', 'P10', 'P15', 'P16'] as const

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">POTRZEBNY.AI</span>
              <span className="mt-2 block text-primary">
                Platforma EdTech & MedTech
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              22 specjalistyczne panele zasilane AI. Dla nauczycieli, terapeutów,
              lekarzy, studentów i pacjentów. Personalizacja, dostępność, RODO compliance.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto">
                  Rozpocznij za darmo
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Zobacz cennik
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">22</p>
              <p className="mt-1 text-sm text-gray-600">Panele specjalistyczne</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">4</p>
              <p className="mt-1 text-sm text-gray-600">Modele AI</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">RODO</p>
              <p className="mt-1 text-sm text-gray-600">Art. 9 Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">24/7</p>
              <p className="mt-1 text-sm text-gray-600">Dostępność</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Panels */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Wybrane Panele
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Odkryj możliwości platformy POTRZEBNY.AI
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PANELS.map(panelId => {
              const panel = PANELS[panelId]
              return (
                <Card key={panel.id} variant="panel">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{panel.name}</CardTitle>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        panel.price === 0
                          ? 'bg-success/10 text-success'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {panel.price === 0 ? 'DARMOWY' : `${panel.price} PLN/mies.`}
                      </span>
                    </div>
                    <CardDescription>{panel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {panel.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <svg className="mr-2 h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/dashboard/${panel.slug}`} className="mt-6 block">
                      <Button variant="outline" className="w-full">
                        Rozpocznij
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/pricing">
              <Button variant="link" className="text-lg">
                Zobacz wszystkie 22 panele &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="bg-gradient-to-r from-adhd-bg via-dyslexia-bg to-asd-bg py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Dostępność dla wszystkich
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tryby dla osób z ADHD, dysleksją i ASD
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card className="border-adhd-border bg-adhd-bg">
              <CardHeader>
                <CardTitle className="text-adhd-text">Tryb ADHD</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-adhd-text/80">
                  Zoptymalizowany interfejs z redukcją rozpraszaczy,
                  technikami dopaminowymi i systemem gamifikacji.
                </p>
              </CardContent>
            </Card>

            <Card className="border-dyslexia-border bg-dyslexia-bg">
              <CardHeader>
                <CardTitle className="text-dyslexia-text">Tryb Dysleksja</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-dyslexia-text/80">
                  Czcionka OpenDyslexic, zwiększone odstępy,
                  tło przyjazne dla oczu i wsparcie Text-to-Speech.
                </p>
              </CardContent>
            </Card>

            <Card className="border-asd-border bg-asd-bg">
              <CardHeader>
                <CardTitle className="text-asd-text">Tryb ASD</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-asd-text/80">
                  Przewidywalny układ, czytelne instrukcje,
                  redukcja bodźców sensorycznych i wsparcie rutyn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Gotowy na start?
          </h2>
          <p className="mt-4 text-xl text-white/80">
            Dołącz do platformy POTRZEBNY.AI już dziś
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="xl" variant="secondary">
                Utwórz konto za darmo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-gray-500">
              &copy; 2024 POTRZEBNY.AI. Wszelkie prawa zastrzeżone.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link href="/about" className="text-gray-500 hover:text-gray-900">
                O nas
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                Polityka prywatności
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                Regulamin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
