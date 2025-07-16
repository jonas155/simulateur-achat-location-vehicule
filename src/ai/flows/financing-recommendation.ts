
// src/ai/flows/financing-recommendation.ts
'use server';

/**
 * @fileOverview A financing recommendation AI agent.
 *
 * - recommendFinancing - A function that handles the financing recommendation process.
 * - RecommendFinancingInput - The input type for the recommendFinancing function.
 * - RecommendFinancingOutput - The return type for the recommendFinancing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendFinancingInputSchema = z.object({
  vehiclePrice: z.number().describe('The price of the vehicle.'),
  duration: z.number().describe('The duration of the financing in years.'),
  mileage: z.number().describe('The annual mileage driven.'),
  monthlyPaymentLOA: z.number().optional().describe('The estimated monthly payment for LOA.'),
  monthlyPaymentLLD: z.number().optional().describe('The estimated monthly payment for LLD.'),
  monthlyPaymentCredit: z.number().optional().describe('The estimated monthly payment for a loan.'),
  downPayment: z.number().describe('The down payment amount.'),
  preferenceFlexibility: z.string().describe('Do you prefer flexibility? (yes/no)'),
  preferenceZeroContraint: z.string().describe('Do you prefer zero constraint? (yes/no)'),
  preferenceCostOptimization: z.string().describe('Do you prefer cost optimization? (yes/no)'),
});
export type RecommendFinancingInput = z.infer<typeof RecommendFinancingInputSchema>;

const RecommendFinancingOutputSchema = z.object({
  recommendation: z.string().describe('The recommended financing option (LOA, LLD, or Crédit).'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});
export type RecommendFinancingOutput = z.infer<typeof RecommendFinancingOutputSchema>;

export async function recommendFinancing(input: RecommendFinancingInput): Promise<RecommendFinancingOutput> {
  return recommendFinancingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFinancingPrompt',
  input: {schema: RecommendFinancingInputSchema},
  output: {schema: RecommendFinancingOutputSchema},
  prompt: `En fonction des informations suivantes, recommandez la meilleure option de financement de véhicule (LOA, LLD ou Crédit).

Prix du véhicule : {{vehiclePrice}}
Durée : {{duration}} ans
Kilométrage annuel : {{mileage}}
Mensualité LOA : {{monthlyPaymentLOA}}
Mensualité LLD : {{monthlyPaymentLLD}}
Mensualité Crédit : {{monthlyPaymentCredit}}
Apport : {{downPayment}}
Préférence Flexibilité : {{preferenceFlexibility}}
Préférence Zéro Contrainte : {{preferenceZeroContraint}}
Préférence Optimisation des coûts : {{preferenceCostOptimization}}

Considérez les points suivants :

- LOA : Idéal pour la flexibilité et l'option d'achat à la fin. Les mensualités sont souvent inférieures à celles d'un crédit.
- LLD : Idéal pour ceux qui ne veulent aucune contrainte, changent souvent de voiture et apprécient la facilité d'entretien. Vous ne serez jamais propriétaire du véhicule et le loyer est payé "à perte".
- Crédit : Vous êtes propriétaire du véhicule et le coût total est souvent inférieur si vous gardez la voiture plusieurs années. Vous êtes responsable de l'entretien et de la revente. Un taux d'intérêt élevé peut rendre le crédit moins attractif.

Répondez avec une recommandation et un raisonnement. La réponse doit être en français.
`,
});

const recommendFinancingFlow = ai.defineFlow(
  {
    name: 'recommendFinancingFlow',
    inputSchema: RecommendFinancingInputSchema,
    outputSchema: RecommendFinancingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
