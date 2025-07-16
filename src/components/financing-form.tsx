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
  monthlyPaymentLoan: z.coerce.number().min(0, 'La mensualité ne peut pas être négative.'),
  monthlyPaymentLOA: z.coerce.number().min(0, 'La mensualité ne peut pas être négative.'),
  monthlyPaymentLLD: z.coerce.number().min(0, 'La mensualité ne peut pas être négative.'),
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
      vehiclePrice: 19450,
      downPayment: 0,
      duration: 4,
      mileage: 15000,
      monthlyPaymentLoan: 329,
      monthlyPaymentLOA: 304,
      monthlyPaymentLLD: 329,
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
              <h3 className="text-lg font-medium mb-4">Mensualités estimées (€)</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="monthlyPaymentLoan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crédit Classique</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 329" {...field} />
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
                        <Input type="number" placeholder="ex: 304" {...field} />
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
                        <Input type="number" placeholder="ex: 329" {...field} />
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
