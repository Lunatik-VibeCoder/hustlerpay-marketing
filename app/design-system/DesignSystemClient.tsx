"use client";

import { useState } from "react";
import { Button } from "@ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@ui/Card";
import { Input } from "@ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/Tabs";
import { Badge } from "@ui/Badge";
import { EmptyState } from "@ui/EmptyState";
import { Skeleton } from "@ui/Skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@ui/Dialog";
import { toast } from "@ui/Toast";
import { QuoteCard } from "@ui/QuoteCard";
import { CurrencyInput } from "@ui/CurrencyInput";
import { CountrySelector } from "@ui/CountrySelector";
import { colors } from "@theme/colors";

// WEB-CALC-1 Sprint A — living reference for the Design System, not a
// marketing page. Every component from packages/ui is rendered here so a
// real build (`next build`) exercises them, not just tsc on unused files.
// Also the fastest way for anyone to sanity-check the tokens/components
// together before Sprint B/C build real pages against them.
export default function DesignSystemClient() {
  const [amount, setAmount] = useState("100");
  const [country, setCountry] = useState("GH");

  return (
    <main className="mx-auto max-w-4xl space-y-12 p-8">
      <div>
        <h1 className="text-3xl font-bold">HustlerPay Design System</h1>
        <p className="text-muted-foreground mt-1">
          WEB-CALC-1 Sprint A — packages/theme + packages/ui reference page.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Colors</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {Object.entries(colors).map(([name, hex]) => (
            <div key={name} className="space-y-1">
              <div
                className="h-12 w-full rounded-md border border-border"
                style={{ backgroundColor: hex }}
              />
              <p className="text-xs text-muted-foreground truncate">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Card</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Standard card</CardTitle>
              <CardDescription>No emphasis, default border.</CardDescription>
            </CardHeader>
            <CardContent>Content goes here.</CardContent>
          </Card>
          <Card glow>
            <CardHeader>
              <CardTitle>Glow card</CardTitle>
              <CardDescription>Branded lime glow — use sparingly.</CardDescription>
            </CardHeader>
            <CardContent>Content goes here.</CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <div className="grid gap-3 sm:grid-cols-3 max-w-2xl">
          <Input placeholder="Nom complet" />
          <CurrencyInput currency="GHS" value={amount} onChange={setAmount} placeholder="0.00" />
          <CountrySelector
            options={[
              { code: "GH", label: "Ghana" },
              { code: "BJ", label: "Bénin" },
            ]}
            value={country}
            onChange={setCountry}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs</h2>
        <Tabs defaultValue="a" className="max-w-md">
          <TabsList>
            <TabsTrigger value="a">Onglet A</TabsTrigger>
            <TabsTrigger value="b">Onglet B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Contenu de l&apos;onglet A.</TabsContent>
          <TabsContent value="b">Contenu de l&apos;onglet B.</TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">QuoteCard</h2>
        <QuoteCard
          title="Exemple de devis"
          lines={[
            { label: "Montant", value: "100.00 GHS" },
            { label: "Frais", value: "2.50 GHS" },
            { label: "Total", value: "102.50 GHS", emphasize: true },
          ]}
          footnote="Exemple statique — aucune logique de calcul réelle (WEB-CALC-2)."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">EmptyState</h2>
        <EmptyState
          title="Aucun résultat"
          description="Exemple d'état vide générique."
          action={<Button size="sm">Réessayer</Button>}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skeleton</h2>
        <div className="space-y-2 max-w-sm">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog & Toast</h2>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Ouvrir le dialogue</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exemple de dialogue</DialogTitle>
                <DialogDescription>Contenu de démonstration.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Confirmer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="secondary" onClick={() => toast.success("Notification de test")}>
            Déclencher un toast
          </Button>
        </div>
      </section>
    </main>
  );
}
