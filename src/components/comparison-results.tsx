import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import type { FullResult } from '@/app/page';

interface ComparisonResultsProps {
  result: FullResult;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const IconPositive = () => <CheckCircle className="h-5 w-5 text-green-500" />;
const IconNegative = () => <XCircle className="h-5 w-5 text-destructive" />;

export function ComparisonResults({ result }: ComparisonResultsProps) {
  const { recommendation, reasoning, totalCosts, formData } = result;

  const totalInterest = (formData.monthlyPaymentLoan * formData.duration * 12) - (formData.vehiclePrice - formData.downPayment);

  const comparisonData = [
    {
      criterion: 'Propriété en fin de contrat',
      loan: { text: 'Oui', icon: <IconPositive /> },
      loa: { text: 'Possible (si option levée)', icon: <IconPositive /> },
      lld: { text: 'Non, restitution', icon: <IconNegative /> },
    },
    {
      criterion: 'Coût total sur ' + formData.duration + ' ans',
      loan: { text: formatCurrency(totalCosts.loan), isBold: true },
      loa: { text: formatCurrency(totalCosts.loa), isBold: true },
      lld: { text: formatCurrency(totalCosts.lld), isBold: true },
    },
    {
        criterion: 'Détail du coût du crédit',
        loan: { text: `dont ${formatCurrency(totalInterest)} d'intérêts` },
        loa: { text: '-' },
        lld: { text: '-' },
    },
    {
        criterion: 'Mensualités',
        loan: { text: `${formatCurrency(formData.monthlyPaymentLoan)}/mois` },
        loa: { text: `${formatCurrency(formData.monthlyPaymentLOA)}/mois` },
        lld: { text: `${formatCurrency(formData.monthlyPaymentLLD)}/mois` },
    },
    {
      criterion: 'Kilométrage',
      loan: { text: 'Illimité', icon: <IconPositive /> },
      loa: { text: 'Limité', icon: <IconNegative /> },
      lld: { text: 'Limité', icon: <IconNegative /> },
    },
    {
      criterion: 'Entretien',
      loan: { text: 'À votre charge', icon: <IconNegative /> },
      loa: { text: 'Parfois inclus', icon: <IconPositive /> },
      lld: { text: 'Inclus', icon: <IconPositive /> },
    },
    {
      criterion: 'Flexibilité (revente, etc.)',
      loan: { text: 'Élevée', icon: <IconPositive /> },
      loa: { text: 'Moyenne', icon: <IconPositive /> },
      lld: { text: 'Faible', icon: <IconNegative /> },
    },
    {
      criterion: 'Apport initial',
      loan: { text: 'Souvent requis' },
      loa: { text: 'Faible ou nul' },
      lld: { text: 'Faible ou nul' },
    },
    {
      criterion: 'Idéal pour...',
      loan: { text: 'Garder > 5 ans, fort kilométrage' },
      loa: { text: 'Hésitation achat/location' },
      lld: { text: 'Changer souvent, simplicité' },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="bg-primary/5 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            Recommandation de l'Expert IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="text-lg bg-accent text-accent-foreground mb-4 py-1 px-3">
            {recommendation}
          </Badge>
          <p className="text-foreground/90 leading-relaxed">{reasoning}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Tableau Comparatif Détaillé
          </CardTitle>
          <CardDescription>
            Analyse des trois options de financement sur une durée de {formData.duration} ans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-[25%]">Critère</TableHead>
                  <TableHead className="font-bold text-center">Crédit Classique</TableHead>
                  <TableHead className="font-bold text-center">LOA</TableHead>
                  <TableHead className="font-bold text-center">LLD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((item) => (
                  <TableRow key={item.criterion}>
                    <TableCell className="font-medium">{item.criterion}</TableCell>
                    {[item.loan, item.loa, item.lld].map((option, index) => (
                      <TableCell key={index} className={`text-center ${option.isBold ? 'font-bold' : ''}`}>
                        <div className="flex items-center justify-center gap-2">
                           {option.icon}
                           <span>{option.text}</span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
