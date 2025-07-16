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
  monthlyPaymentLoan: z.number().optional().describe('The estimated monthly payment for a loan.'),
  downPayment: z.number().describe('The down payment amount.'),
  preferenceFlexibility: z.string().describe('Do you prefer flexibility? (yes/no)'),
  preferenceZeroContraint: z.string().describe('Do you prefer zero constraint? (yes/no)'),
  preferenceCostOptimization: z.string().describe('Do you prefer cost optimization? (yes/no)'),
});
export type RecommendFinancingInput = z.infer<typeof RecommendFinancingInputSchema>;

const RecommendFinancingOutputSchema = z.object({
  recommendation: z.string().describe('The recommended financing option (LOA, LLD, or Loan).'),
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
  prompt: `Based on the following information, recommend the best vehicle financing option (LOA, LLD, or Loan).

Vehicle Price: {{vehiclePrice}}
Duration: {{duration}} years
Annual Mileage: {{mileage}}
Monthly Payment LOA: {{monthlyPaymentLOA}}
Monthly Payment LLD: {{monthlyPaymentLLD}}
Monthly Payment Loan: {{monthlyPaymentLoan}}
Down Payment: {{downPayment}}
Flexibility Preference: {{preferenceFlexibility}}
Zero Constraint Preference: {{preferenceZeroContraint}}
Cost Optimization Preference: {{preferenceCostOptimization}}

Consider the following:

- LOA: Ideal for flexibility and the option to purchase at the end. Monthly payments are often lower than a loan.
- LLD: Best for those who want zero constraints, frequent car changes, and easy maintenance. You will never own the vehicle, and the rent is paid "at a loss."
- Loan: You own the vehicle, and the total cost is often lower if you keep the car for several years. You are responsible for maintenance and resale.

Respond with a recommendation and reasoning.
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
