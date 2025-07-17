
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
  prompt: `Vous êtes un expert en financement automobile. Analysez les données suivantes et recommandez la meilleure option entre Crédit, LOA et LLD.

DONNÉES VÉHICULE ET FINANCEMENT:
Prix du véhicule : {{vehiclePrice}}€
Durée de financement : {{duration}} ans
Kilométrage annuel : {{mileage}} km
Apport initial : {{downPayment}}€

MENSUALITÉS CALCULÉES:
Crédit classique : {{monthlyPaymentCredit}}€/mois
LOA : {{monthlyPaymentLOA}}€/mois  
LLD : {{monthlyPaymentLLD}}€/mois

PRÉFÉRENCES UTILISATEUR:
Flexibilité privilégiée : {{preferenceFlexibility}}
Zéro contrainte souhaité : {{preferenceZeroContraint}}
Optimisation des coûts : {{preferenceCostOptimization}}

CRITÈRES D'ANALYSE DÉTAILLÉS:

1. IMPACT KILOMÉTRAGE:
- Si >20 000 km/an : Crédit fortement recommandé (pas de pénalités)
- Si 15-20 000 km/an : Crédit avantageux, LOA possible avec vigilance
- Si <15 000 km/an : Toutes options viables

2. DURÉE DE CONSERVATION:
- Si durée >5 ans prévue : Crédit plus rentable (amortissement)
- Si 3-5 ans : LOA intéressante (flexibilité + option)
- Si <3 ans : LLD adaptée (simplicité)

3. ANALYSE FINANCIÈRE:
- Crédit : Coût total incluant intérêts, mais propriété + valeur résiduelle
- LOA : Mensualités plus faibles, option d'achat, mais engagement sur valeur résiduelle
- LLD : Budget fixe tout inclus, mais aucune valeur récupérée

4. CONTRAINTES ET SERVICES:
- Crédit : Liberté totale, mais gestion entretien/assurance
- LOA : Contraintes kilométriques, entretien parfois inclus
- LLD : Tout inclus (entretien, assurance), contraintes kilométriques

5. PROFILS TYPES:
- Gros rouleur (>20k km) : CRÉDIT obligatoire
- Familial stable : CRÉDIT ou LOA selon budget
- Urbain/changement fréquent : LLD optimal
- Budget serré/jeune conducteur : LLD ou LOA
- Investisseur/patrimoine : CRÉDIT

INSTRUCTIONS DE RECOMMANDATION:
1. Analysez PRIORITAIREMENT le kilométrage (facteur décisif)
2. Considérez les préférences utilisateur
3. Évaluez l'impact financier réel
4. Donnez une recommandation claire et un raisonnement détaillé
5. Mentionnez les points d'attention spécifiques

Répondez avec une recommandation précise et un raisonnement complet en français.
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
