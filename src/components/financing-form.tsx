"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const formSchema = z.object({
  vehiclePrice: z.coerce
    .number()
    .min(1000, "Le prix doit être d'au moins 1000 €."),
  downPayment: z.coerce.number().min(0, "L'apport ne peut pas être négatif."),
  firstPaymentLOA: z.coerce
    .number()
    .min(0, "Le premier loyer ne peut pas être négatif."),
  firstPaymentLLD: z.coerce
    .number()
    .min(0, "Le premier loyer ne peut pas être négatif."),
  duration: z.coerce
    .number()
    .min(1, "La durée doit être d'au moins 1 an.")
    .max(10, "La durée ne peut pas dépasser 10 ans."),
  mileage: z.coerce
    .number()
    .min(1000, "Le kilométrage doit être d'au moins 1000 km."),
  interestRate: z.coerce
    .number()
    .min(0, "Le taux ne peut pas être négatif.")
    .max(20, "Le taux ne peut pas dépasser 20%."),
  creditDuration: z.coerce
    .number()
    .min(1, "La durée du crédit doit être d'au moins 1 an.")
    .max(10, "La durée du crédit ne peut pas dépasser 10 ans."),
  monthlyPaymentCredit: z.coerce
    .number()
    .min(1, "La mensualité doit être supérieure à 0."),
  monthlyPaymentLOA: z.coerce
    .number()
    .min(1, "La mensualité doit être supérieure à 0."),
  monthlyPaymentLLD: z.coerce
    .number()
    .min(1, "La mensualité doit être supérieure à 0."),
  residualValueRate: z.coerce
    .number()
    .min(20, "La valeur résiduelle doit être d'au moins 20%.")
    .max(80, "La valeur résiduelle ne peut pas dépasser 80%."),
  preferenceFlexibility: z.enum(["yes", "no"]),
  preferenceZeroContraint: z.enum(["yes", "no"]),
  preferenceCostOptimization: z.enum(["yes", "no"]),
});

export type FormValues = z.infer<typeof formSchema>;

interface FinancingFormProps {
  onCalculate: (values: FormValues) => Promise<void>;
  isLoading: boolean;
}

