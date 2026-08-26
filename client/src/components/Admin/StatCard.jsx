import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ label, value, icon: Icon, description, trend }) => {
  return (
    <Card className="border-neutral-800 bg-neutral-900/80 hover:border-neutral-700/80 transition-all duration-200">
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 m-0">
            {label}
          </p>
          <div className="text-2xl font-bold text-white tracking-tight">
            {value}
          </div>
          {description && (
            <p className="text-xs text-neutral-500 m-0 pt-0.5">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
