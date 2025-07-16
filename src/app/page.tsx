
'use client';

import { useState } from 'react';
import { FinancingForm, type FormValues } from '@/components/financing-form';
import { ComparisonResults } from '@/components/comparison-results';
import {
  recommendFinancing,
  type RecommendFinancingOutput,
} from '@/ai/flows/financing-recommendation';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Car, PiggyBank, FileText, Loader2 } from 'lucide-react';

export interface TotalCosts {
  credit: number;
  loa: number;
  lld: number;
}

export type FullResult = RecommendFinancingOutput & {
  totalCosts: TotalCosts;
  formData: FormValues;
};

export default function Home() {
  const [result, setResult] = useState<FullResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleCalculate(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    try {
      const recommendation = await recommendFinancing(values);

      const totalCosts: TotalCosts = {
        credit: values.monthlyPaymentCredit * values.duration * 12 + values.downPayment,
        loa: values.monthlyPaymentLOA * values.duration * 12 + values.downPayment,
        lld: values.monthlyPaymentLLD * values.duration * 12 + values.downPayment,
      };

      setResult({ ...recommendation, totalCosts, formData: values });
    } catch (error) {
      console.error('Error getting financing recommendation:', error);
      toast({
        variant: 'destructive',
        title: "Erreur de l'analyse",
        description:
          "Une erreur est survenue lors de la communication avec l'IA. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-8 px-4 md:px-8 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            AutoFinance Analyzer
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Comparez LOA, LLD et crédit pour trouver le meilleur financement pour
            votre véhicule.
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky top-8">
            <FinancingForm onCalculate={handleCalculate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            {isLoading && (
              <Card className="flex flex-col items-center justify-center p-8 min-h-[500px] transition-all duration-300">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground font-medium">
                  Analyse des meilleures options pour vous...
                </p>
              </Card>
            )}
            {result && <ComparisonResults result={result} />}
            {!isLoading && !result && (
              <Card className="flex flex-col items-center justify-center p-8 min-h-[500px] text-center bg-card transition-all duration-300">
                <div className="flex space-x-8 text-primary/70">
                  <Car size={64} strokeWidth={1.5} />
                  <FileText size={64} strokeWidth={1.5} />
                  <PiggyBank size={64} strokeWidth={1.5} />
                </div>
                <h2 className="mt-6 text-2xl font-headline font-semibold">
                  Prêt à trouver le financement idéal ?
                </h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Entrez les détails de votre projet dans le formulaire pour voir
                  une comparaison détaillée et recevoir une recommandation
                  personnalisée de notre expert IA.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        <p>AutoFinance Analyzer</p>
      </footer>
    </div>
  );
}
