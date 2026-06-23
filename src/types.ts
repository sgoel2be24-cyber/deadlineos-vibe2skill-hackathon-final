export interface MicroAction {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskState {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  delayed: boolean;
  stuck: boolean;
  skipped: boolean;
  deadline: string;
  category: string;
  microActions: MicroAction[];
}

export interface SmartDraft {
  id: string;
  title: string;
  recipient: string;
  content: string;
  type: 'email' | 'message' | 'document' | 'code';
}

export interface ScheduleBlock {
  id: string;
  time: string;
  taskTitle: string;
  duration: string;
  description: string;
  category: string;
}

export interface RescuePlan {
  risk: 'low' | 'medium' | 'high' | 'critical';
  doThisNow: {
    title: string;
    explanation: string;
    durationMinutes: number;
  };
  observation: string;
  conflictWarnings: string[];
  schedule: ScheduleBlock[];
  tasks: TaskState[];
  drafts: SmartDraft[];
  recommendations: string[];
}

export interface ReplanEvent {
  event: string;
  time: string;
}

export interface AgentState {
  current_time: string; // ISO timestamp
  latest_user_message: string;
  user_energy: 'low' | 'medium' | 'high';
  available_time_today_minutes: number;
  previous_plan_summary: string;
  current_task_state: TaskState[];
  replan_events: ReplanEvent[]; // Clean event log of replan actions
}
