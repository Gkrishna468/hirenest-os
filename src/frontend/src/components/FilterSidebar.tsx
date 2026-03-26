import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

const SKILL_OPTIONS = [
  "React",
  "Node.js",
  "Python",
  "Java",
  "AWS",
  "TypeScript",
  "Docker",
  "Kubernetes",
  "Go",
  "Kotlin",
  "Android",
  "Spark",
  "TensorFlow",
];
const LOCATION_OPTIONS = [
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Mumbai",
  "Delhi NCR",
];

export interface SidebarFilters {
  skills: string[];
  location: string;
  verifiedOnly: boolean;
  availability: string;
}

interface FilterSidebarProps {
  filters: SidebarFilters;
  onFiltersChange: (f: SidebarFilters) => void;
  mode?: "requirements" | "talent";
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  mode = "requirements",
}: FilterSidebarProps) {
  const [skillsOpen, setSkillsOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);

  const toggleSkill = (skill: string) => {
    const next = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    onFiltersChange({ ...filters, skills: next });
  };

  const clearAll = () =>
    onFiltersChange({
      skills: [],
      location: "",
      verifiedOnly: false,
      availability: "",
    });
  const hasFilters =
    filters.skills.length > 0 ||
    filters.location ||
    filters.verifiedOnly ||
    filters.availability;

  return (
    <aside className="w-64 flex-shrink-0 space-y-4" data-ocid="filter.panel">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-teal text-xs h-6 px-2"
            onClick={clearAll}
            data-ocid="filter.close_button"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Skills */}
      <div className="card-surface rounded-lg p-3 space-y-2">
        <button
          type="button"
          className="w-full flex items-center justify-between text-sm font-medium text-foreground"
          onClick={() => setSkillsOpen(!skillsOpen)}
        >
          Tech Stack
          {skillsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {skillsOpen && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SKILL_OPTIONS.map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-2 py-1 rounded-md text-xs font-medium border transition-colors ${
                  filters.skills.includes(skill)
                    ? "bg-teal/20 text-teal border-teal/50"
                    : "bg-muted/30 text-muted-foreground border-border hover:border-teal/30"
                }`}
                data-ocid="filter.toggle"
              >
                {filters.skills.includes(skill) && (
                  <X className="inline h-3 w-3 mr-0.5" />
                )}
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="card-surface rounded-lg p-3 space-y-2">
        <button
          type="button"
          className="w-full flex items-center justify-between text-sm font-medium text-foreground"
          onClick={() => setLocationOpen(!locationOpen)}
        >
          Location
          {locationOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {locationOpen && (
          <div className="space-y-1 pt-1">
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, location: "" })}
              className={`w-full text-left text-xs px-2 py-1 rounded transition-colors ${
                !filters.location
                  ? "text-teal font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Locations
            </button>
            {LOCATION_OPTIONS.map((loc) => (
              <button
                type="button"
                key={loc}
                onClick={() => onFiltersChange({ ...filters, location: loc })}
                className={`w-full text-left text-xs px-2 py-1 rounded transition-colors ${
                  filters.location === loc
                    ? "text-teal font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="filter.tab"
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Talent-specific filters */}
      {mode === "talent" && (
        <div className="card-surface rounded-lg p-3 space-y-3">
          <p className="text-sm font-medium text-foreground">Availability</p>
          {["available", "open", "busy"].map((a) => (
            <button
              type="button"
              key={a}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  availability: filters.availability === a ? "" : a,
                })
              }
              className={`w-full text-left text-xs px-2 py-1 rounded capitalize transition-colors ${
                filters.availability === a
                  ? "text-teal font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="filter.tab"
            >
              {a === "open"
                ? "Open to Offers"
                : a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
          <div className="flex items-center justify-between pt-1">
            <Label className="text-xs text-muted-foreground">
              Verified only
            </Label>
            <Switch
              checked={filters.verifiedOnly}
              onCheckedChange={(v) =>
                onFiltersChange({ ...filters, verifiedOnly: v })
              }
              data-ocid="filter.switch"
            />
          </div>
        </div>
      )}
    </aside>
  );
}
