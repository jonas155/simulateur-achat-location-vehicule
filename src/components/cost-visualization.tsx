import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { DetailedResults } from "@/app/page";

interface CostVisualizationProps {
  detailedResults: DetailedResults;
  duration: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

const COLORS = ["#3B5998", "#008080", "#E74C3C"];

export function CostVisualization({
  detailedResults,
  duration,
}: CostVisualizationProps) {
  const { credit, loa, lld } = detailedResults;

  // Données pour le graphique comparatif
  const comparisonData = [
    {
      name: "Crédit",
      Mensualités: credit.monthlyPayment * duration * 12,
      Intérêts: credit.totalInterest,
      Assurance: credit.additionalFees.insurance,
      Entretien: credit.additionalFees.maintenance,
      Frais: credit.additionalFees.establishmentFee,
      Total: credit.totalCostUsage,
    },
    {
      name: "LOA",
      Mensualités: loa.monthlyPayment * duration * 12,
      "Option d'achat": loa.residualValue || 0,
      Assurance: loa.additionalFees.insurance,
      Pénalités: loa.additionalFees.penalties,
      Frais: loa.additionalFees.establishmentFee,
      Total: loa.totalCostOwnership,
    },
    {
      name: "LLD",
      Mensualités: lld.monthlyPayment * duration * 12,
      Pénalités: lld.additionalFees.penalties,
      Frais: lld.additionalFees.establishmentFee,
      Total: lld.totalCostUsage,
    },
  ];

  // Données pour le graphique en secteurs (coût d'usage)
  const usageCostData = [
    { name: "Crédit", value: credit.totalCostUsage, color: COLORS[0] },
    {
      name: "LOA (location seule)",
      value: loa.totalCostUsage,
      color: COLORS[1],
    },
    { name: "LLD", value: lld.totalCostUsage, color: COLORS[2] },
  ];

  // Évolution mensuelle des coûts cumulés
  const monthlyEvolutionData = Array.from(
    { length: duration * 12 },
    (_, index) => {
      const month = index + 1;
      return {
        mois: month,
        Crédit: credit.monthlyPayment * month,
        LOA: loa.monthlyPayment * month,
        LLD: lld.monthlyPayment * month,
      };
    }
  );

  return (
    <div className="space-y-6">
      {/* Graphique comparatif des coûts totaux */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des coûts totaux</CardTitle>
          <CardDescription>
            Analyse détaillée de tous les frais sur {duration} ans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="Mensualités" stackId="a" fill="#3B5998" />
              <Bar dataKey="Intérêts" stackId="a" fill="#E74C3C" />
              <Bar dataKey="Option d'achat" stackId="a" fill="#F39C12" />
              <Bar dataKey="Assurance" stackId="a" fill="#9B59B6" />
              <Bar dataKey="Entretien" stackId="a" fill="#1ABC9C" />
              <Bar dataKey="Pénalités" stackId="a" fill="#E67E22" />
              <Bar dataKey="Frais" stackId="a" fill="#95A5A6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en secteurs - Coût d'usage */}
        <Card>
          <CardHeader>
            <CardTitle>Coût d'usage comparé</CardTitle>
            <CardDescription>
              Coût réel d'utilisation sans considérer la propriété
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usageCostData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) =>
                    `${entry.name}: ${formatCurrency(entry.value)}`
                  }
                >
                  {usageCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Indicateurs clés */}
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs clés</CardTitle>
            <CardDescription>
              Métriques importantes pour votre décision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Option la plus économique (usage)</h4>
              <div className="text-2xl font-bold text-primary">
                {
                  usageCostData.reduce((min, current) =>
                    current.value < min.value ? current : min
                  ).name
                }
              </div>
              <p className="text-sm text-muted-foreground">
                Économise{" "}
                {formatCurrency(
                  Math.max(...usageCostData.map((d) => d.value)) -
                    Math.min(...usageCostData.map((d) => d.value))
                )}{" "}
                vs l'option la plus chère
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Valeur résiduelle (patrimoine)</h4>
              <div className="text-lg">
                <span className="font-bold text-green-600">
                  Crédit: {formatCurrency(credit.residualValue || 0)}
                </span>
                <br />
                <span className="font-bold text-blue-600">
                  LOA: {formatCurrency(loa.residualValue || 0)}
                </span>
                <br />
                <span className="text-muted-foreground">LLD: 0€</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Coût mensuel moyen</h4>
              <div className="text-sm space-y-1">
                <div>Crédit: {formatCurrency(credit.monthlyPayment)}</div>
                <div>LOA: {formatCurrency(loa.monthlyPayment)}</div>
                <div>LLD: {formatCurrency(lld.monthlyPayment)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Évolution mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des coûts cumulés</CardTitle>
          <CardDescription>
            Progression des paiements mensuels sur {duration} ans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyEvolutionData.filter((_, i) => i % 6 === 0)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="mois"
                label={{ value: "Mois", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="Crédit" fill="#3B5998" />
              <Bar dataKey="LOA" fill="#008080" />
              <Bar dataKey="LLD" fill="#E74C3C" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
