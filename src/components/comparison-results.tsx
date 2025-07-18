import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Euro,
  TrendingUp,
  BarChart3,
  Target,
  TableProperties,
} from "lucide-react";
import { CostVisualization } from "@/components/cost-visualization";
import type { FullResult } from "@/app/page";

interface ComparisonResultsProps {
  result: FullResult;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

const IconPositive = () => <CheckCircle className="h-5 w-5 text-green-500" />;
const IconNegative = () => <XCircle className="h-5 w-5 text-destructive" />;

export function ComparisonResults({ result }: ComparisonResultsProps) {
  const { recommendation, reasoning, totalCosts, detailedResults, formData } =
    result;

  const { credit, loa, lld } = detailedResults;

  const comparisonData = [
    {
      criterion: "Propriété en fin de contrat",
      credit: { text: "Oui", icon: <IconPositive /> },
      loa: { text: "Possible (si option levée)", icon: <IconPositive /> },
      lld: { text: "Non, restitution", icon: <IconNegative /> },
    },
    {
      criterion: "Coût d'usage sur " + formData.duration + " ans",
      credit: {
        text: formatCurrency(credit.totalCostUsage),
        isBold: true,
        subtext:
          credit.remainingDebt && credit.remainingDebt > 0
            ? `(dont ${formatCurrency(credit.remainingDebt)} restant dû)`
            : credit.totalInterest > 0
            ? `(dont ${formatCurrency(credit.totalInterest)} d'intérêts)`
            : undefined,
      },
      loa: {
        text: formatCurrency(loa.totalCostUsage),
        isBold: true,
        subtext: loa.residualValue
          ? `(+${formatCurrency(loa.residualValue!)} option d'achat)`
          : undefined,
      },
      lld: { text: formatCurrency(lld.totalCostUsage), isBold: true },
    },
    {
      criterion: "Mensualités",
      credit: { text: `${formatCurrency(credit.monthlyPayment)}/mois` },
      loa: { text: `${formatCurrency(loa.monthlyPayment)}/mois` },
      lld: { text: `${formatCurrency(lld.monthlyPayment)}/mois` },
    },
    {
      criterion: "Montants initiaux",
      credit: {
        text:
          formData.downPayment > 0
            ? `Apport: ${formatCurrency(formData.downPayment)}`
            : "Aucun apport",
        subtext: "Réduit le capital à financer",
      },
      loa: {
        text:
          formData.firstPaymentLOA > 0
            ? `1er loyer: ${formatCurrency(formData.firstPaymentLOA)}`
            : "Aucun premier loyer",
        subtext: "Premier loyer majoré (optionnel)",
      },
      lld: {
        text:
          formData.firstPaymentLLD > 0
            ? `1er loyer: ${formatCurrency(formData.firstPaymentLLD)}`
            : "Aucun premier loyer",
        subtext: "Premier loyer majoré (optionnel)",
      },
    },
    {
      criterion: "Capital restant dû",
      credit: {
        text:
          credit.remainingDebt && credit.remainingDebt > 0
            ? formatCurrency(credit.remainingDebt)
            : "Aucun",
        icon:
          credit.remainingDebt && credit.remainingDebt > 0 ? (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ),
      },
      loa: { text: "N/A", icon: <XCircle className="h-4 w-4 text-gray-400" /> },
      lld: { text: "N/A", icon: <XCircle className="h-4 w-4 text-gray-400" /> },
    },
    {
      criterion: "Valeur résiduelle estimée",
      credit: {
        text: formatCurrency(credit.residualValue || 0),
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      },
      loa: {
        text: formatCurrency(loa.residualValue || 0),
        icon: <Info className="h-4 w-4 text-blue-500" />,
      },
      lld: { text: "N/A", icon: <XCircle className="h-4 w-4 text-gray-400" /> },
    },
    {
      criterion: "Kilométrage",
      credit: { text: "Illimité", icon: <IconPositive /> },
      loa: {
        text: "Limité",
        icon: <IconNegative />,
        subtext:
          formData.mileage > 15000
            ? `Pénalité: ${formatCurrency(loa.additionalFees.penalties)}`
            : undefined,
      },
      lld: {
        text: "Limité",
        icon: <IconNegative />,
        subtext:
          formData.mileage > 15000
            ? `Pénalité: ${formatCurrency(lld.additionalFees.penalties)}`
            : undefined,
      },
    },
    {
      criterion: "Entretien",
      credit: {
        text: "À votre charge",
        icon: <IconNegative />,
        subtext: `${formatCurrency(credit.additionalFees.maintenance)} sur ${
          formData.duration
        } ans`,
      },
      loa: { text: "Parfois inclus", icon: <IconPositive /> },
      lld: { text: "Inclus", icon: <IconPositive /> },
    },
    {
      criterion: "Assurance",
      credit: {
        text: "Libre choix",
        icon: <IconPositive />,
        subtext: `Estimé: ${formatCurrency(credit.additionalFees.insurance)}`,
      },
      loa: {
        text: "Souvent imposée",
        subtext: `Estimé: ${formatCurrency(loa.additionalFees.insurance)}`,
      },
      lld: { text: "Incluse", icon: <IconPositive /> },
    },
    {
      criterion: "Frais d'établissement",
      credit: { text: formatCurrency(credit.additionalFees.establishmentFee) },
      loa: { text: formatCurrency(loa.additionalFees.establishmentFee) },
      lld: { text: formatCurrency(lld.additionalFees.establishmentFee) },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Tabs defaultValue="comparison" className="w-full">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
            Explorez les résultats :
          </h2>
          <TabsList className="grid w-full grid-cols-3 h-auto bg-muted/30 p-1 rounded-xl">
            <TabsTrigger
              value="comparison"
              className="flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all hover:bg-white hover:text-primary"
            >
              <TableProperties className="h-4 w-4" />
              Comparaison
            </TabsTrigger>
            <TabsTrigger
              value="costs"
              className="flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all hover:bg-white hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Analyse des coûts
            </TabsTrigger>
            <TabsTrigger
              value="scenarios"
              className="flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all hover:bg-white hover:text-primary"
            >
              <Target className="h-4 w-4" />
              Scénarios
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Tableau Comparatif Détaillé
              </CardTitle>
              <CardDescription>
                Analyse des trois options de financement sur une durée de{" "}
                {formData.duration} ans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold w-[25%]">
                        Critère
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Crédit Classique
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        LOA
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        LLD
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((item) => (
                      <TableRow key={item.criterion}>
                        <TableCell className="font-medium">
                          {item.criterion}
                        </TableCell>
                        {[item.credit, item.loa, item.lld].map(
                          (option, index) => (
                            <TableCell
                              key={index}
                              className={`text-center ${
                                option.isBold ? "font-bold" : ""
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center gap-2">
                                  {option.icon}
                                  <span>{option.text}</span>
                                </div>
                                {option.subtext && (
                                  <span className="text-xs text-muted-foreground">
                                    {option.subtext}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <CostVisualization
            detailedResults={detailedResults}
            duration={formData.duration}
          />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scénarios d'usage</CardTitle>
              <CardDescription>
                Recommandations selon votre profil et situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 text-green-600">
                    ✓ Crédit recommandé si:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Vous gardez le véhicule &gt; 5 ans</li>
                    <li>• Kilométrage élevé ({formData.mileage} km/an)</li>
                    <li>• Vous voulez être propriétaire</li>
                    <li>• Budget pour l'entretien disponible</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-600">
                    ✓ LOA recommandée si:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Vous hésitez entre achat/location</li>
                    <li>• Kilométrage modéré</li>
                    <li>• Flexibilité en fin de contrat</li>
                    <li>• Potentiel rachat ultérieur</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 text-purple-600">
                    ✓ LLD recommandée si:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Vous changez souvent de véhicule</li>
                    <li>• Vous voulez zéro contrainte</li>
                    <li>• Budget mensuel fixe souhaité</li>
                    <li>• Pas d'apport disponible</li>
                  </ul>
                </div>
              </div>

              {formData.mileage > 20000 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Attention - Kilométrage élevé
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Avec {formData.mileage.toLocaleString()} km/an, les
                        pénalités en LOA/LLD peuvent être importantes. Le crédit
                        classique est généralement plus avantageux pour les gros
                        rouleurs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
    </div>
  );
}
