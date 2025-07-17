
'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  vehiclePrice: z.coerce.number().min(1000, "Le prix doit être d'au moins 1000 €."),
  downPayment: z.coerce.number().min(0, "L'apport ne peut pas être négatif."),
  duration: z.coerce.number().min(1, "La durée doit être d'au moins 1 an.").max(10, 'La durée ne peut pas dépasser 10 ans.'),
  mileage: z.coerce.number().min(1000, "Le kilométrage doit être d'au moins 1000 km."),
  interestRate: z.coerce.number().min(0, 'Le taux ne peut pas être négatif.').max(20, 'Le taux ne peut pas dépasser 20%.'),
  monthlyPaymentCredit: z.coerce.number().min(1, 'La mensualité doit être supérieure à 0.'),
  monthlyPaymentLOA: z.coerce.number().min(1, 'La mensualité doit être supérieure à 0.'),
  monthlyPaymentLLD: z.coerce.number().min(1, 'La mensualité doit être supérieure à 0.'),
  residualValueRate: z.coerce.number().min(20, 'La valeur résiduelle doit être d\'au moins 20%.').max(80, 'La valeur résiduelle ne peut pas dépasser 80%.'),
  preferenceFlexibility: z.enum(['yes', 'no']),
  preferenceZeroContraint: z.enum(['yes', 'no']),
  preferenceCostOptimization: z.enum(['yes', 'no']),
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
      duration: 4, // Durée classique maintenue
      mileage: 12000, // Kilométrage moyen français (légèrement inférieur à 15k)
      interestRate: 5.8, // Taux actualisé selon le marché 2024
      residualValueRate: 42, // Valeur résiduelle ajustée pour refléter la dépréciation actuelle
      monthlyPaymentCredit: 420, // Estimation réaliste pour crédit
      monthlyPaymentLOA: 280, // Estimation réaliste pour LOA
      monthlyPaymentLLD: 264, // Estimation réaliste pour LLD
      preferenceFlexibility: 'no',
      preferenceZeroContraint: 'no',
      preferenceCostOptimization: 'yes',
    },
  });



  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Vos informations</CardTitle>
        <CardDescription>
          Remplissez les détails pour obtenir une comparaison personnalisée.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="vehiclePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix du véhicule (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ex: 19450" {...field} />
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
                    <FormLabel>Apport initial (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ex: 0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée (ans)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 4" {...field} />
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
                      <FormLabel>Km / an</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 15000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Paramètres de financement</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux d'intérêt crédit (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="ex: 5.8" {...field} />
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
                      <FormLabel>Valeur résiduelle LOA (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 42" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Mensualités proposées (€)</h4>
                <FormField
                  control={form.control}
                  name="monthlyPaymentCredit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crédit Classique</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 420" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyPaymentLOA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LOA</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 280" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyPaymentLLD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LLD</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 264" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Vos préférences</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="preferenceFlexibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privilégiez-vous la flexibilité (choix d'achat, etc) ?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Oui</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">Non</FormLabel>
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
                      <FormLabel>Souhaitez-vous zéro contrainte (entretien inclus, changement facile) ?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                           <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Oui</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">Non</FormLabel>
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
                      <FormLabel>Votre but est-il d'optimiser le coût sur le long-terme ?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                           <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Oui</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">Non</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6">
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : null}
              {isLoading ? 'Analyse en cours...' : 'Comparer les options'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
