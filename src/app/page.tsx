"use client";

import { useState } from "react";
import { FinancingForm, type FormValues } from "@/components/financing-form";
import { ComparisonResults } from "@/components/comparison-results";
import {
  recommendFinancing,
  type RecommendFinancingOutput,
} from "@/ai/flows/financing-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Car, PiggyBank, FileText, Loader2, Heart } from "lucide-react";
import {
  calculateCredit,
  calculateLOA,
  calculateLLD,
  type DetailedCosts,
} from "@/lib/financial-calculations";

export interface TotalCosts {
  credit: number;
  loa: number;
  lld: number;
}

export interface DetailedResults {
  credit: DetailedCosts;
  loa: DetailedCosts;
  lld: DetailedCosts;
}

export type FullResult = RecommendFinancingOutput & {
  totalCosts: TotalCosts;
  detailedResults: DetailedResults;
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
      // Calculs détaillés pour chaque option
      const creditResults = calculateCredit({
        vehiclePrice: values.vehiclePrice,
        downPayment: values.downPayment,
        duration: values.duration,
        mileage: values.mileage,
        interestRate: values.interestRate,
        monthlyPayment: values.monthlyPaymentCredit,
      });

      const loaResults = calculateLOA({
        vehiclePrice: values.vehiclePrice,
        downPayment: values.downPayment,
        duration: values.duration,
        mileage: values.mileage,
        residualValueRate: values.residualValueRate,
        monthlyPayment: values.monthlyPaymentLOA,
      });

      const lldResults = calculateLLD({
        vehiclePrice: values.vehiclePrice,
        downPayment: values.downPayment,
        duration: values.duration,
        mileage: values.mileage,
        monthlyPayment: values.monthlyPaymentLLD,
      });

      const detailedResults: DetailedResults = {
        credit: creditResults,
        loa: loaResults,
        lld: lldResults,
      };

      // Calculs simplifiés pour compatibilité
      const totalCosts: TotalCosts = {
        credit: creditResults.totalCostUsage,
        loa: loaResults.totalCostUsage,
        lld: lldResults.totalCostUsage,
      };

      const recommendation = await recommendFinancing(values);

      setResult({
        ...recommendation,
        totalCosts,
        detailedResults,
        formData: values,
      });
    } catch (error) {
      console.error("Error getting financing recommendation:", error);
      toast({
        variant: "destructive",
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
            Comparateur location ou achat à crédit de voiture
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Comparez LOA, LLD et crédit pour trouver le meilleur financement
            pour votre véhicule.
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky top-8">
            <FinancingForm
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
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
                  Entrez les détails de votre projet dans le formulaire pour
                  voir une comparaison détaillée et recevoir une recommandation
                  personnalisée de notre expert IA.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
      <footer className="p-6 text-center border-t bg-card text-card-foreground">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="text-sm text-muted-foreground md:text-left">
            Un outil proposé par{" "}
            <a
              href="https://www.linkedin.com/in/jonas-millet/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              jonasmillet.dev
            </a>
          </div>
          <div className="text-sm text-muted-foreground md:text-right">
            Soutenir ce projet :{" "}
            <a
              href="https://buy.stripe.com/cNi9ATdpsbNt9COdi19fW00"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Faire un don <Heart size={16} className="text-red-500" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
