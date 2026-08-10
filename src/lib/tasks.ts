export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETE" | "FAILED";

export type Task = {
  id: string;
  pid: string;
  label: string;
  status: TaskStatus;
  progress: number;
  at: number;
};

let pidSeed = 4100;

/** Génère un identifiant de processus lisible type PID_7702. */
export function newPid(): string {
  pidSeed = (pidSeed + 37 + Math.floor(Math.random() * 91)) % 9899;
  return `PID_${(pidSeed + 100).toString().padStart(4, "0")}`;
}

/** Transforme une requête utilisateur en nom de tâche style console. */
export function taskLabel(prompt: string): string {
  const slug = prompt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join("_")
    .toUpperCase();
  return slug ? slug : "REQUETE_UTILISATEUR";
}

export const STATUS_TONE: Record<TaskStatus, string> = {
  PENDING: "text-muted-foreground",
  IN_PROGRESS: "text-primary",
  COMPLETE: "text-success",
  FAILED: "text-destructive",
};