export function FinancingForm({ onCalculate, isLoading }: FinancingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiclePrice: 22000, // Prix plus représentatif du marché français (véhicule d'occasion récent)
      downPayment: 2000, // Apport modeste mais réaliste
      firstPaymentLOA: 0, // Premier loyer majoré LOA (optionnel)
      firstPaymentLLD: 0, // Premier loyer majoré LLD (optionnel)
      duration: 3, // Durée classique ajustée
      mileage: 12000, // Kilométrage moyen français (légèrement inférieur à 15k)
      interestRate: 5.8, // Taux actualisé selon le marché 2024
      creditDuration: 5, // Durée du crédit (remboursement réel)
      residualValueRate: 42, // Valeur résiduelle ajustée pour refléter la dépréciation actuelle
      monthlyPaymentCredit: 384, // Mensualité réaliste pour un crédit à 5.8% sur 5 ans
      monthlyPaymentLOA: 280, // Estimation réaliste pour LOA
      monthlyPaymentLLD: 264, // Estimation réaliste pour LLD
      preferenceFlexibility: "no",
      preferenceZeroContraint: "no",
      preferenceCostOptimization: "yes",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Vos informations
        </CardTitle>
        <CardDescription>
          Remplissez les détails pour obtenir une comparaison personnalisée.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
            {/* Durée de comparaison */}
            <div className="p-6 border-2 rounded-xl bg-primary/5 border-primary/20 shadow-sm card-hover fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <h3 className="font-semibold text-lg text-primary">
                  Durée de comparaison
                </h3>
              </div>
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-foreground font-medium">
                        Période d'analyse (années)
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">
                              Durée sur laquelle vous souhaitez comparer les
                              différentes options de financement
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ex: 3"
                        className="input-enhanced"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-6 border-2 rounded-xl bg-card border-border shadow-sm card-hover fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                <h3 className="font-semibold text-lg text-card-foreground">
                  Informations du véhicule
                </h3>
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="vehiclePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Prix du véhicule (€)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="ex: 22000"
                          className="input-enhanced"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Km / an
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="ex: 12000"
                          className="input-enhanced"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Options de financement
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-5 w-5 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-sm">
                          <strong>Important :</strong> Saisissez les mensualités
                          totales proposées par vos banques/concessionnaires,
                          intérêts et frais inclus. Ces montants serviront de
                          base à la comparaison.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  Comparez les trois principales options de financement
                  automobile.
                </p>

                {/* Crédit Classique */}
                <div className="p-6 border-2 rounded-xl bg-secondary/50 border-border shadow-sm card-hover slide-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <h5 className="font-semibold text-lg text-secondary-foreground">
                      Crédit Classique
                    </h5>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="monthlyPaymentCredit"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-foreground font-medium">
                                Mensualité (€)
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      Mensualité proposée par votre banque
                                      (capital + intérêts)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="ex: 384"
                                className="input-enhanced"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="downPayment"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-foreground font-medium">
                                Apport initial (€)
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      Réduit le capital à financer
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="ex: 2000"
                                className="input-enhanced"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="creditDuration"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-foreground font-medium">
                                Durée du crédit (ans)
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      Durée de remboursement du prêt (peut être
                                      différente de la durée de comparaison)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="ex: 5"
                                className="input-enhanced"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="interestRate"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-foreground font-medium">
                                Taux d'intérêt (%)
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      Taux annuel de votre crédit
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="ex: 5.8"
                                className="input-enhanced"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* LOA */}
                <div className="p-6 border-2 rounded-xl bg-muted/30 border-border shadow-sm card-hover slide-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <h5 className="font-semibold text-lg text-foreground">
                      LOA (Location avec Option d'Achat)
                    </h5>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="monthlyPaymentLOA"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-foreground font-medium">
                              Mensualité (€)
                            </FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    Mensualité proposée par le concessionnaire
                                    (hors option d'achat)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="ex: 280"
                              className="input-enhanced"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstPaymentLOA"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-blue-700 font-medium">
                                Premier loyer
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-blue-600 cursor-help hover:text-blue-800 transition-colors" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      Montant versé au début du contrat
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="ex: 0 (optionnel)"
                                className="border-blue-300 focus:border-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="residualValueRate"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-blue-700 font-medium">
                                Valeur résiduelle (%)
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-blue-600 cursor-help hover:text-blue-800 transition-colors" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      % de la valeur du véhicule en fin de
                                      contrat
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="ex: 42"
                                className="border-blue-300 focus:border-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* LLD */}
                <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <h5 className="font-semibold text-lg text-green-800">
                      LLD (Location Longue Durée)
                    </h5>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="monthlyPaymentLLD"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-green-700 font-medium">
                              Mensualité (€)
                            </FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-green-600 cursor-help hover:text-green-800 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    Mensualité proposée par le loueur (tout
                                    inclus)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="ex: 264"
                              className="border-green-300 focus:border-green-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstPaymentLLD"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-green-700 font-medium">
                              Premier loyer
                            </FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-green-600 cursor-help hover:text-green-800 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    Montant versé au début du contrat
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="ex: 0 (optionnel)"
                              className="border-green-300 focus:border-green-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <h3 className="font-semibold text-lg text-purple-800">
                  Vos préférences
                </h3>
              </div>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="preferenceFlexibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-700 font-medium text-base">
                        Privilégiez-vous la flexibilité (choix d'achat, etc) ?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-6 mt-3"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="yes"
                                className="border-purple-300 text-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-purple-700">
                              Oui
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="no"
                                className="border-purple-300 text-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-purple-700">
                              Non
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferenceZeroContraint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-700 font-medium text-base">
                        Souhaitez-vous zéro contrainte (entretien inclus,
                        changement facile) ?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-6 mt-3"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="yes"
                                className="border-purple-300 text-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-purple-700">
                              Oui
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="no"
                                className="border-purple-300 text-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-purple-700">
                              Non
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferenceCostOptimization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-700 font-medium text-base">
                        Votre but est-il d'optimiser le coût sur le long-terme ?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-6 mt-3"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="yes"
                                className="border-purple-300 text-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-purple-700">
                              Oui
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="no"
                                className="border-purple-300 text-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-purple-700">
                              Non
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gradient text-white font-semibold text-lg py-6 rounded-xl shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>📊</span>
                  <span>Comparer les options</span>
                </div>
              )}
              {isLoading && "Analyse en cours..."}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
