"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, ArrowRight, Star, Zap, Shield, Users, BarChart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Repetição Espaçada",
      description: "Memorize conteúdos de forma eficiente com revisões inteligentes.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Estudo Ativo",
      description: "Responda perguntas e estimule o raciocínio para fixar o aprendizado.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Personalização",
      description: "Monte seus próprios decks e organize temas conforme sua necessidade.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Acompanhamento de Progresso",
      description: "Veja seu desempenho e evolua constantemente.",
      icon: <Star className="size-5" />,
    },
    {
      title: "Interface Intuitiva",
      description: "Estude com facilidade em um ambiente moderno e responsivo.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "Segurança",
      description: "Seus dados protegidos e privacidade garantida.",
      icon: <Shield className="size-5" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col w-full">
      <header className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}>
        <div className="mx-auto w-full max-w-[1600px] flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white">F</div>
            <span>FlashCard</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Metodologia</Link>
            <Link href="#benefits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Benefícios</Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Login</Link>
            <Button className="rounded-full" asChild>
              <Link href="/login">Começar Agora <ChevronRight className="ml-1 size-4" /></Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center">
          <div className="w-full max-w-[1600px] px-4 md:px-6 relative mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Estude de forma inteligente</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-400">FlashCard</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">A plataforma que potencializa sua memorização e aprendizado com flashcards personalizados.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full h-12 px-8 text-base" asChild>
                  <Link href="/login">Começar Agora <ArrowRight className="ml-2 size-4" /></Link>
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative mx-auto max-w-5xl">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                {/* Espaço para imagem do sistema */}
                <div className="w-full h-[300px] flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-lg">Imagem do sistema aqui</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Metodologia Section */}
        <section id="features" className="w-full py-20 md:py-32 flex justify-center">
          <div className="w-full max-w-[1600px] px-4 md:px-6 mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Metodologia</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Como funciona o FlashCard?</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Crie perguntas e respostas, revise de forma ativa e acompanhe seu progresso. O método de repetição espaçada garante que você memorize de verdade!</p>
            </motion.div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefícios Section */}
        <section id="benefits" className="w-full py-20 md:py-32 bg-blue-50 flex justify-center">
          <div className="w-full max-w-[1600px] px-4 md:px-6 mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Benefícios</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Por que usar FlashCards?</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Veja como os flashcards podem transformar seu estudo e memorização.</p>
            </motion.div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <li className="bg-white rounded-lg p-6 shadow text-gray-700 flex items-center text-lg"><span className="text-blue-500 font-bold mr-2">✔</span> Memorização acelerada</li>
              <li className="bg-white rounded-lg p-6 shadow text-gray-700 flex items-center text-lg"><span className="text-blue-500 font-bold mr-2">✔</span> Revisão inteligente</li>
              <li className="bg-white rounded-lg p-6 shadow text-gray-700 flex items-center text-lg"><span className="text-blue-500 font-bold mr-2">✔</span> Estudo personalizado</li>
              <li className="bg-white rounded-lg p-6 shadow text-gray-700 flex items-center text-lg"><span className="text-blue-500 font-bold mr-2">✔</span> Progresso visual</li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32 flex justify-center">
          <div className="w-full max-w-[1600px] px-4 md:px-6 mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Perguntas Frequentes</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Tire suas dúvidas sobre o uso da plataforma FlashCard.</p>
            </motion.div>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[{
                  question: "Como funciona a repetição espaçada?",
                  answer: "A plataforma agenda revisões dos seus flashcards em intervalos estratégicos para potencializar a memorização.",
                }, {
                  question: "Posso criar meus próprios decks?",
                  answer: "Sim! Você pode criar, editar e organizar seus decks conforme sua necessidade.",
                }, {
                  question: "Consigo acompanhar meu progresso?",
                  answer: "Sim, o sistema mostra estatísticas e evolução do seu estudo.",
                }, {
                  question: "É seguro usar a plataforma?",
                  answer: "Sim, seus dados são protegidos e sua privacidade garantida.",
                }].map((faq, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-blue-600 to-blue-400 text-white relative overflow-hidden flex justify-center">
          <div className="w-full max-w-[1600px] px-4 md:px-6 relative mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Pronto para turbinar seus estudos?</h2>
              <p className="mx-auto max-w-[700px] text-white/80 md:text-xl">Comece agora a usar o FlashCard e potencialize sua memorização!</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base" asChild>
                  <Link href="/login">Começar Agora <ArrowRight className="ml-2 size-4" /></Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm flex justify-center">
        <div className="w-full max-w-[1600px] flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16 mx-auto">
          <div className="flex items-center gap-2 font-bold mb-4">
            <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white">F</div>
            <span>FlashCard</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} FlashCard. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
